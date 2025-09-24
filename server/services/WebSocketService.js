const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class WebSocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map(); // userId -> { socketId, userInfo, rooms }
        this.rooms = new Map(); // roomId -> Set of userIds
    }

    initialize(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        // Middleware d'authentification
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                
                if (!token) {
                    return next(new Error('Token manquant'));
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userId = decoded?._id || decoded?.id; // Supporter payload {_id} ou {id}
                if (!userId) {
                    return next(new Error('Token invalide (payload sans id)'));
                }

                const user = await User.findById(userId);
                
                if (!user) {
                    return next(new Error('Utilisateur non trouvé'));
                }

                socket.userId = user._id.toString();
                socket.userInfo = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    userType: user.userType
                };
                
                next();
            } catch (error) {
                console.error('❌ Erreur authentification WebSocket:', error);
                next(new Error('Token invalide'));
            }
        });

        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
        });

        console.log('✅ Service WebSocket initialisé');
    }

    handleConnection(socket) {
        const userId = socket.userId;
        const userInfo = socket.userInfo;

        console.log('🔌 Nouvelle connexion WebSocket:', {
            socketId: socket.id,
            userId,
            name: `${userInfo.firstName} ${userInfo.lastName}`,
            role: userInfo.role
        });

        // Enregistrer l'utilisateur connecté
        this.connectedUsers.set(userId, {
            socketId: socket.id,
            userInfo,
            rooms: new Set()
        });

        // Rejoindre automatiquement les rooms selon le rôle
        this.autoJoinRooms(socket, userInfo);

        // Gérer les événements
        this.setupSocketEvents(socket);

        // Gérer la déconnexion
        socket.on('disconnect', (reason) => {
            console.log('❌ Déconnexion WebSocket:', {
                socketId: socket.id,
                userId,
                reason
            });
            this.handleDisconnection(userId);
        });
    }

    autoJoinRooms(socket, userInfo) {
        // Rejoindre les rooms selon le rôle
        if (userInfo.role === 'collector') {
            socket.join('collectors');
            this.addUserToRoom('collectors', socket.userId);
            console.log('🚛 Collecteur rejoint la room collectors');
        }
        
        if (userInfo.userType === 'menage') {
            socket.join('households');
            this.addUserToRoom('households', socket.userId);
            console.log('🏠 Ménage rejoint la room households');
        }

        // Room générale pour tous les utilisateurs
        socket.join('general');
        this.addUserToRoom('general', socket.userId);
    }

    setupSocketEvents(socket) {
        const userId = socket.userId;

        // Rejoindre une room spécifique
        socket.on('join_room', (data) => {
            const { room } = data;
            socket.join(room);
            this.addUserToRoom(room, userId);
            console.log(`🏠 ${userId} rejoint la room: ${room}`);
        });

        // Quitter une room
        socket.on('leave_room', (data) => {
            const { room } = data;
            socket.leave(room);
            this.removeUserFromRoom(room, userId);
            console.log(`🚪 ${userId} quitte la room: ${room}`);
        });

        // Mise à jour position collecteur
        socket.on('location_update', (data) => {
            console.log('📍 Mise à jour position reçue:', data);
            // Diffuser aux ménages qui ont des demandes assignées à ce collecteur
            this.broadcastCollectorLocationUpdate(data);
        });

        // Collecte démarrée
        socket.on('collection_started', (data) => {
            console.log('▶️ Collecte démarrée:', data);
            this.broadcastCollectionStarted(data);
        });

        // Collecte terminée
        socket.on('collection_completed', (data) => {
            console.log('✅ Collecte terminée:', data);
            this.broadcastCollectionCompleted(data);
        });
    }

    handleDisconnection(userId) {
        // Retirer l'utilisateur de toutes les rooms
        const userConnection = this.connectedUsers.get(userId);
        if (userConnection) {
            userConnection.rooms.forEach(room => {
                this.removeUserFromRoom(room, userId);
            });
        }
        
        this.connectedUsers.delete(userId);
    }

    // Gestion des rooms
    addUserToRoom(roomId, userId) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId).add(userId);

        const userConnection = this.connectedUsers.get(userId);
        if (userConnection) {
            userConnection.rooms.add(roomId);
        }
    }

    removeUserFromRoom(roomId, userId) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.delete(userId);
            if (room.size === 0) {
                this.rooms.delete(roomId);
            }
        }

        const userConnection = this.connectedUsers.get(userId);
        if (userConnection) {
            userConnection.rooms.delete(roomId);
        }
    }

    // Méthodes de diffusion
    broadcastToRoom(roomId, event, data) {
        if (this.io) {
            this.io.to(roomId).emit(event, data);
            console.log(`📡 Diffusion vers room ${roomId}:`, event);
        }
    }

    broadcastToUser(userId, event, data) {
        const userConnection = this.connectedUsers.get(userId);
        if (userConnection && this.io) {
            this.io.to(userConnection.socketId).emit(event, data);
            console.log(`📡 Diffusion vers utilisateur ${userId}:`, event);
        }
    }

    broadcastCollectorLocationUpdate(locationData) {
        // Diffuser la position du collecteur aux ménages concernés
        this.io.emit('collector_location_update', locationData);
    }

    broadcastCollectionStarted(data) {
        // Notifier le ménage que sa collecte a commencé
        this.io.emit('collection_started', data);
    }

    broadcastCollectionCompleted(data) {
        // Notifier le ménage que sa collecte est terminée
        this.io.emit('collection_completed', data);
    }

    // Méthodes publiques pour notifier depuis les contrôleurs
    notifyNewWasteRequest(collectorId, wasteRequestData) {
        console.log('🔔 Notification nouvelle demande au collecteur:', collectorId);
        this.broadcastToUser(collectorId, 'new_waste_request', {
            type: 'new_request',
            message: `Nouvelle demande de collecte: ${wasteRequestData.wasteType}`,
            data: wasteRequestData,
            timestamp: new Date().toISOString()
        });
    }

    notifyCollectorAssigned(userId, collectorData) {
        console.log('🔔 Notification collecteur assigné au ménage:', userId);
        this.broadcastToUser(userId, 'collector_assigned', {
            type: 'collector_assigned',
            message: `Collecteur assigné: ${collectorData.firstName} ${collectorData.lastName}`,
            data: collectorData,
            timestamp: new Date().toISOString()
        });
    }

    // Obtenir les statistiques de connexion
    getConnectionStats() {
        return {
            connectedUsers: this.connectedUsers.size,
            activeRooms: this.rooms.size,
            usersByRole: {
                collectors: Array.from(this.connectedUsers.values())
                    .filter(conn => conn.userInfo.role === 'collector').length,
                households: Array.from(this.connectedUsers.values())
                    .filter(conn => conn.userInfo.userType === 'menage').length
            }
        };
    }
}

// Instance singleton
const webSocketService = new WebSocketService();

module.exports = webSocketService;
