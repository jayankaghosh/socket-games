import React, {PureComponent} from "react";
import JoinGame from "./JoinGame.component";
import snackbar from "snackbar";
import Socket, {TYPE_GAME_START, TYPE_JOIN} from "../../util/Socket";

export class JoinGameContainer extends PureComponent {

    state = {
        gameCode: null,
        isJoining: false
    }

    containerFunctions = {
        onJoin: this.onJoin.bind(this),
        onGameCodeChange: this.onGameCodeChange.bind(this),
    }

    onJoin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const gameCode = formData.get('game_code').trim();
        if (!gameCode) {
            snackbar.show('Cannot start without a code');
            return;
        }
        this.setState({
            isJoining: true,
            gameCode
        });
        Socket.setGameId(gameCode);
        Socket.sendData(TYPE_JOIN, gameCode);
        Socket.addListener('on-game-started', TYPE_GAME_START, ({type, data}) => {

        });
    }

    onGameCodeChange(e) {
        this.setState({
            isJoining: false,
            gameCode: null
        })
    }

    render() {
        return (
            <JoinGame
                { ...this.state }
                { ...this.containerFunctions }
            />
        )
    }

}

export default JoinGameContainer;
