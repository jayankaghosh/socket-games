import {setPlayer} from "./Player";

export const TYPE_REGISTER = 'register';
export const TYPE_FETCH_USER_DATA = 'fetch_user_data';
export const TYPE_HOST = 'host';
export const TYPE_JOIN = 'join';
export const TYPE_ERROR = 'error';
export const TYPE_INFO = 'info';
export const TYPE_PLAYER_COUNT = 'player_count';
export const TYPE_GAME_START = 'game_start';

class Socket {

    listeners = {};

    connectionResolvers = [];

    connect(url) {
        this.socket = new WebSocket(url);
        this.connectionResolvers = [];
        this.socket.onmessage = (message) => {
            this.handleSocketResponse(JSON.parse(message.data));
        }
        this.socket.addEventListener('open', () => {
            this.connectionResolvers.forEach(r => r.resolve())
        });
    }

    setToken(token) {
        return new Promise(((resolve, reject) => {
            this.token = token;
            this.sendData(TYPE_FETCH_USER_DATA, token);
            this.addListener('set-current-player', TYPE_FETCH_USER_DATA, ({type, data}) => {
                setPlayer(JSON.parse(data));
                resolve();
            });
        }));
    }

    setGameId(gameId) {
        this.gameId = gameId;
    }

    checkConnection = () => {
        return new Promise((resolve, reject) => {
            if (this.socket.readyState === WebSocket.OPEN) {
                resolve();
            }
            else {
                this.connectionResolvers.push({resolve, reject});
            }
        });
    }

    async sendData(type, data) {
        await this.checkConnection();
        this.socket.send(JSON.stringify({
            type,
            data,
            token: this.token,
            game_id: this.gameId
        }));
    }

    addListener(id, type, callback) {
        if (!this.listeners[type]) {
            this.listeners[type] = {};
        }
        this.listeners[type][id] = callback;
    }

    handleSocketResponse(response) {
        console.log(response);
        if (this.listeners[response.type]) {
            Object.values(this.listeners[response.type]).forEach(listener => {
                if (typeof listener === 'function') {
                    listener(response);
                }
            });
        }
    }
}

export default new Socket();
