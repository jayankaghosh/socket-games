import React, {PureComponent} from "react";
import ClickWarsComponent from "./ClickWars.component";
import Socket from "../../../util/Socket";

export class ClickWarsContainer extends PureComponent {

    state = {
        gameArenaHeight: 0,
        colourPlayer: '#ffffff',
        colourOpponent: '#ffffff',
        scorePlayer: 0,
        scoreOpponent: 0
    }

    containerFunctions = {
        getPlayerHeight: this.getPlayerHeight.bind(this),
        getOpponentHeight: this.getOpponentHeight.bind(this),
        onClick: this.onClick.bind(this)
    }

    onClick() {
        Socket.sendData('game_clicked', true);
    }

    componentDidMount() {
        const totalHeight = window.screen.availHeight;
        const headerHeight = document.querySelector('header').clientHeight;
        const gameArenaHeight = totalHeight - headerHeight;
        this.setState({ gameArenaHeight });
        Socket.addListener('game_colour_player', 'game_colour_player', ({type, data: colourPlayer}) => {
            this.setState({ colourPlayer });
        });
        Socket.addListener('game_colour_opponent', 'game_colour_opponent', ({type, data: colourOpponent}) => {
            this.setState({ colourOpponent });
        });
        Socket.addListener('game_scores', 'game_scores', ({type, data: scores}) => {
            this.setState({
                scorePlayer: scores.player,
                scoreOpponent: scores.opponent
            });
        });
    }

    getHeightUnit() {
        const { gameArenaHeight, scorePlayer, scoreOpponent } = this.state;
        const scoreTotal = scorePlayer + scoreOpponent;
        return gameArenaHeight / scoreTotal;
    }

    getPlayerHeight() {
        const { scorePlayer } = this.state;
        const unit = this.getHeightUnit();
        return scorePlayer * unit;
    }
    getOpponentHeight() {
        const { scoreOpponent } = this.state;
        const unit = this.getHeightUnit();
        return scoreOpponent * unit;
    }

    render() {
        return (
            <ClickWarsComponent
                { ...this.state }
                { ...this.containerFunctions }
            />
        )
    }

}

export default ClickWarsContainer;
