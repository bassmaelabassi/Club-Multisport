const axios = require('axios');

const API_BASE = 'http://localhost:9000/api';

async function testAPI() {
  try {
    console.log('🧪 TEST DE L\'API BACKEND');
    
    // 1. Connexion utilisateur
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Connexion réussie');

    // 2. Créer une réservation
    const reservationData = {
      activityId: 'test-activity-id',
      schedule: {
        day: 'lundi',
        date: new Date('2024-12-20T10:00:00Z'),
        startTime: '10:00',
        endTime: '11:00'
      }
    };

    const reservationResponse = await axios.post(
      `${API_BASE}/reservations`,
      reservationData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const newReservation = reservationResponse.data;
    console.log(`📊 Statut retourné: "${newReservation.status}"`);
    
    if (newReservation.status === 'pending') {
      console.log('✅ BACKEND OK - Frontend à vérifier');
    } else {
      console.log('❌ PROBLÈME BACKEND');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testAPI();
