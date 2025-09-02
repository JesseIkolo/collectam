class NotificationService {
  constructor() {
    // Select transports via env, default to mock
    this.smsTransport = (process.env.NOTIFY_TRANSPORT_SMS || 'mock').toLowerCase();
    this.emailTransport = (process.env.NOTIFY_TRANSPORT_EMAIL || 'mock').toLowerCase();
    this.pushTransport = (process.env.NOTIFY_TRANSPORT_PUSH || 'mock').toLowerCase();

    // Mock transport implementation
    this.mock = {
      async sendSms(to, message) {
        const id = `mock-sms-${Date.now()}`;
        if (process.env.NODE_ENV !== 'test') {
          console.log(`[MockSMS] to=${to} id=${id} msg=${message}`);
        }
        return { success: true, messageId: id };
      },
      async sendEmail(to, subject, html, text) {
        const id = `mock-email-${Date.now()}`;
        if (process.env.NODE_ENV !== 'test') {
          console.log(`[MockEmail] to=${to} id=${id} subject=${subject}`);
        }
        return { success: true, messageId: id };
      },
      async sendPush(token, title, body, data) {
        const id = `mock-push-${Date.now()}`;
        if (process.env.NODE_ENV !== 'test') {
          console.log(`[MockPush] token=${token} id=${id} title=${title}`);
        }
        return { success: true, messageId: id };
      }
    };
  }

  // Send SMS notification via selected transport (mock by default)
  async sendSMS(to, message) {
    if (this.smsTransport === 'mock') {
      return this.mock.sendSms(to, message);
    }
    // Other providers can be added here later (e.g., twilio) guarded by env
    return this.mock.sendSms(to, message);
  }

  // Send WhatsApp notification (mocked)
  async sendWhatsApp(to, message) {
    // Keep same interface; route through SMS mock for now
    return this.mock.sendSms(`whatsapp:${to}`, message);
  }

  // Send email notification via selected transport (mock by default)
  async sendEmail(to, subject, html, text) {
    if (this.emailTransport === 'mock') {
      return this.mock.sendEmail(to, subject, html, text);
    }
    // Other providers can be added here later (e.g., nodemailer/sendgrid)
    return this.mock.sendEmail(to, subject, html, text);
  }

  // Send OTP via SMS
  async sendOTP(phone, otp) {
    const message = `Your Collectam verification code is: ${otp}. Valid for 10 minutes.`;
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
          'Collectam Notification',
          `<p>${message}</p>`,
          message
        ));
      }
    }

    return results;
  }
}

module.exports = new NotificationService();
