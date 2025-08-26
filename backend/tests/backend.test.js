const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import de l'application
const app = require('../app');

// Import des modèles
const User = require('../models/User');
const Activity = require('../models/Activity');
const Coach = require('../models/Coach');
const Reservation = require('../models/Reservation');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');

// Import des contrôleurs
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const activityController = require('../controllers/activityController');
const coachController = require('../controllers/coachController');
const reservationController = require('../controllers/reservationController');
const reviewController = require('../controllers/reviewController');
const contactController = require('../controllers/contactController');
const notificationController = require('../controllers/notificationController');
const statsController = require('../controllers/statsController');

// Import des middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const errorHandler = require('../middlewares/errorHandler');

// Import des utilitaires
const { userValidationSchema } = require('../utils/validate');

let mongoServer;

// Configuration Jest
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Configuration des variables d'environnement pour les tests
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Nettoyer la base de données avant chaque test
  await User.deleteMany({});
  await Activity.deleteMany({});
  await Coach.deleteMany({});
  await Reservation.deleteMany({});
  await Review.deleteMany({});
  await Contact.deleteMany({});
  await Notification.deleteMany({});
});

// Fonction utilitaire pour créer un token JWT
const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Fonction utilitaire pour créer un utilisateur de test
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  };
  
  const user = new User({ ...defaultUser, ...userData });
  await user.save();
  return user;
};

// ============================================================================
// TESTS DES MODÈLES
// ============================================================================

describe('Modèles', () => {
  describe('User Model', () => {
    test('devrait créer un utilisateur valide', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      
      const user = new User(userData);
      await user.save();
      
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.role).toBe('user');
      expect(user.loyaltyPoints).toBe(0);
      expect(user.rating).toBe(0);
      expect(user.reviewsCount).toBe(0);
      expect(user.isActive).toBe(true);
      expect(user.password).not.toBe('password123'); // Doit être hashé
    });

    test('devrait hasher le mot de passe avant sauvegarde', async () => {
      const user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
      
      await user.save();
      expect(user.password).not.toBe('password123');
      expect(await bcrypt.compare('password123', user.password)).toBe(true);
    });

    test('devrait comparer correctement les mots de passe', async () => {
      const user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
      
      await user.save();
      
      expect(await user.comparePassword('password123')).toBe(true);
      expect(await user.comparePassword('wrongpassword')).toBe(false);
    });

    test('devrait rejeter un email en double', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      
      await new User(userData).save();
      
      const duplicateUser = new User({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password456'
      });
      
      await expect(duplicateUser.save()).rejects.toThrow();
    });
  });

  describe('Activity Model', () => {
    test('devrait créer une activité valide', async () => {
      const activityData = {
        name: 'Yoga',
        description: 'Cours de yoga relaxant',
        duration: 60,
        price: 25,
        maxParticipants: 15,
        category: 'fitness'
      };
      
      const activity = new Activity(activityData);
      await activity.save();
      
      expect(activity.name).toBe('Yoga');
      expect(activity.description).toBe('Cours de yoga relaxant');
      expect(activity.duration).toBe(60);
      expect(activity.price).toBe(25);
      expect(activity.maxParticipants).toBe(15);
      expect(activity.category).toBe('fitness');
      expect(activity.isActive).toBe(true);
    });
  });

  describe('Coach Model', () => {
    test('devrait créer un coach valide', async () => {
      const coachData = {
        firstName: 'Coach',
        lastName: 'Smith',
        email: 'coach@example.com',
        specialties: ['yoga', 'pilates'],
        experience: 5,
        bio: 'Coach expérimenté'
      };
      
      const coach = new Coach(coachData);
      await coach.save();
      
      expect(coach.firstName).toBe('Coach');
      expect(coach.lastName).toBe('Smith');
      expect(coach.email).toBe('coach@example.com');
      expect(coach.specialties).toEqual(['yoga', 'pilates']);
      expect(coach.experience).toBe(5);
      expect(coach.bio).toBe('Coach expérimenté');
      expect(coach.isActive).toBe(true);
    });
  });

  describe('Reservation Model', () => {
    test('devrait créer une réservation valide', async () => {
      const user = await createTestUser();
      const activity = new Activity({
        name: 'Yoga',
        duration: 60,
        price: 25
      });
      await activity.save();
      
      const reservationData = {
        userId: user._id,
        activityId: activity._id,
        date: new Date('2024-01-15T10:00:00Z'),
        status: 'pending'
      };
      
      const reservation = new Reservation(reservationData);
      await reservation.save();
      
      expect(reservation.userId.toString()).toBe(user._id.toString());
      expect(reservation.activityId.toString()).toBe(activity._id.toString());
      expect(reservation.status).toBe('pending');
    });
  });
});

