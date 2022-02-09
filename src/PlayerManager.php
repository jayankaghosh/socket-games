<?php


namespace Ludo;


use Ludo\Assets\Player;
use Ratchet\ConnectionInterface;

class PlayerManager
{
    /**
     * @var Player[]
     */
    protected array $players = [];


    public function getPlayerByConnection(ConnectionInterface $connection)
    {
        foreach ($this->players as $player) {
            if ($player->getConnection() === $connection) {
                return $player;
            }
        }
        return null;
    }

    public function deletePlayer(Player $player)
    {
        if (isset($this->players[$player->getPlayerToken()])) {
            unset($this->players[$player->getPlayerToken()]);
        }
    }

    public function addPlayer(Player $player)
    {
        foreach ($this->players as $existingPlayer) {
            if ($existingPlayer->getName() === $player->getName()) {
                throw new GameException(sprintf('Player with the name "%s" already exists', $player->getName()));
            }
        }
        $this->players[$player->getPlayerToken()] = $player;
    }

    /**
     * @return Player[]
     */
    public function getPlayers(): array
    {
        return $this->players;
    }

    public function generateUniqueToken()
    {
        $token = md5(uniqid());
        if (array_key_exists($token, $this->players)) {
            $token = $this->generateUniqueToken();
        }
        return $token;
    }

    /**
     * @param $payload
     * @return Player
     * @throws GameException
     */
    public function validatePlayer($payload): Player
    {
        $token = $payload['token'] ?? null;
        if ($token) {
            $player = $this->players[$token] ?? null;
            if ($player && $player instanceof Player) {
                return $player;
            }
        }
        throw new GameException('Invalid player. Register to play');
    }
}
