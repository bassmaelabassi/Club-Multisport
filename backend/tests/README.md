# Tests Jest pour le Backend

Ce dossier contient tous les tests Jest pour le backend de l'application de gestion de salle de sport.

## 📁 Structure des Tests

```
tests/
├── backend.test.js      # Tests principaux du backend
├── setup.js             # Configuration globale des tests
├── env.js               # Variables d'environnement pour les tests
└── README.md           # Ce fichier
```

## 🚀 Exécution des Tests

### Commandes disponibles

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch (redémarrage automatique)
npm run test:watch

# Exécuter les tests avec couverture de code
npm run test:coverage

# Exécuter un test spécifique
npm test -- --testNamePattern="AuthController"

# Exécuter les tests d'un fichier spécifique
npm test -- tests/backend.test.js

# Exécuter les tests en mode verbose
npm test -- --verbose
```

### Options de ligne de commande

```bash
# Exécuter les tests avec un timeout personnalisé
npm test -- --testTimeout=15000

# Exécuter les tests en mode debug
npm test -- --detectOpenHandles

# Exécuter les tests avec un reporter spécifique
npm test -- --reporter=verbose
```

## 📊 Couverture de Code

Les tests génèrent automatiquement des rapports de couverture de code dans le dossier `coverage/`.

### Seuils de couverture

- **Branches** : 70%
- **Fonctions** : 70%
- **Lignes** : 70%
- **Statements** : 70%

### Types de rapports

- **HTML** : `coverage/lcov-report/index.html`
- **JSON** : `coverage/coverage-final.json`
- **LCOV** : `coverage/lcov.info`
- **Console** : Affichage dans le terminal

## 🧪 Types de Tests

### 1. Tests des Modèles (Models)

Testent la validation, les hooks et les méthodes des modèles Mongoose :

- **User Model** : Création, validation, hashage des mots de passe
- **Activity Model** : Création et validation des activités
- **Coach Model** : Création et validation des coaches
- **Reservation Model** : Création et validation des réservations

### 2. Tests des Contrôleurs (Controllers)

Testent la logique métier des contrôleurs :

- **AuthController** : Inscription, connexion, récupération de profil
- **UserController** : Gestion des utilisateurs
- **ActivityController** : Gestion des activités
- **ReservationController** : Gestion des réservations

### 3. Tests des Middlewares

Testent les middlewares d'authentification et d'autorisation :

- **AuthMiddleware** : Validation des tokens JWT
- **RoleMiddleware** : Vérification des rôles utilisateur
- **ErrorHandler** : Gestion des erreurs

### 4. Tests des Routes

Testent les endpoints API avec Supertest :

- **Auth Routes** : `/api/auth/*`
- **User Routes** : `/api/users/*`
- **Activity Routes** : `/api/activities/*`
- **Reservation Routes** : `/api/reservations/*`

### 5. Tests d'Intégration

Testent les flux complets de l'application :

- Cycle complet : Inscription → Connexion → Réservation
- Gestion des erreurs de validation
- Respect des limites de taux

### 6. Tests de Sécurité

Testent les aspects de sécurité :

- Validation des tokens JWT
- Protection des routes sensibles
- Gestion des rôles et permissions

### 7. Tests de Performance

Testent les performances de l'API :

- Gestion des requêtes multiples
- Temps de réponse des endpoints

## 🔧 Configuration

### Variables d'Environnement

Les tests utilisent des variables d'environnement spécifiques définies dans `tests/env.js` :

```javascript
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-database';
```

### Mocks

Les services externes sont mockés pour les tests :

- **Nodemailer** : Envoi d'emails
- **Stripe** : Paiements
- **Firebase** : Notifications
- **MailUtils** : Utilitaires d'email

### Base de Données de Test

Les tests utilisent MongoDB Memory Server pour une base de données isolée :

- Base de données en mémoire
- Nettoyage automatique entre les tests
- Pas d'impact sur la base de données de développement

## 🛠️ Fonctions Utilitaires

### Fonctions Globales

```javascript
// Créer un utilisateur de test
const user = await createTestUser({
  email: 'test@example.com',
  role: 'admin'
});

// Créer une activité de test
const activity = await createTestActivity({
  name: 'Yoga',
  price: 25
});

// Créer un coach de test
const coach = await createTestCoach({
  specialties: ['yoga', 'pilates']
});

// Générer un token JWT de test
const token = generateTestToken(user._id);

// Créer une réservation de test
const reservation = await createTestReservation(user, activity);
```

### Assertions Personnalisées

```javascript
// Vérifier un ObjectId MongoDB
expect(userId).toBeValidObjectId();

// Vérifier un email valide
expect(email).toBeValidEmail();

// Vérifier une date valide
expect(date).toBeValidDate();
```

## 📝 Écriture de Nouveaux Tests

### Structure d'un Test

```javascript
describe('Nom du Module', () => {
  describe('Nom de la Fonctionnalité', () => {
    test('devrait faire quelque chose', async () => {
      // Arrange (Préparation)
      const user = await createTestUser();
      
      // Act (Action)
      const result = await someFunction(user);
      
      // Assert (Vérification)
      expect(result).toBeDefined();
      expect(result.email).toBe(user.email);
    });
  });
});
```

### Bonnes Pratiques

1. **Nommage** : Utilisez des noms descriptifs en français
2. **Structure AAA** : Arrange, Act, Assert
3. **Isolation** : Chaque test doit être indépendant
4. **Nettoyage** : Les données sont automatiquement nettoyées
5. **Mocks** : Utilisez les mocks pour les services externes

### Exemple de Test Complet

```javascript
describe('UserController', () => {
  test('devrait créer un nouvel utilisateur', async () => {
    // Arrange
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };
    
    const req = { body: userData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();
    
    // Act
    await userController.createUser(req, res, next);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      })
    );
  });
});
```

## 🐛 Débogage des Tests

### Mode Debug

```bash
# Exécuter un test spécifique en mode debug
npm test -- --testNamePattern="AuthController" --verbose --detectOpenHandles
```

### Logs de Test

```javascript
// Activer les logs dans un test
console.log('Debug info:', someVariable);

// Vérifier les appels de mocks
expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
```

### Timeout des Tests

```javascript
// Augmenter le timeout pour un test spécifique
test('test lent', async () => {
  // Test avec timeout personnalisé
}, 30000);
```

## 📈 Métriques et Rapports

### Rapports de Couverture

Après l'exécution des tests, consultez :

- `coverage/lcov-report/index.html` : Rapport HTML détaillé
- `coverage/coverage-summary.json` : Résumé JSON
- Console : Affichage des métriques

### Métriques Importantes

- **Couverture de lignes** : Pourcentage de lignes exécutées
- **Couverture de branches** : Pourcentage de branches testées
- **Couverture de fonctions** : Pourcentage de fonctions appelées
- **Statements** : Pourcentage d'instructions exécutées

## 🔄 Intégration Continue

### GitHub Actions

Les tests peuvent être intégrés dans un workflow CI/CD :

```yaml
- name: Run Tests
  run: |
    cd backend
    npm install
    npm test
    npm run test:coverage
```

### Pré-commit Hooks

Configurez des hooks pour exécuter les tests avant chaque commit :

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test"
    }
  }
}
```

## 🆘 Dépannage

### Problèmes Courants

1. **Timeout des tests** : Augmentez le timeout ou optimisez les tests
2. **Erreurs de connexion DB** : Vérifiez MongoDB Memory Server
3. **Mocks non fonctionnels** : Vérifiez la configuration des mocks
4. **Variables d'environnement** : Vérifiez `tests/env.js`

### Commandes de Diagnostic

```bash
# Vérifier la configuration Jest
npm test -- --showConfig

# Exécuter les tests avec plus de détails
npm test -- --verbose --detectOpenHandles

# Vérifier les dépendances
npm ls jest supertest mongodb-memory-server
```

## 📚 Ressources

- [Documentation Jest](https://jestjs.io/docs/getting-started)
- [Documentation Supertest](https://github.com/visionmedia/supertest)
- [Documentation MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Bonnes pratiques de test](https://jestjs.io/docs/best-practices)

---

**Note** : Ces tests garantissent la qualité et la fiabilité du backend. Exécutez-les régulièrement pour maintenir la stabilité de l'application.
