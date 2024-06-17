
class WebSocketService {
    constructor() {
        this.socket = null;
    }

    initializeSocket = (url) => {
        this.socket = new WebSocket(url);

        this.socket.onopen = (e) => {
            console.log('WebSocket connected!');
        };

        this.socket.onclose = (e) => {
            console.log('WebSocket disconnected!');
        };

        // Ajoutez d'autres écouteurs ici
        this.socket.onmessage = this.onMessageReceived;
    };

    onMessageReceived = (message) => {
        console.log('Message received:', message);
    };

    sendMessage = (message) => {
        if (this.socket) {
            this.socket.send(JSON.stringify(message));
        }
    };

    closeConnection = () => {
        if (this.socket) {
            this.socket.close();
        }
    };
}

const webSocketService = new WebSocketService();
export default webSocketService;