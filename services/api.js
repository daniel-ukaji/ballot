// utils/api.js
import axios from 'axios';

const API_BASE_URL = 'https://virtual.chevroncemcs.com';

export async function fetchBallotData(email, userToken) {
  try {
    const timestamp = Date.now(); // Cache-busting timestamp
    const response = await axios.get(`${API_BASE_URL}/ballot/ballot?_=${timestamp}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`, // Pass the userToken as an argument
      },
      params: {
        email: email,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching ballot data:', error);
    throw error;
  }
}

export async function fetchDrawsData(email, ballotId, userToken) {
  try {
    const response = await axios.get(`${API_BASE_URL}/ballot/draws`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`, // Pass the userToken as an argument
      },
      params: {
        email: email,
        ballotId: ballotId
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching ballot draws data:', error);
    throw error;
  }
}
