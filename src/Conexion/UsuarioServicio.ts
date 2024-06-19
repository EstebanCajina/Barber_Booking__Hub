import axios from 'axios';

const API_URL = '/barber_shop_booking_hub/cuenta';

export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
