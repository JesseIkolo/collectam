const Ad = require('../models/Ad');
const { validationResult } = require('express-validator');

class AdController {
  // Create new advertisement (alias)
  async createAd(req, res) {
    return this.create(req, res);
  }

  // Get targeted ads (alias)
  async getTargetedAds(req, res) {
    return this.getAds(req, res);
  }

  // Get ad by ID
  async getAdById(req, res) {
    try {
      const { id } = req.params;

      const ad = await Ad.findById(id)
        .populate('advertiserId', 'email');

      if (!ad) {
        return res.status(404).json({
          success: false,
          message: 'Ad not found'
        });
      }

      // Track impression
      ad.impressions += 1;
      await ad.save();

      res.json({
        success: true,
        data: { ad }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Track ad click (alias)
  async trackAdClick(req, res) {
    return this.trackClick(req, res);
  }

  // Update advertisement
  async updateAd(req, res) {
    try {
      const { id } = req.params;
      const { title, content, targetAudience } = req.body;

      const ad = await Ad.findById(id);
      if (!ad) {
        return res.status(404).json({
          success: false,
          message: 'Ad not found'
        });
      }

      if (title) ad.title = title;
      if (content) ad.content = content;
      if (targetAudience) ad.targetAudience = targetAudience;

      await ad.save();

      res.json({
        success: true,
        message: 'Ad updated successfully',
        data: { ad }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete advertisement
  async deleteAd(req, res) {
    try {
      const { id } = req.params;

      const ad = await Ad.findByIdAndDelete(id);
      if (!ad) {
        return res.status(404).json({
          success: false,
          message: 'Ad not found'
        });
      }

      res.json({
        success: true,
        message: 'Ad deleted successfully'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get ad analytics
  async getAdAnalytics(req, res) {
    try {
      const { id } = req.params;

      const ad = await Ad.findById(id)
        .populate('advertiserId', 'email');

      if (!ad) {
        return res.status(404).json({
          success: false,
          message: 'Ad not found'
        });
      }

      const analytics = {
        id: ad._id,
        title: ad.title,
        impressions: ad.impressions,
        clicks: ad.clicks,
        ctr: ad.impressions > 0 ? (ad.clicks / ad.impressions * 100).toFixed(2) : 0,
        createdAt: ad.createdAt,
        targetAudience: ad.targetAudience
      };

      res.json({
        success: true,
        data: { analytics }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Create new advertisement
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { title, content, targetAudience } = req.body;
      const advertiserId = req.user.id;

      const ad = new Ad({
        title,
        content,
        targetAudience,
        advertiserId
      });

      await ad.save();

      res.status(201).json({
        success: true,
        message: 'Advertisement created successfully',
        data: { ad }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get ads for user
  async getAds(req, res) {
    try {
      const userRole = req.user.role;
      const { page = 1, limit = 10 } = req.query;

      const query = {
        $or: [
          { targetAudience: { $in: [userRole, 'all'] } }
        ]
      };

      const ads = await Ad.find(query)
        .populate('advertiserId', 'email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Ad.countDocuments(query);

      res.json({
        success: true,
        data: {
          ads,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Track ad impression
  async trackImpression(req, res) {
    try {
      const { adId } = req.params;

      const ad = await Ad.findById(adId);
      if (!ad) {
        return res.status(404).json({
          success: false,
          message: 'Ad not found'
        });
      }

      ad.impressions += 1;
      await ad.save();

      res.json({
        success: true,
        message: 'Impression tracked'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Track ad click
  async trackClick(req, res) {
    try {
      const { adId } = req.params;

      const ad = await Ad.findById(adId);
      if (!ad) {
        return res.status(404).json({
          success: false,
          message: 'Ad not found'
        });
      }

      ad.clicks += 1;
      await ad.save();

      res.json({
        success: true,
        message: 'Click tracked'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new AdController();
