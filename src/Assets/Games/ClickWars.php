<?php


namespace Ludo\Assets\Games;


use Ludo\Assets\AbstractGame;
use Ludo\Assets\Player;

class ClickWars extends AbstractGame
{

    const GAME_CODE = 'click-wars';

    protected array $colours = [
        '#ff0000',
        '#0000ff'
    ];

    protected array $scoreboard = [];

    protected int $totalScore = 50;

    public function start()
    {
        parent::start();
        $this->assignColours();
        $this->initScoreboard();
    }

    protected function initScoreboard()
    {
        $initialScorePerPlayer = $this->totalScore / count($this->players);
        foreach ($this->players as $player) {
            $this->scoreboard[$player->getPlayerToken()] = $initialScorePerPlayer;
        }
        $this->broadcastScores();
    }

    protected function broadcastScores()
    {
        foreach ($this->players as $player) {
            $scores = [];
            foreach ($this->scoreboard as $token => $score) {
                if ($player->getPlayerToken() === $token) {
                    $key = 'player';
                } else {
                    $key = 'opponent';
                }
                $scores[$key] = $score;
            }
            $message =  $this->prepareMessage(
                'game_scores',
                $scores
            );
            $player->getConnection()->send($message);
        }
    }

    protected function assignColours()
    {
        foreach ($this->players as $player) {
            $key = $this->getHost()->getPlayerToken() === $player->getPlayerToken() ? 0 : 1;
            $playerKey = $key;
            $opponentKey = $key === 0 ? 1 : 0;
            $player->getConnection()->send(
                $this->prepareMessage(
                    'game_colour_player',
                    $this->colours[$playerKey]
                )
            );
            $player->getConnection()->send(
                $this->prepareMessage(
                    'game_colour_opponent',
                    $this->colours[$opponentKey]
                )
            );
        }
    }

    public function receiveData(Player $player, string $type, $data)
    {
        if ($type === 'clicked') {
            foreach ($this->scoreboard as $token => $score) {
                if ($player->getPlayerToken() === $token) {
                    $score++;
                } else {
                    $score--;
                }
                $this->scoreboard[$token] = $score;
            }
            $this->broadcastScores();
            $this->checkIfGameOver();
        }
    }

    protected function checkIfGameOver()
    {
        foreach ($this->scoreboard as $token => $score) {
            if ($score >= $this->totalScore) {
                foreach ($this->getPlayers() as $player) {
                    if ($player->getPlayerToken() === $token) {
                        $this->gameOver($player);
                        return;
                    }
                }
            }
        }
    }

    public function getMaximumNumberOfPlayers(): int
    {
        return 2;
    }

    public function getMinimumNumberOfPlayers(): int
    {
        return 2;
    }
}
