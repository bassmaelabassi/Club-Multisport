const Contact = require('../models/Contact');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { contactValidationSchema } = require('../utils/validate');
const { sendContactNotificationToAdmin, sendContactNotificationToCoach } = require('../utils/mailUtils');

const createContact = async (req, res) => {
  try {
    const { name, email, subject, message, activityId, coachId } = req.body;
    
  
    const contactData = {
      name,
      email,
      subject,
      message,
      activityId: activityId || undefined,
      coachId: coachId || undefined
    };

    if (req.user) {
      contactData.userId = req.user._id;
      contactData.email = req.user.email;
      if (!contactData.name) {
        contactData.name = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Utilisateur';
      }
    }

    const { error } = contactValidationSchema.validate({
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      coachId: contactData.coachId || undefined,
      activityId: contactData.activityId || undefined
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const contact = await Contact.create(contactData);

    try {
      let adminsAndCoaches;
      if (coachId) {
        const admins = await User.find({ role: 'admin', isActive: true });
        const coach = await User.find({ _id: coachId, role: 'coach', isActive: true });
        adminsAndCoaches = [...admins, ...coach];
      } else {
        adminsAndCoaches = await User.find({
          role: { $in: ['admin', 'coach'] },
          isActive: true
        });
      }

      const notifications = [];
      
      for (const user of adminsAndCoaches) {
        const notification = await Notification.create({
          user: user._id,
          title: 'Nouveau message de contact',
          message: `Nouveau message de ${name} (${email}): ${subject}`,
          type: 'contact',
          relatedEntity: {
            type: 'contact',
            id: contact._id
          }
        });
        
        notifications.push(notification);

        if (user.role === 'admin') {
          await sendContactNotificationToAdmin(user.email, contactData);
        } else if (user.role === 'coach') {
          await sendContactNotificationToCoach(user.email, contactData);
        }
      }

      console.log(`Notifications créées pour ${adminsAndCoaches.length} admins/coachs`);
      
      if (req.app.locals.io) {
        req.app.locals.io.emit('newContactMessage', {
          contact,
          notifications: notifications.length,
          timestamp: new Date()
        });
      }
      
    } catch (notificationError) {
      console.error('Erreur lors de la création des notifications:', notificationError);
    }

    res.status(201).json({
      message: 'Message envoyé avec succès',
      contact
    });
  } catch (error) {
    console.error('Erreur création contact:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const { senderType, onlyMine } = req.query;

    const filter = {};
    if (onlyMine === 'true' && req.user?.role === 'coach') {
      try {
        const Activity = require('../models/Activity');
        const myActivities = await Activity.find({ coach: req.user._id }).select('_id');
        const myActivityIds = myActivities.map(a => a._id);
        filter.$or = [
          { coachId: req.user._id },
          { activityId: { $in: myActivityIds } }
        ];
      } catch (e) {
        filter.coachId = req.user._id;
      }
    }

    const contacts = await Contact.find(filter)
      .populate('userId', 'firstName lastName email role')
      .populate('coachId', 'firstName lastName email role')
      .populate('activityId', 'name category')
      .sort({ createdAt: -1 });

    let filtered = contacts;
    if (senderType === 'guest') {
      filtered = contacts.filter(c => !c.userId);
    } else if (senderType === 'user' || senderType === 'coach') {
      filtered = contacts.filter(c => c.userId && c.userId.role === senderType);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des messages' });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('userId', 'firstName lastName email');

    if (!contact) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du message' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du message' });
  }
};

const replyToContact = async (req, res) => {
  try {
    const { adminReply } = req.body;

    if (!adminReply) {
      return res.status(400).json({ message: 'La réponse est requise' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status: 'replied',
        adminReply,
        repliedAt: new Date()
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // SMS supprimés: plus d'envoi de SMS pour les réponses de contact
    try {
      if (contact.userId) {
        await Notification.create({
          user: contact.userId,
          title: 'Réponse à votre message',
          message: (adminReply && adminReply.length > 120) ? `${adminReply.slice(0, 120)}…` : (adminReply || 'Vous avez reçu une réponse.'),
          type: 'contact',
          relatedEntity: {
            type: 'contact',
            id: contact._id
          }
        });
      }
    } catch (notificationErr) {
      console.error('Erreur lors de la création de la notification de réponse:', notificationErr);
    }

    res.json({
      message: 'Réponse envoyée avec succès',
      contact
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi de la réponse' });
  }
};

const getMyContacts = async (req, res) => {
  try {
    const userEmail = (req.user.email || '').toLowerCase();
    const fullName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim();
    const contacts = await Contact.find({
      $or: [
        { userId: req.user._id },
        { email: new RegExp(`^${userEmail}$`, 'i') },
        fullName ? { name: fullName } : { _id: null }
      ]
    }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de vos messages' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du message' });
  }
};

const getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const pending = await Contact.countDocuments({ status: 'pending' });
    const read = await Contact.countDocuments({ status: 'read' });
    const replied = await Contact.countDocuments({ status: 'replied' });

    res.json({
      total,
      pending,
      read,
      replied
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques' });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  markAsRead,
  replyToContact,
  deleteContact,
  getContactStats,
  getMyContacts
};
