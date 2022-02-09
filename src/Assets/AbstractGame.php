<?php


namespace Ludo\Assets;


use Ludo\GameException;
use Ludo\GameManager;
use Ludo\GameMaster;

abstract class AbstractGame
{

    const GAME_CODE = '';

    protected string $token;
    /**
     * @var Player[]
     */
    protected array $players;

    protected Player $host;

    protected bool $isGameStarted = false;
    /**
     * @var GameManager
     */
    private GameManager $gameManager;

    /**
     * Game constructor.
     * @param string $token
     * @param GameManager $gameManager
     */
    public function __construct(
        string $token,
        GameManager $gameManager
    )
    {
        $this->token = $token;
        $this->players = [];
        $this->gameManager = $gameManager;
    }

    public function deletePlayer(Player $player)
    {
        if (isset($this->getPlayers()[$player->getPlayerToken()])) {
            unset($this->players[$player->getPlayerToken()]);
            $this->broadcast(GameMaster::TYPE_INFO, sprintf('%s has left the game', $player->getName()));
            $this->broadcastGamePlayers();
        } else {
            throw new GameException('Player not present in game');
        }
    }

    public function gameOver(?Player $winner)
    {
        if (!$winner) {
            $message = 'Game is a tie!';
        } else {
            $message = sprintf('%s wins!', $winner->getName());
        }
        $message = $this->prepareMessage('game_over', $message);
        foreach ($this->players as $player) {
            $player->getConnection()->send($message);
        }
        $this->gameManager->deleteGame($this);
    }

    /**
     * @return string
     */
    public function getToken(): string
    {
        return $this->token;
    }

    /**
     * @param string $token
     */
    public function setToken(string $token): void
    {
        $this->token = $token;
    }

    /**
     * @return array
     */
    public function getPlayers(): array
    {
        return $this->players;
    }

    protected function broadcast($type, $message)
    {
        $message = $this->prepareMessage($type, $message);
        foreach ($this->getPlayers() as $player) {
            $player->getConnection()->send($message);
        }
    }

    public function addPlayer(Player $player)
    {
        if (isset($this->players[$player->getPlayerToken()])) {
            throw new GameException(sprintf('Player already in game'));
        }
        if (count($this->players) === $this->getMaximumNumberOfPlayers()) {
            throw new GameException(sprintf('This game can only be played with %s players', $this->getMaximumNumberOfPlayers()));
        }
        $this->players[$player->getPlayerToken()] = $player;
        $this->broadcastGamePlayers();
        if (count($this->players) === $this->getMaximumNumberOfPlayers()) {
            $this->start();
        }

        $this->broadcast(GameMaster::TYPE_ERROR, sprintf('%s has joined the game', $player->getName()));

    }

    protected function broadcastGamePlayers()
    {
        $playerData = [];
        foreach ($this->players as $player) {
            $playerData[] = $player->toArray();
        }
        $this->broadcast(sprintf('game_%s_players', $this->getToken()), \json_encode($playerData));
    }

    /**
     * @return int
     */
    abstract public function getMaximumNumberOfPlayers(): int;
    abstract public function getMinimumNumberOfPlayers(): int;

    protected function prepareMessage($type, $message)
    {
        return \json_encode([
            'type' => $type,
            'data' => $message
        ]);
    }

    public function start()
    {
        if ($this->isGameStarted) {
            throw new GameException('Game has already started');
        } else if (count($this->getPlayers()) < $this->getMinimumNumberOfPlayers()) {
            throw new GameException(sprintf('Game needs minimum %s players to start', $this->getMinimumNumberOfPlayers()));
        }
        $this->broadcast('game_start', static::GAME_CODE);
        $this->isGameStarted = true;
    }

    abstract public function receiveData(Player $player, string $type, $data);

    /**
     * @return Player
     */
    public function getHost(): Player
    {
        return $this->host;
    }

    /**
     * @param Player $host
     */
    public function setHost(Player $host): void
    {
        $this->host = $host;
        $this->addPlayer($host);
    }
}
