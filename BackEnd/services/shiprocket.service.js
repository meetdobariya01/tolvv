const axios = require('axios');

class ShipRocketService {
  constructor() {
    this.email = process.env.SHIPROCKET_EMAIL;
    this.password = process.env.SHIPROCKET_PASSWORD;
    this.baseUrl = process.env.SHIPROCKET_API_URL || 'https://apiv2.shiprocket.in/v1/external';
    this.token = null;
    this.tokenExpiry = null;
  }

  static getInstance() {
    if (!ShipRocketService.instance) {
      ShipRocketService.instance = new ShipRocketService();
    }
    return ShipRocketService.instance;
  }

  async authenticate() {
    try {
      if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.token;
      }

      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        email: this.email,
        password: this.password
      });

      if (response.data && response.data.token) {
        this.token = response.data.token;
        this.tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
        return this.token;
      }
      throw new Error('Authentication failed');
    } catch (error) {
      console.error('ShipRocket auth error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getHeaders() {
    const token = await this.authenticate();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // ✅ FIXED: Use ADHOC endpoint - NO channel_id required
  async createOrder(orderData) {
    try {
      const headers = await this.getHeaders();
      // Remove channel_id if present (not needed for adhoc)
      if (orderData.channel_id) {
        delete orderData.channel_id;
      }
      const response = await axios.post(`${this.baseUrl}/orders/create/adhoc`, orderData, { headers });
      return response;
    } catch (error) {
      console.error('ShipRocket create order error:', error.response?.data || error.message);
      throw error;
    }
  }

  async generateLabel(shipmentId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(`${this.baseUrl}/shipments/${shipmentId}/generate-label`, {}, { headers });
      return response;
    } catch (error) {
      console.error('ShipRocket generate label error:', error.response?.data || error.message);
      throw error;
    }
  }

  async trackShipment(shipmentId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/shipments/${shipmentId}/track`, { headers });
      return response;
    } catch (error) {
      console.error('ShipRocket track error:', error.response?.data || error.message);
      throw error;
    }
  }

  async calculateShipping(data) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(`${this.baseUrl}/courier/serviceability`, data, { headers });
      return response;
    } catch (error) {
      console.error('ShipRocket calculate error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getChannels() {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/channels`, { headers });
      return response;
    } catch (error) {
      console.error('ShipRocket get channels error:', error.response?.data || error.message);
      throw error;
    }
  }
}

ShipRocketService.instance = null;
module.exports = ShipRocketService;