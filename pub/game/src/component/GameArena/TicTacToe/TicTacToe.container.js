import React, {PureComponent} from "react";
import TicTacToeComponent from "./TicTacToe.component";
import Socket from "../../../util/Socket";

export class TicTacToeContainer extends PureComponent {

    state = {
        currentPlayerNumber: null,
        isMyTurn: false,
        board: null
    }

    containerFunctions = {
        onCellClick: this.onCellClick.bind(this)
    }

    componentDidMount() {
        Socket.addListener('game_player_number_self', 'game_player_number_self', ({type, data: currentPlayerNumber}) => {
            this.setState({ currentPlayerNumber });
        });
        Socket.addListener('game_draw_board', 'game_draw_board', ({type, data: board}) => {
            this.setState({ board: JSON.parse(board) });
        });
        Socket.addListener('game_player_turn', 'game_player_turn', ({type, data: playerNumber}) => {
            const isMyTurn = playerNumber === this.state.currentPlayerNumber;
            this.setState({ isMyTurn });
        });

    }

    onCellClick(x, y) {
        const { isMyTurn } = this.state;
        if (!isMyTurn) return;
        Socket.sendData('game_move', `${x},${y}`);
    }


    render() {
        return (
            <TicTacToeComponent
                { ...this.state }
                { ...this.containerFunctions }
            />
        )
    }

}

export default TicTacToeContainer;