// ============================================================================
// TESTS DES CONTRÔLEURS
// ============================================================================

describe('Contrôleurs', () => {
  describe('AuthController', () => {
    test('devrait enregistrer un nouvel utilisateur', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      const req = {
        body: userData
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const next = jest.fn();
      
      await authController.registerUser(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'user',
          token: expect.any(String)
        })
      );
    });

    test('devrait connecter un utilisateur existant', async () => {
      const user = await createTestUser({
        email: 'test@example.com',
        password: 'password123'
      });
      
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      
      const res = {
        json: jest.fn()
      };
      
      const next = jest.fn();
      
      await authController.loginUser(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          token: expect.any(String)
        })
      );
    });

    test('devrait rejeter la connexion avec des identifiants invalides', async () => {
      const req = {
        body: {
          email: 'wrong@example.com',
          password: 'wrongpassword'
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const next = jest.fn();
      
      await authController.loginUser(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });

    test('devrait récupérer le profil utilisateur', async () => {
      const user = await createTestUser();
      
      const req = {
        user: { _id: user._id }
      };
      
      const res = {
        json: jest.fn()
      };
      
      const next = jest.fn();
      
      await authController.getMe(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        })
      );
    });
  });

  describe('UserController', () => {
    test('devrait récupérer tous les utilisateurs', async () => {
      await createTestUser({ email: 'user1@example.com' });
      await createTestUser({ email: 'user2@example.com' });
      
      const req = {};
      const res = {
        json: jest.fn()
      };
      const next = jest.fn();
      
      await userController.getUsers(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ email: 'user1@example.com' }),
          expect.objectContaining({ email: 'user2@example.com' })
        ])
      );
    });

    test('devrait récupérer un utilisateur par ID', async () => {
      const user = await createTestUser();
      
      const req = {
        params: { id: user._id }
      };
      
      const res = {
        json: jest.fn()
      };
      
      const next = jest.fn();
      
      await userController.getUserById(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: user._id.toString(),
          email: user.email
        })
      );
    });
  });

  describe('ActivityController', () => {
    test('devrait créer une nouvelle activité', async () => {
      const activityData = {
        name: 'Yoga',
        description: 'Cours de yoga',
        duration: 60,
        price: 25,
        maxParticipants: 15,
        category: 'fitness'
      };
      
      const req = {
        body: activityData
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const next = jest.fn();
      
      await activityController.createActivity(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Yoga',
          description: 'Cours de yoga',
          duration: 60,
          price: 25
        })
      );
    });

    test('devrait récupérer toutes les activités', async () => {
      const activity1 = new Activity({
        name: 'Yoga',
        duration: 60,
        price: 25
      });
      await activity1.save();
      
      const activity2 = new Activity({
        name: 'Pilates',
        duration: 45,
        price: 20
      });
      await activity2.save();
      
      const req = {};
      const res = {
        json: jest.fn()
      };
      const next = jest.fn();
      
      await activityController.getActivities(req, res, next);
      
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Yoga' }),
          expect.objectContaining({ name: 'Pilates' })
        ])
      );
    });
  });

  describe('ReservationController', () => {
    test('devrait créer une nouvelle réservation', async () => {
      const user = await createTestUser();
      const activity = new Activity({
        name: 'Yoga',
        duration: 60,
        price: 25
      });
      await activity.save();
      
      const reservationData = {
        activityId: activity._id,
        date: '2024-01-15T10:00:00Z'
      };
      
      const req = {
        body: reservationData,
        user: { _id: user._id }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const next = jest.fn();
      
      await reservationController.createReservation(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: user._id.toString(),
          activityId: activity._id.toString(),
          status: 'pending'
        })
      );
    });
  });
});

// ============================================================================
// TESTS DES MIDDLEWARES
// ============================================================================

