const axios = require('axios');

class HostawayService {
  constructor(accountId, apiKey) {
    this.accountId = accountId;
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.hostaway.com/v1';
  }

  /**
   * Fetch reviews from Hostaway API
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of reviews
   */
  async fetchReviews(options = {}) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const params = {
        accountId: this.accountId,
        ...options
      };

      const response = await axios.get(
        `${this.baseUrl}/reviews`,
        { headers, params, timeout: 10000 }
      );

      if (response.data.status === 'success' && response.data.result) {
        return response.data.result;
      }

      return [];
    } catch (error) {
      console.error('Hostaway API Error:', error.message);
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }
  }

  /**
   * Fetch single review by ID
   * @param {Number} reviewId - Review ID
   * @returns {Promise<Object>} Review object
   */
  async fetchReviewById(reviewId) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${this.baseUrl}/reviews/${reviewId}`,
        { headers, timeout: 10000 }
      );

      if (response.data.status === 'success' && response.data.result) {
        return response.data.result;
      }

      throw new Error('Review not found');
    } catch (error) {
      console.error('Hostaway API Error:', error.message);
      throw error;
    }
  }

  /**
   * Fetch listings to get property information
   * @returns {Promise<Array>} Array of listings
   */
  async fetchListings() {
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${this.baseUrl}/listings`,
        { headers, timeout: 10000 }
      );

      if (response.data.status === 'success' && response.data.result) {
        return response.data.result;
      }

      return [];
    } catch (error) {
      console.error('Hostaway API Error:', error.message);
      return [];
    }
  }
}

module.exports = HostawayService;