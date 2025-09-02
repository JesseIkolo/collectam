const WebSocket = require('ws');

class WebSocketService {
    constructor() {
        this.clients = new Map(); // Map of clientId -> { ws, userId, organizationId, role }
        this.rooms = new Map(); // Map of roomId -> Set of clientIds
    }

    initialize(server) {
        this.wss = new WebSocket.Server({ server });

        this.wss.on('connection', (ws, req) => {
            this.handleConnection(ws, req);
        });
    }

    handleConnection(ws, req) {
        const clientId = this.generateClientId();

        // Store client info
        this.clients.set(clientId, {
            ws,
            userId: null,
            organizationId: null,
            role: null,
            connectedAt: new Date()
        });

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                this.handleMessage(clientId, data);
            } catch (error) {
                console.error('WebSocket message parsing error:', error);
            }
        });

        ws.on('close', () => {
            this.handleDisconnection(clientId);
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            this.handleDisconnection(clientId);
        });

        // Send connection confirmation
        ws.send(JSON.stringify({
            type: 'connection',
            clientId,
            timestamp: new Date().toISOString()
        }));
    }

    handleMessage(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client) return;

        switch (data.type) {
            case 'authenticate':
                this.authenticateClient(clientId, data);
                break;
            case 'join_room':
                this.joinRoom(clientId, data.roomId);
                break;
            case 'leave_room':
                this.leaveRoom(clientId, data.roomId);
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    }

    authenticateClient(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client) return;

        // In a real implementation, verify JWT token here
        client.userId = data.userId;
        client.organizationId = data.organizationId;
        client.role = data.role;

        // Join organization room
        if (client.organizationId) {
            this.joinRoom(clientId, `org_${client.organizationId}`);
        }

        // Send authentication confirmation
        client.ws.send(JSON.stringify({
            type: 'authenticated',
            timestamp: new Date().toISOString()
        }));
    }

    joinRoom(clientId, roomId) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId).add(clientId);
    }

    leaveRoom(clientId, roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.delete(clientId);
            if (room.size === 0) {
                this.rooms.delete(roomId);
            }
        }
    }

    handleDisconnection(clientId) {
        const client = this.clients.get(clientId);
        if (client) {
            // Leave all rooms
            for (const [roomId, room] of this.rooms.entries()) {
                if (room.has(clientId)) {
                    room.delete(clientId);
                    if (room.size === 0) {
                        this.rooms.delete(roomId);
                    }
                }
            }
        }
        this.clients.delete(clientId);
    }

    // Broadcast to organization
    broadcastToOrganization(organizationId, message) {
        const roomId = `org_${organizationId}`;
        const room = this.rooms.get(roomId);

        if (room) {
            const messageStr = JSON.stringify(message);
            room.forEach(clientId => {
                const client = this.clients.get(clientId);
                if (client && client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(messageStr);
                }
            });
        }
    }

    // Broadcast mission update
    broadcastMissionUpdate(organizationId, missionId, update) {
        this.broadcastToOrganization(organizationId, {
            type: 'mission_update',
            missionId,
            update,
            timestamp: new Date().toISOString()
        });
    }

    // Broadcast mission status change
    broadcastMissionStatusChange(organizationId, missionId, oldStatus, newStatus) {
        this.broadcastToOrganization(organizationId, {
            type: 'mission_status_change',
            missionId,
            oldStatus,
            newStatus,
            timestamp: new Date().toISOString()
        });
    }

    // Broadcast new mission assignment
    broadcastMissionAssignment(organizationId, missionId, collectorId) {
        this.broadcastToOrganization(organizationId, {
            type: 'mission_assigned',
            missionId,
            collectorId,
            timestamp: new Date().toISOString()
        });
    }

    generateClientId() {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get connected clients info (for monitoring)
    getConnectedClients() {
        return Array.from(this.clients.entries()).map(([clientId, client]) => ({
            clientId,
            userId: client.userId,
            organizationId: client.organizationId,
            role: client.role,
            connectedAt: client.connectedAt
        }));
    }

    // Get room info (for monitoring)
    getRooms() {
        return Array.from(this.rooms.entries()).map(([roomId, clientIds]) => ({
            roomId,
            clientCount: clientIds.size
        }));
    }
}

module.exports = new WebSocketService();
