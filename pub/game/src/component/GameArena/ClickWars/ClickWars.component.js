import {PureComponent} from "react";
import styles from './ClickWars.module.scss';

export class ClickWarsComponent extends PureComponent {

    renderPlayer() {
        const { colourPlayer, getPlayerHeight, onClick } = this.props;
        const styleObj = {
            background: colourPlayer,
            height: `${ getPlayerHeight() }px`
        }
        return (
            <div className={ styles.player } style={ styleObj } onClick={ onClick }>
                <span>player</span>
            </div>
        );
    }

    renderOpponent() {
        const { colourOpponent, getOpponentHeight } = this.props;
        const styleObj = {
            background: colourOpponent,
            height: `${ getOpponentHeight() }px`
        }
        return (
            <div className={ styles.opponent } style={ styleObj }>
                <span>opponent</span>
            </div>
        );
    }

    render() {
        const { gameArenaHeight } = this.props;
        return (
            <div className={ styles.GameArena } style={ { height: `${ gameArenaHeight }px` } }>
                { this.renderOpponent() }
                { this.renderPlayer() }
            </div>
        )
    }

}

export default ClickWarsComponent;
