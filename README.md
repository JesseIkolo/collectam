# Nacollect Backend

Secure and scalable backend for the Nacollect waste management platform in Africa.

## 🚀 Features

- **Secure Authentication**: JWT with double-layer encryption and refresh tokens
- **Geolocation Services**: Real-time waste tracking and collector assignment
- **AI-Powered Matching**: Intelligent collector assignment based on proximity and ratings
- **QR Code Validation**: Secure mission validation system
- **Multi-channel Notifications**: SMS, WhatsApp, and email notifications
- **Subscription Management**: Basic and premium plans with dynamic pricing
- **Advertisement System**: Targeted eco-friendly ads
- **Heatmap Analytics**: Waste hotspot visualization

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, CORS, Rate Limiting
- **File Storage**: Cloudflare R2
- **Notifications**: Twilio, SendGrid
- **Image Processing**: Sharp
- **Caching**: Redis with ioredis
- **Testing**: Jest, Supertest

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── UserController.js     # User management
│   ├── CollectionController.js # Waste collection
│   ├── MissionController.js  # Collector missions
│   ├── VehicleController.js  # Vehicle management
│   └── AdController.js       # Advertisement system
├── middlewares/
│   ├── auth.js              # Authentication & authorization
│   ├── validation.js        # Input validation
│   └── qrcode.js           # QR code generation/validation
├── models/
│   ├── User.js             # User schema
│   ├── Collection.js       # Collection schema
│   ├── Mission.js          # Mission schema
│   ├── Vehicle.js          # Vehicle schema
│   └── Ad.js              # Advertisement schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── collections.js     # Collection routes
│   ├── missions.js        # Mission routes
│   ├── vehicles.js        # Vehicle routes
│   └── ads.js            # Advertisement routes
├── services/
│   ├── AuthService.js     # JWT & OTP services
│   ├── NotificationService.js # Multi-channel notifications
│   ├── StorageService.js  # File upload & optimization
│   └── MatchingService.js # AI collector matching
├── logs/                  # Application logs
└── app.js                # Main application file
```

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd collectam
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🔐 Environment Variables

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nacollect

# JWT Secrets
JWT_SECRET=your-super-secure-jwt-secret-key-256-bits-minimum
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-256-bits-minimum

# External Services
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
CLOUDFLARE_API_KEY=your-cloudflare-api-key
SENDGRID_API_KEY=your-sendgrid-api-key

# Security
QR_SECRET=your-qr-code-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/upgrade` - Subscription upgrade

### Collections
- `POST /api/collections/report` - Report waste location
- `POST /api/collections/schedule` - Schedule collection
- `GET /api/collections` - Get user collections
- `GET /api/collections/:id` - Get collection details

### Missions
- `POST /api/missions/assign` - Assign mission to collector
- `POST /api/missions/validate` - Validate mission with QR code
- `GET /api/missions/collector` - Get collector missions

### Vehicles
- `POST /api/vehicles/register` - Register new vehicle
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles/:id/gps` - Update GPS location

### Advertisements
- `POST /api/ads/create` - Create advertisement
- `GET /api/ads` - Get targeted ads
- `POST /api/ads/:id/click` - Track ad clicks

## 🔒 Security Features

- **JWT Authentication** with HS256 algorithm
- **Password Hashing** with bcrypt (12 rounds)
- **Rate Limiting** (100 requests per 15 minutes)
- **Input Validation** with express-validator
- **XSS Protection** with Helmet.js
- **CORS Configuration** for secure cross-origin requests
- **Audit Logging** with Winston

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🚀 Deployment

The application is configured for production deployment with:
- Environment-based configuration
- Security headers and HTTPS enforcement
- Error handling and logging
- Database connection retry logic
- Graceful shutdown handling

## 📊 Monitoring

- **Health Check**: `GET /health`
- **Logs**: Stored in `logs/` directory
- **Error Tracking**: Winston logger with rotation
- **Performance**: Built-in request timing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🌍 About Nacollect

Nacollect is revolutionizing waste management in Africa through AI, IoT, and blockchain technology, targeting urban hubs like Lagos, Nairobi, and Johannesburg.
