module.exports = {
  // Environnement de test
  testEnvironment: 'node',
  
  // Répertoires de test
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Répertoires à ignorer
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Collecte de la couverture de code
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middlewares/**/*.js',
    'utils/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/tests/**'
  ],
  
  // Répertoires de couverture à ignorer
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/coverage/',
    'jest.config.js',
    'server.js'
  ],
  
  // Seuils de couverture
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Répertoire de sortie pour les rapports de couverture
  coverageDirectory: 'coverage',
  
  // Types de rapports de couverture
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json'
  ],
  
  // Configuration des mocks
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Variables d'environnement pour les tests
  setupFiles: ['<rootDir>/tests/env.js'],
  
  // Timeout pour les tests
  testTimeout: 10000,
  
  // Verbosité des tests
  verbose: true,
  
  // Couleurs dans la sortie
  colors: true,
  
  // Détection des fuites de mémoire
  detectLeaks: true,
  detectOpenHandles: true,
  
  // Force la fermeture des handles ouverts
  forceExit: true,
  
  // Configuration des transformations
  transform: {},
  
  // Extensions de fichiers à traiter
  moduleFileExtensions: ['js', 'json'],
  
  // Configuration des modules
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  
  // Configuration des reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true
      }
    ]
  ],
  
  // Configuration des snapshots
  snapshotSerializers: [],
  
  // Configuration des timers
  timers: 'modern',
  
  // Configuration des globals
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};