describe('Middlewares', () => {
  describe('AuthMiddleware', () => {
    test('devrait autoriser l\'accès avec un token valide', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id);
      
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      
      const res = {};
      const next = jest.fn();
      
      await authMiddleware(req, res, next);
      
      expect(req.user).toBeDefined();
      expect(req.user._id.toString()).toBe(user._id.toString());
      expect(next).toHaveBeenCalled();
    });

    test('devrait rejeter l\'accès sans token', async () => {
      const req = {
        headers: {}
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const next = jest.fn();
      
      await authMiddleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, no token'
      });
    });

    test('devrait rejeter l\'accès avec un token invalide', async () => {
      const req = {
        headers: {
          authorization: 'Bearer invalid-token'
        }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const next = jest.fn();
      
      await authMiddleware(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
    });
  });

  describe('RoleMiddleware', () => {
    test('devrait autoriser l\'accès pour un rôle autorisé', async () => {
      const user = await createTestUser({ role: 'admin' });
      
      const req = {
        user: user
      };
      
      const res = {};
      const next = jest.fn();
      
      const adminOnly = roleMiddleware(['admin']);
      await adminOnly(req, res, next);
      
      expect(next).toHaveBeenCalled();
    });

    test('devrait rejeter l\'accès pour un rôle non autorisé', async () => {
      const user = await createTestUser({ role: 'user' });
      
      const req = {
        user: user
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const next = jest.fn();
      
      const adminOnly = roleMiddleware(['admin']);
      await adminOnly(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Access denied. Insufficient permissions.'
      });
    });
  });

  describe('ErrorHandler', () => {
    test('devrait gérer les erreurs de validation', async () => {
      const error = new Error('Validation error');
      error.name = 'ValidationError';
      
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation error'
      });
    });

    test('devrait gérer les erreurs de cast MongoDB', async () => {
      const error = new Error('Cast to ObjectId failed');
      error.name = 'CastError';
      
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid ID format'
      });
    });
  });
});

// ============================================================================
// TESTS DES ROUTES
// ============================================================================

