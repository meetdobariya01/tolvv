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
      // Check if token is still valid (expires in 24 hours)
      if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.token;
      }

      console.log("Authenticating with ShipRocket...");
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        email: this.email,
        password: this.password
      });

      if (response.data && response.data.token) {
        this.token = response.data.token;
        // Set expiry to 23 hours (tokens typically last 24 hours)
        this.tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
        console.log("✅ ShipRocket authentication successful");
        return this.token;
      }
      throw new Error('Authentication failed - no token received');
    } catch (error) {
      console.error('❌ ShipRocket authentication error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getHeaders() {
    const token = await this.authenticate();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async createOrder(orderData) {
    try {
      const headers = await this.getHeaders();
      console.log("Creating ShipRocket order with data:", JSON.stringify(orderData, null, 2));
      const response = await axios.post(`${this.baseUrl}/orders/create/adhoc`, orderData, { headers });
      console.log("✅ ShipRocket order created:", response.data);
      return { status: 200, data: response.data };
    } catch (error) {
      console.error('❌ ShipRocket create order error:', error.response?.data || error.message);
      throw error;
    }
  }

  async generateLabel(shipmentId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(`${this.baseUrl}/shipments/${shipmentId}/generate/label`, {}, { headers });
      return { status: 200, data: response.data };
    } catch (error) {
      console.error('ShipRocket generate label error:', error.response?.data || error.message);
      throw error;
    }
  }

  async trackShipment(shipmentId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${this.baseUrl}/shipments/${shipmentId}/track`, { headers });
      return { status: 200, data: response.data };
    } catch (error) {
      console.error('ShipRocket track shipment error:', error.response?.data || error.message);
      throw error;
    }
  }

  async calculateShipping(data) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(`${this.baseUrl}/courier/serviceability`, data, { headers });
      return { status: 200, data: response.data };
    } catch (error) {
      console.error('ShipRocket calculate shipping error:', error.response?.data || error.message);
      throw error;
    }
  }

  async cancelOrder(shipmentId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(`${this.baseUrl}/orders/cancel`, { ids: [shipmentId] }, { headers });
      return { status: 200, data: response.data };
    } catch (error) {
      console.error('ShipRocket cancel order error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = ShipRocketService;