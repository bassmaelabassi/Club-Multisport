// Configuration des variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jest-tests';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-database';
process.env.PORT = 5001;

// Configuration pour les tests d'email
process.env.EMAIL_HOST = 'smtp.test.com';
process.env.EMAIL_PORT = 587;
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'test-password';

// Configuration pour Stripe (tests)
process.env.STRIPE_SECRET_KEY = 'sk_test_1234567890abcdef';
process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_1234567890abcdef';

// Configuration pour les notifications
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIREBASE_PRIVATE_KEY = 'test-private-key';
process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';

// Configuration pour les uploads
process.env.UPLOAD_PATH = './uploads/test';
process.env.MAX_FILE_SIZE = '5242880'; // 5MB

// Configuration pour les logs
process.env.LOG_LEVEL = 'error';

// Configuration pour les sessions
process.env.SESSION_SECRET = 'test-session-secret';

// Configuration pour les cookies
process.env.COOKIE_SECRET = 'test-cookie-secret';

// Configuration pour les CORS
process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:5173';

// Configuration pour les limites de taux
process.env.RATE_LIMIT_WINDOW_MS = '900000'; // 15 minutes
process.env.RATE_LIMIT_MAX = '100';

// Configuration pour la sécurité
process.env.BCRYPT_ROUNDS = '10';
process.env.JWT_EXPIRES_IN = '30d';

// Configuration pour les tests de base de données
process.env.TEST_DB_NAME = 'test-database';
process.env.TEST_DB_URI = 'mongodb://localhost:27017/test-database';

// Configuration pour les mocks
process.env.MOCK_EMAIL = 'true';
process.env.MOCK_PAYMENT = 'true';
process.env.MOCK_NOTIFICATIONS = 'true';

console.log('🔧 Variables d\'environnement de test configurées');
