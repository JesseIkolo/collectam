const twilio = require('twilio');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    // Initialize Twilio client
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send SMS notification
  async sendSMS(to, message) {
    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });
      return { success: true, messageId: result.sid };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send WhatsApp notification
  async sendWhatsApp(to, message) {
    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${to}`
      });
      return { success: true, messageId: result.sid };
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send email notification
  async sendEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html,
        text: text
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send OTP via SMS
  async sendOTP(phone, otp) {
    const message = `Your Nacollect verification code is: ${otp}. Valid for 10 minutes.`;
    return await this.sendSMS(phone, message);
  }

  // Send collection notification
  async sendCollectionNotification(user, collection, type) {
    const messages = {
      assigned: `Your waste collection has been assigned! Collector will arrive at ${collection.scheduledTime}`,
      completed: `Your waste collection has been completed successfully! You earned ${collection.points || 10} points.`,
      cancelled: `Your waste collection has been cancelled. Please reschedule or contact support.`
    };

    const message = messages[type];
    if (!message) return { success: false, error: 'Invalid notification type' };

    const results = [];

    // Send SMS if enabled
    if (user.preferences?.notifications?.sms) {
      results.push(await this.sendSMS(user.phone, message));
    }

    // Send email if enabled
    if (user.preferences?.notifications?.email) {
      results.push(await this.sendEmail(
        user.email,
        `Nacollect - Collection ${type}`,
        `<p>${message}</p>`,
        message
      ));
    }

    return results;
  }

  // Send mission notification to collector
  async sendMissionNotification(collector, mission, type) {
    const messages = {
      assigned: `New mission assigned! Collection ID: ${mission.collectionId}`,
      reminder: `Reminder: You have a pending collection mission`,
      completed: `Mission completed successfully! Payment will be processed.`
    };

    const message = messages[type];
    if (!message) return { success: false, error: 'Invalid notification type' };

    return await this.sendSMS(collector.phone, message);
  }

  // Multicast notification to multiple users
  async multicast(users, message, channels = ['sms', 'email']) {
    const results = [];

    for (const user of users) {
      if (channels.includes('sms') && user.preferences?.notifications?.sms) {
        results.push(await this.sendSMS(user.phone, message));
      }
      
      if (channels.includes('email') && user.preferences?.notifications?.email) {
        results.push(await this.sendEmail(
          user.email,
          'Nacollect Notification',
          `<p>${message}</p>`,
          message
        ));
      }
    }

    return results;
  }
}

module.exports = new NotificationService();