describe('Routes', () => {
  describe('Auth Routes', () => {
    test('POST /api/auth/register - devrait enregistrer un utilisateur', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe('john@example.com');
      expect(response.body.firstName).toBe('John');
      expect(response.body.lastName).toBe('Doe');
    });

    test('POST /api/auth/login - devrait connecter un utilisateur', async () => {
      const user = await createTestUser({
        email: 'test@example.com',
        password: 'password123'
      });
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe('test@example.com');
    });

    test('GET /api/auth/me - devrait récupérer le profil utilisateur', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id);
      
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.email).toBe(user.email);
      expect(response.body.firstName).toBe(user.firstName);
      expect(response.body.lastName).toBe(user.lastName);
    });
  });

  describe('User Routes', () => {
    test('GET /api/users - devrait récupérer tous les utilisateurs', async () => {
      const admin = await createTestUser({ role: 'admin' });
      const token = generateTestToken(admin._id);
      
      await createTestUser({ email: 'user1@example.com' });
      await createTestUser({ email: 'user2@example.com' });
      
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    test('GET /api/users/:id - devrait récupérer un utilisateur par ID', async () => {
      const admin = await createTestUser({ role: 'admin' });
      const token = generateTestToken(admin._id);
      
      const user = await createTestUser({ email: 'test@example.com' });
      
      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.email).toBe('test@example.com');
    });
  });

  describe('Activity Routes', () => {
    test('GET /api/activities - devrait récupérer toutes les activités', async () => {
      const activity1 = new Activity({
        name: 'Yoga',
        duration: 60,
        price: 25
      });
      await activity1.save();
      
      const activity2 = new Activity({
        name: 'Pilates',
        duration: 45,
        price: 20
      });
      await activity2.save();
      
      const response = await request(app)
        .get('/api/activities')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    test('POST /api/activities - devrait créer une nouvelle activité', async () => {
      const admin = await createTestUser({ role: 'admin' });
      const token = generateTestToken(admin._id);
      
      const activityData = {
        name: 'Yoga',
        description: 'Cours de yoga relaxant',
        duration: 60,
        price: 25,
        maxParticipants: 15,
        category: 'fitness'
      };
      
      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${token}`)
        .send(activityData)
        .expect(201);
      
      expect(response.body.name).toBe('Yoga');
      expect(response.body.description).toBe('Cours de yoga relaxant');
      expect(response.body.duration).toBe(60);
      expect(response.body.price).toBe(25);
    });
  });

  describe('Reservation Routes', () => {
    test('POST /api/reservations - devrait créer une nouvelle réservation', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id);
      
      const activity = new Activity({
        name: 'Yoga',
        duration: 60,
        price: 25
      });
      await activity.save();
      
      const reservationData = {
        activityId: activity._id,
        date: '2024-01-15T10:00:00Z'
      };
      
      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${token}`)
        .send(reservationData)
        .expect(201);
      
      expect(response.body.userId).toBe(user._id.toString());
      expect(response.body.activityId).toBe(activity._id.toString());
      expect(response.body.status).toBe('pending');
    });

    test('GET /api/reservations - devrait récupérer les réservations de l\'utilisateur', async () => {
      const user = await createTestUser();
      const token = generateTestToken(user._id);
      
      const response = await request(app)
        .get('/api/reservations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});

// ============================================================================
// TESTS DES UTILITAIRES
// ============================================================================

describe('Utilitaires', () => {
  describe('Validation', () => {
    test('devrait valider un utilisateur valide', () => {
      const validUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      const { error } = userValidationSchema.validate(validUser);
      expect(error).toBeUndefined();
    });

    test('devrait rejeter un utilisateur avec email invalide', () => {
      const invalidUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      const { error } = userValidationSchema.validate(invalidUser);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('email');
    });

    test('devrait rejeter un utilisateur avec mot de passe trop court', () => {
      const invalidUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123',
        confirmPassword: '123'
      };
      
      const { error } = userValidationSchema.validate(invalidUser);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('password');
    });
  });
});

// ============================================================================
// TESTS D'INTÉGRATION
// ============================================================================

describe('Tests d\'intégration', () => {
  test('devrait permettre le cycle complet: inscription -> connexion -> réservation', async () => {
    // 1. Créer une activité
    const admin = await createTestUser({ role: 'admin' });
    const adminToken = generateTestToken(admin._id);
    
    const activityResponse = await request(app)
      .post('/api/activities')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Yoga',
        description: 'Cours de yoga',
        duration: 60,
        price: 25,
        maxParticipants: 15,
        category: 'fitness'
      })
      .expect(201);
    
    const activityId = activityResponse.body._id;
    
    // 2. Inscription d'un nouvel utilisateur
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })
      .expect(201);
    
    const userToken = registerResponse.body.token;
    
    // 3. Créer une réservation
    const reservationResponse = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        activityId: activityId,
        date: '2024-01-15T10:00:00Z'
      })
      .expect(201);
    
    expect(reservationResponse.body.activityId).toBe(activityId);
    expect(reservationResponse.body.status).toBe('pending');
    
    // 4. Vérifier que la réservation apparaît dans la liste
    const reservationsResponse = await request(app)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    
    expect(reservationsResponse.body).toHaveLength(1);
    expect(reservationsResponse.body[0].activityId).toBe(activityId);
  });

  test('devrait gérer les erreurs de validation correctement', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: '123',
        confirmPassword: '123'
      })
      .expect(400);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('email');
  });

  test('devrait respecter les limites de taux', async () => {
    // Faire plusieurs requêtes rapides pour déclencher la limite de taux
    const promises = Array(105).fill().map(() => 
      request(app).get('/api/activities')
    );
    
    const responses = await Promise.all(promises);
    const tooManyRequests = responses.filter(res => res.status === 429);
    
    expect(tooManyRequests.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// TESTS DE SÉCURITÉ
// ============================================================================

describe('Sécurité', () => {
  test('devrait rejeter les requêtes sans authentification pour les routes protégées', async () => {
    await request(app)
      .get('/api/users')
      .expect(401);
  });

  test('devrait rejeter les tokens expirés', async () => {
    const expiredToken = jwt.sign(
      { id: '507f1f77bcf86cd799439011' },
      process.env.JWT_SECRET,
      { expiresIn: '0s' }
    );
    
    await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
  });

  test('devrait rejeter les tokens malformés', async () => {
    await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer malformed-token')
      .expect(401);
  });

  test('devrait empêcher l\'accès aux routes admin pour les utilisateurs normaux', async () => {
    const user = await createTestUser({ role: 'user' });
    const token = generateTestToken(user._id);
    
    await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});

// ============================================================================
// TESTS DE PERFORMANCE
// ============================================================================

describe('Performance', () => {
  test('devrait gérer efficacement les requêtes multiples', async () => {
    const startTime = Date.now();
    
    const promises = Array(10).fill().map(() => 
      request(app).get('/api/activities')
    );
    
    await Promise.all(promises);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Les 10 requêtes devraient être traitées en moins de 2 secondes
    expect(duration).toBeLessThan(2000);
  });

  test('devrait gérer efficacement les requêtes avec authentification', async () => {
    const user = await createTestUser();
    const token = generateTestToken(user._id);
    
    const startTime = Date.now();
    
    const promises = Array(5).fill().map(() => 
      request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
    );
    
    await Promise.all(promises);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Les 5 requêtes authentifiées devraient être traitées en moins de 1 seconde
    expect(duration).toBeLessThan(1000);
  });
});

console.log('🎯 Tests Jest pour le backend créés avec succès !');
console.log('📋 Pour exécuter les tests :');
console.log('   npm test                    # Exécuter tous les tests');
console.log('   npm run test:watch          # Mode watch');
console.log('   npm run test:coverage       # Avec couverture de code');
