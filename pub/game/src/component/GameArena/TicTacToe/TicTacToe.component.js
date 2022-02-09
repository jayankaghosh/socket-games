import React, {PureComponent} from "react";
import styles from './TicTacToe.module.scss';

export class TicTacToeComponent extends PureComponent {

    renderCellContent(cell) {
        if (cell === 0) return 'X';
        else if (cell === 1) return 'O';
        else return <>&nbsp;</>;
    }

    renderBoardCell(cell, indexX, indexY) {
        const { board, onCellClick } = this.props;
        const rowCount = board.length;
        const colCount = board[0].length;
        const additionalClasses = [];
        if (indexX === 0) {
            additionalClasses.push(styles.NoTop);
        } else if (indexX === rowCount - 1) {
            additionalClasses.push(styles.NoBottom);
        }
        if (indexY === 0) {
            additionalClasses.push(styles.NoLeft);
        } else if (indexY === colCount - 1) {
            additionalClasses.push(styles.NoRight);
        }
        return (
            <div className={`${styles.BoardCell} ${additionalClasses.join(' ')}`} onClick={ () => onCellClick(indexX, indexY) }>
                { this.renderCellContent(cell) }
            </div>
        )
    }

    renderBoardRow(row, indexX) {
        return (
            <div className={styles.BoardRow}>
                { row.map((cell, indexY) => this.renderBoardCell(cell, indexX, indexY)) }
            </div>
        )
    }

    renderBoard() {
        const { board } = this.props;
        if (!board) return null;
        return (
            <div className={styles.Board}>
                { board.map((row, index) => this.renderBoardRow(row, index)) }
            </div>
        );
    }

    renderTurnInfo() {
        const { isMyTurn } = this.props;
        let name = '';
        if (isMyTurn) {
            name = 'your'
        } else {
            name = `opponent's`;
        }
        return (
            <h2 className={styles.TurnInfo}>{ name } turn</h2>
        );
    }

    render() {
        return (
            <div className={ styles.GameArena }>
                {this.renderTurnInfo()}
                {this.renderBoard()}
            </div>
        )
    }

}

export default TicTacToeComponent;
