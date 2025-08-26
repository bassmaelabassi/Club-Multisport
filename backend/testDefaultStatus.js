const mongoose = require('mongoose');
require('./models/Reservation');
require('./models/Activity');
require('./models/User');
require('dotenv').config();

const Reservation = mongoose.model('Reservation');
const Activity = mongoose.model('Activity');
const User = mongoose.model('User');

async function testDefaultStatus() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fillrouge');
    console.log('✅ Connecté à MongoDB');
    
    // Créer un utilisateur de test
    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    await testUser.save();
    console.log('✅ Utilisateur de test créé');
    
    // Créer une activité de test
    const testActivity = new Activity({
      name: 'Test Activity',
      description: 'Test Description',
      category: 'test',
      price: 50,
      location: 'Test Location',
      isActive: true
    });
    await testActivity.save();
    console.log('✅ Activité de test créée');
    
    // Créer une réservation SANS spécifier le statut
    const testReservation = new Reservation({
      user: testUser._id,
      activity: testActivity._id,
      schedule: {
        day: 'lundi',
        date: new Date('2024-01-15T10:00:00Z'),
        startTime: '10:00',
        endTime: '11:00'
      }
      // Pas de statut spécifié - devrait utiliser la valeur par défaut
    });
    
    await testReservation.save();
    console.log('✅ Réservation de test créée');
    
    // Vérifier le statut
    console.log(`\n📊 Statut de la réservation: ${testReservation.status}`);
    
    if (testReservation.status === 'pending') {
      console.log('✅ SUCCÈS: Le statut par défaut est bien "pending"');
    } else {
      console.log(`❌ ÉCHEC: Le statut par défaut est "${testReservation.status}" au lieu de "pending"`);
    }
    
    // Nettoyer les données de test
    await Reservation.deleteOne({ _id: testReservation._id });
    await Activity.deleteOne({ _id: testActivity._id });
    await User.deleteOne({ _id: testUser._id });
    console.log('✅ Données de test nettoyées');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
    process.exit(0);
  }
}

// Exécuter le test
testDefaultStatus();
