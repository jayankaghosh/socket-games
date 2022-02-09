<?php


namespace Ludo\Assets\Games;


use Ludo\Assets\AbstractGame;
use Ludo\Assets\Player;
use Ludo\GameException;

class TicTacToe extends AbstractGame
{

    const GAME_CODE = 'tic-tac-toe';

    protected int $boardSize = 3;
    protected array $board = [];
    protected array $playerAssignments = [];
    protected int $currentPlayer = 0;

    public function start()
    {
        parent::start();
        sleep(0.5);
        $this->assignPlayerNumbers();
        $this->initBoard();
        sleep(0.5);
        $this->sendTurnInfo(0);
    }

    protected function assignPlayerNumbers()
    {
        foreach ($this->getPlayers() as $player) {
            if ($this->getHost()->getPlayerToken() === $player->getPlayerToken()) {
                $playerNumber = 0;
            } else {
                $playerNumber = 1;
            }
            $this->playerAssignments[$player->getPlayerToken()] = $playerNumber;
            $message = $this->prepareMessage('game_player_number_self', $playerNumber);
            $player->getConnection()->send($message);
        }
    }

    protected function initBoard()
    {
        for($i = 0; $i < $this->boardSize; $i++) {
            for ($j = 0; $j < $this->boardSize; $j++) {
                $this->board[$i][$j] = -1;
            }
        }
        $this->sendBoardData();
    }

    protected function sendTurnInfo($playerNumber)
    {
        $this->currentPlayer = $playerNumber;
        $this->broadcast('game_player_turn', $playerNumber);
    }

    protected function sendBoardData()
    {
        $this->broadcast('game_draw_board', \json_encode($this->board));
    }

    public function getMaximumNumberOfPlayers(): int
    {
        return 2;
    }

    public function receiveData(Player $player, string $type, $data)
    {
        if ($type === 'move') {
            list($x, $y) = explode(',', $data);
            if ($this->board[$x][$y] !== -1) {
                throw new GameException('Cell not empty');
            } else {
                $this->board[$x][$y] = $this->playerAssignments[$player->getPlayerToken()];
            }
            $this->sendBoardData();
            if ($this->currentPlayer === 0) {
                $this->sendTurnInfo(1);
            } else {
                $this->sendTurnInfo(0);
            }
            $this->checkIfGameOver();
        }
    }

    protected function validateWinner($winner)
    {
        if ($winner !== null) {
            foreach ($this->playerAssignments as $token => $playerNumber) {
                if ($winner === $playerNumber) {
                    $this->gameOver($this->getPlayers()[$token]);
                    return true;
                }
            }
        }
        return false;
    }

    protected function checkRowForWinner($rowNumber)
    {
        $winner = $this->board[$rowNumber][0];
        for ($i = 1; $i < $this->boardSize; $i++) {
            if ($this->board[$rowNumber][$i] !== $winner) {
                $winner = null;
                break;
            }
        }
        return $this->validateWinner($winner);
    }

    protected function checkColumnForWinner($colNumber)
    {
        $winner = $this->board[0][$colNumber];
        for ($i = 1; $i < $this->boardSize; $i++) {
            if ($this->board[$i][$colNumber] !== $winner) {
                $winner = null;
                break;
            }
        }
        return $this->validateWinner($winner);
    }

    protected function checkLeftDiagonalForWinner()
    {
        $winner = $this->board[0][0];
        for ($i = 0; $i < $this->boardSize; $i++) {
            if ($this->board[$i][$i] !== $winner) {
                $winner = null;
                break;
            }
        }
        return $this->validateWinner($winner);
    }

    protected function checkRightDiagonalForWinner()
    {
        $highestIndex = $this->boardSize - 1;
        $winner = $this->board[0][$highestIndex];
        for ($i = 1; $i < $this->boardSize; $i++) {
            if ($this->board[$i][$highestIndex - $i] !== $winner) {
                $winner = null;
                break;
            }
        }
        return $this->validateWinner($winner);
    }

    protected function checkIfGameOver()
    {
        $winnerChosen = false;
        if (!$winnerChosen) {
            for ($i = 0; $i < $this->boardSize; $i++) {
                if ($this->checkRowForWinner($i)) {
                    $winnerChosen = true;
                    break;
                }
            }
        }
        if (!$winnerChosen) {
            for ($i = 0; $i < $this->boardSize; $i++) {
                if ($this->checkColumnForWinner($i)) {
                    $winnerChosen = true;
                    break;
                }
            }
        }
        if (!$winnerChosen) {
            if ($this->checkLeftDiagonalForWinner()) {
                $winnerChosen = true;
            }
        }
        if (!$winnerChosen) {
            if ($this->checkRightDiagonalForWinner()) {
                $winnerChosen = true;
            }
        }

        if (!$winnerChosen) {
            $cellIsEmpty = false;
            for($i = 0; $i < $this->boardSize; $i++) {
                for ($j = 0; $j < $this->boardSize; $j++) {
                    if ($this->board[$i][$j] === -1) {
                        $cellIsEmpty = true;
                        break 2;
                    }
                }
            }
            if (!$cellIsEmpty) {
                $this->gameOver(null);
            }
        }
    }

    public function getMinimumNumberOfPlayers(): int
    {
        return 2;
    }
}
