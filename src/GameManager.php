<?php


namespace Ludo;


use Ludo\Assets\AbstractGame;
use Ludo\Assets\Games\GameList;
use Ludo\Assets\Player;

class GameManager
{
    /**
     * @var AbstractGame[]
     */
    protected array $games = [];

    public function createGame(Player $host, $gameType): AbstractGame
    {
        $token = $this->generateUniqueToken();
        $gameClass = GameList::$games[$gameType] ?? null;
        if (!$gameClass) {
            throw new GameException(sprintf('Game %s not found', $gameType));
        }
        /** @var AbstractGame $game */
        $game = new $gameClass($token, $this);
        $game->setHost($host);
        $this->games[$token] = $game;
        return $game;
    }

    public function deleteGame(AbstractGame $game)
    {
        if (isset($this->games[$game->getToken()])) {
            unset($this->games[$game->getToken()]);
        }
    }

    public function getGame($token)
    {
        $game = $this->games[$token] ?? null;
        if (!$game) {
            throw new GameException(sprintf('Game %s not found', $token));
        }
        return $game;
    }

    protected function generateUniqueToken()
    {
        $token = rand(100000, 999999);
        if (array_key_exists($token, $this->games)) {
            $token = $this->generateUniqueToken();
        }
        return $token;
    }

    /**
     * @param $payload
     * @return AbstractGame|mixed
     * @throws GameException
     */
    public function validateGame($payload)
    {
        $token = $payload['game_id'] ?? null;
        if (!$token) {
            throw new GameException('game_id is missing');
        }
        return $this->getGame($token);
    }

    public function deletePlayer(Player $player)
    {
        foreach ($this->games as $game) {
            try {
                $game->deletePlayer($player);
            } catch (GameException $exception) {}
        }
    }
}
