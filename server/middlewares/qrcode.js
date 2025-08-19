const QRCode = require('qrcode');
const crypto = require('crypto');

class QRCodeMiddleware {
  // Generate QR code for mission validation
  async generateMissionQR(missionId, collectionId) {
    try {
      // Create secure payload
      const payload = {
        missionId,
        collectionId,
        timestamp: Date.now(),
        hash: crypto.createHash('sha256')
          .update(`${missionId}-${collectionId}-${process.env.QR_SECRET}`)
          .digest('hex')
      };

      const qrData = JSON.stringify(payload);
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return {
        success: true,
        qrCode: qrCodeDataURL,
        payload
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Validate QR code data
  validateQRCode(qrData) {
    try {
      const payload = JSON.parse(qrData);
      
      // Check required fields
      if (!payload.missionId || !payload.collectionId || !payload.hash || !payload.timestamp) {
        return {
          success: false,
          error: 'Invalid QR code format'
        };
      }

      // Check timestamp (valid for 24 hours)
      const now = Date.now();
      const qrAge = now - payload.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (qrAge > maxAge) {
        return {
          success: false,
          error: 'QR code has expired'
        };
      }

      // Verify hash
      const expectedHash = crypto.createHash('sha256')
        .update(`${payload.missionId}-${payload.collectionId}-${process.env.QR_SECRET}`)
        .digest('hex');

      if (payload.hash !== expectedHash) {
        return {
          success: false,
          error: 'Invalid QR code signature'
        };
      }

      return {
        success: true,
        payload
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid QR code data'
      };
    }
  }

  // Generate collection QR code for users
  async generateCollectionQR(collectionId, userId) {
    try {
      const payload = {
        type: 'collection',
        collectionId,
        userId,
        timestamp: Date.now(),
        hash: crypto.createHash('sha256')
          .update(`collection-${collectionId}-${userId}-${process.env.QR_SECRET}`)
          .digest('hex')
      };

      const qrData = JSON.stringify(payload);
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1
      });

      return {
        success: true,
        qrCode: qrCodeDataURL,
        payload
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new QRCodeMiddleware();
