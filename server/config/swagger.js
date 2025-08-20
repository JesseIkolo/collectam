const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Collectam API',
      version: '1.0.0',
      description: 'API documentation for Collectam waste management platform',
      contact: {
        name: 'Collectam Team',
        email: 'support@collectam.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:8080',
        description: 'Development server'
      },
      {
        url: 'https://api.collectam.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              type: 'object'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j1'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              writeOnly: true,
              minLength: 8,
              example: 'SecurePassword123!'
            },
            role: {
              type: 'string',
              enum: ['user', 'collector', 'manager', 'admin'],
              default: 'user',
              example: 'user'
            },
            phone: {
              type: 'string',
              example: '+33123456789'
            },
            address: {
              type: 'object',
              properties: {
                street: {
                  type: 'string',
                  example: '123 Rue de la Paix'
                },
                city: {
                  type: 'string',
                  example: 'Paris'
                },
                state: {
                  type: 'string',
                  example: 'Île-de-France'
                },
                country: {
                  type: 'string',
                  example: 'France'
                },
                coordinates: {
                  type: 'array',
                  items: {
                    type: 'number'
                  },
                  example: [2.3522, 48.8566]
                }
              }
            },
            points: {
              type: 'number',
              default: 0,
              example: 150
            },
            subscription: {
              type: 'object',
              properties: {
                plan: {
                  type: 'string',
                  enum: ['basic', 'premium'],
                  default: 'basic',
                  example: 'basic'
                },
                expiry: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-02-15T10:00:00Z'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Collection: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j1'
            },
            userId: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j2'
            },
            collectorId: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j3'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in-progress', 'completed'],
              default: 'pending',
              example: 'pending'
            },
            location: {
              type: 'object',
              required: true,
              properties: {
                type: {
                  type: 'string',
                  enum: ['Point'],
                  example: 'Point'
                },
                coordinates: {
                  type: 'array',
                  items: {
                    type: 'number'
                  },
                  example: [2.3522, 48.8566]
                }
              }
            },
            wasteType: {
              type: 'string',
              example: 'plastic'
            },
            media: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    example: 'https://example.com/image.jpg'
                  },
                  type: {
                    type: 'string',
                    example: 'image/jpeg'
                  }
                }
              }
            },
            scheduledTime: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:00:00Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Mission: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j1'
            },
            collectionId: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j2'
            },
            collectorId: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j3'
            },
            vehicleId: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j4'
            },
            status: {
              type: 'string',
              enum: ['assigned', 'in-progress', 'completed', 'cancelled'],
              default: 'assigned',
              example: 'assigned'
            },
            qrCode: {
              type: 'string',
              example: 'QR_64f1a2b3c4d5e6f7g8h9i0j1'
            },
            timestamp: {
              type: 'object',
              properties: {
                assigned: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-15T08:00:00Z'
                },
                started: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-15T09:00:00Z'
                },
                completed: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-15T10:30:00Z'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Vehicle: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j1'
            },
            registration: {
              type: 'string',
              example: 'AB-123-CD'
            },
            capacity: {
              type: 'number',
              example: 1000
            },
            collectorId: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j2'
            },
            groupId: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j3'
            },
            gpsData: {
              type: 'object',
              properties: {
                latitude: {
                  type: 'number',
                  example: 48.8566
                },
                longitude: {
                  type: 'number',
                  example: 2.3522
                },
                lastUpdated: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-01-15T10:00:00Z'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Ad: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j1'
            },
            title: {
              type: 'string',
              example: 'Eco-friendly Waste Bags'
            },
            content: {
              type: 'string',
              example: 'Discover our new biodegradable waste bags, perfect for your collection needs!'
            },
            targetAudience: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['user', 'collector', 'all']
              },
              example: ['user', 'collector']
            },
            advertiserId: {
              type: 'string',
              example: '64f1a2b3c4d5e6f7g8h9i0j2'
            },
            impressions: {
              type: 'number',
              default: 0,
              example: 1250
            },
            clicks: {
              type: 'number',
              default: 0,
              example: 45
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
    .swagger-ui .scheme-container { background: #fafafa; padding: 30px 0 }
  `,
  customSiteTitle: 'Nacollect API Documentation',
  customfavIcon: '/favicon.ico'
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};
