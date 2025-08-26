// Configuration globale pour Jest
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock des modules externes
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: 'test-message-id',
      response: 'OK'
    }),
    verify: jest.fn().mockResolvedValue(true)
  })
}));

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_secret_123',
        status: 'requires_payment_method'
      }),
      retrieve: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded'
      })
    },
    customers: {
      create: jest.fn().mockResolvedValue({
        id: 'cus_test_123',
        email: 'test@example.com'
      })
    }
  }));
});

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  getMessaging: jest.fn().mockReturnValue({
    send: jest.fn().mockResolvedValue({
      messageId: 'test-notification-id'
    }),
    sendToTopic: jest.fn().mockResolvedValue({
      messageId: 'test-topic-notification-id'
    })
  })
}));

// Mock des utilitaires d'email
jest.mock('../utils/mailUtils', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendReservationConfirmation: jest.fn().mockResolvedValue(true),
  sendReservationCancellation: jest.fn().mockResolvedValue(true)
}));

// Configuration globale avant tous les tests
beforeAll(async () => {
  // Configuration des timeouts
  jest.setTimeout(30000);
  
  // Suppression des avertissements de console pendant les tests
  console.warn = jest.fn();
  console.error = jest.fn();
  
  // Configuration des mocks globaux
  global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  };
});

// Configuration après chaque test
afterEach(async () => {
  // Nettoyage des mocks
  jest.clearAllMocks();
  
  // Nettoyage des collections MongoDB si connecté
  if (mongoose.connection.readyState === 1) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Configuration après tous les tests
afterAll(async () => {
  // Fermeture de la connexion MongoDB
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  
  // Restauration des fonctions console
  global.console = console;
});

// Fonctions utilitaires globales pour les tests
global.createTestUser = async (userData = {}) => {
  const User = require('../models/User');
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    role: 'user'
  };
  
  const user = new User({ ...defaultUser, ...userData });
  await user.save();
  return user;
};

global.createTestActivity = async (activityData = {}) => {
  const Activity = require('../models/Activity');
  const defaultActivity = {
    name: 'Test Activity',
    description: 'Test Description',
    duration: 60,
    price: 25,
    maxParticipants: 15,
    category: 'fitness'
  };
  
  const activity = new Activity({ ...defaultActivity, ...activityData });
  await activity.save();
  return activity;
};

global.createTestCoach = async (coachData = {}) => {
  const Coach = require('../models/Coach');
  const defaultCoach = {
    firstName: 'Test',
    lastName: 'Coach',
    email: `coach-${Date.now()}@example.com`,
    specialties: ['yoga'],
    experience: 5,
    bio: 'Test bio'
  };
  
  const coach = new Coach({ ...defaultCoach, ...coachData });
  await coach.save();
  return coach;
};

global.generateTestToken = (userId) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

global.createTestReservation = async (user, activity, reservationData = {}) => {
  const Reservation = require('../models/Reservation');
  const defaultReservation = {
    userId: user._id,
    activityId: activity._id,
    date: new Date('2024-01-15T10:00:00Z'),
    status: 'pending'
  };
  
  const reservation = new Reservation({ ...defaultReservation, ...reservationData });
  await reservation.save();
  return reservation;
};

// Configuration des erreurs personnalisées
global.TestError = class TestError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'TestError';
    this.statusCode = statusCode;
  }
};

// Configuration des assertions personnalisées
expect.extend({
  toBeValidObjectId(received) {
    const pass = mongoose.Types.ObjectId.isValid(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid ObjectId`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid ObjectId`,
        pass: false,
      };
    }
  },
  
  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },
  
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid date`,
        pass: false,
      };
    }
  }
});

console.log('🔧 Configuration Jest terminée');
