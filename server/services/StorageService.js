const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');

class StorageService {
  constructor() {
    // Configure multer for file uploads
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        // Allow images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image and video files are allowed'), false);
        }
      }
    });
  }

  // Generate SHA-256 hash for file integrity
  generateFileHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  // Optimize image using Sharp
  async optimizeImage(buffer, options = {}) {
    try {
      const {
        width = 1200,
        height = 800,
        quality = 80,
        format = 'jpeg'
      } = options;

      const optimized = await sharp(buffer)
        .resize(width, height, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality })
        .toBuffer();

      return optimized;
    } catch (error) {
      throw new Error(`Image optimization failed: ${error.message}`);
    }
  }

  // Upload to Cloudflare R2 (simulated - would need actual R2 SDK)
  async uploadToCloudflare(buffer, filename, mimetype) {
    try {
      // Generate file hash for integrity
      const fileHash = this.generateFileHash(buffer);
      
      // Generate unique filename
      const timestamp = Date.now();
      const extension = filename.split('.').pop();
      const uniqueFilename = `${timestamp}-${fileHash.substring(0, 8)}.${extension}`;

      // Simulate upload to Cloudflare R2
      // In production, use @aws-sdk/client-s3 with R2 endpoint
      const uploadResult = {
        success: true,
        url: `https://nacollect-media.r2.dev/${uniqueFilename}`,
        filename: uniqueFilename,
        hash: fileHash,
        size: buffer.length,
        mimetype: mimetype
      };

      return uploadResult;
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  // Process and upload media file
  async processAndUpload(file, options = {}) {
    try {
      let processedBuffer = file.buffer;

      // Optimize images
      if (file.mimetype.startsWith('image/')) {
        processedBuffer = await this.optimizeImage(file.buffer, options);
      }

      // Upload to storage
      const uploadResult = await this.uploadToCloudflare(
        processedBuffer,
        file.originalname,
        file.mimetype
      );

      return {
        success: true,
        data: uploadResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete file from storage
  async deleteFile(filename) {
    try {
      // Simulate deletion from Cloudflare R2
      // In production, use actual R2 SDK
      return {
        success: true,
        message: `File ${filename} deleted successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get file metadata
  async getFileMetadata(filename) {
    try {
      // Simulate getting metadata from Cloudflare R2
      return {
        success: true,
        data: {
          filename,
          url: `https://nacollect-media.r2.dev/${filename}`,
          lastModified: new Date(),
          size: 0 // Would get actual size from R2
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new StorageService();
