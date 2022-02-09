<?php


namespace Ludo;


use Ludo\Assets\Player;
use Ratchet\ConnectionInterface;

class GameMaster extends AbstractSocketManager
{

    const TYPE_REGISTER = 'register';
    const TYPE_FETCH_USER_DATA = 'fetch_user_data';
    const TYPE_HOST = 'host';
    const TYPE_JOIN = 'join';
    const TYPE_ERROR = 'error';
    const TYPE_INFO = 'info';
    const TYPE_PLAYER_COUNT = 'player_count';
    const TYPE_GAME_START = 'game_start';


    /**
     * @var PlayerManager
     */
    protected $playerManager;

    /**
     * @var GameManager
     */
    protected $gameManager;

    public function __construct()
    {
        $this->playerManager = new PlayerManager();
        $this->gameManager = new GameManager();
        parent::__construct();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        parent::onOpen($conn);
        $this->broadcastPlayerCount($conn);
    }

    public function onClose(ConnectionInterface $conn)
    {
        $player = $this->playerManager->getPlayerByConnection($conn);
        if ($player) {
            $this->playerManager->deletePlayer($player);
            $this->gameManager->deletePlayer($player);
            $this->broadcastPlayerCount();
        }
        parent::onClose($conn);
    }

    protected function prepareMessage($type, $message)
    {
        return \json_encode([
            'type' => $type,
            'data' => $message
        ]);
    }

    protected function broadcastPlayerCount(?ConnectionInterface $connection = null)
    {
        $message = $this->prepareMessage(self::TYPE_PLAYER_COUNT, count($this->playerManager->getPlayers()));
        if ($connection) {
            $connection->send($message);
        } else {
            $this->broadCastMessage($message);
        }
    }

    protected function handleMessage(ConnectionInterface $connection, $message): void
    {
        try {
            $message = \json_decode($message, true);
            if (!$message || !isset($message['type']) || !isset($message['data'])) {
                throw new GameException('Invalid data sent');
            }

            if ($message['type'] === self::TYPE_REGISTER) {
                $this->handleRegistration($connection, $message['data']);
            } else if ($message['type'] === self::TYPE_FETCH_USER_DATA) {
                $player = $this->playerManager->validatePlayer($message);
                $this->sendMessage(
                    $this->prepareMessage(
                        self::TYPE_FETCH_USER_DATA,
                        \json_encode($player->toArray())
                    ),
                    $connection
                );
            } else if ($message['type'] === self::TYPE_HOST) {
                $player = $this->playerManager->validatePlayer($message);
                $game = $this->gameManager->createGame($player, $message['data']);
                $this->sendMessage(
                    $this->prepareMessage(
                        self::TYPE_HOST,
                        $game->getToken()
                    ),
                    $connection
                );
            } else if ($message['type'] === self::TYPE_JOIN) {
                $player = $this->playerManager->validatePlayer($message);
                $gameId = $message['data'];
                $game = $this->gameManager->getGame($gameId);
                $game->addPlayer($player);
            } else if ($message['type'] === self::TYPE_GAME_START) {
                $player = $this->playerManager->validatePlayer($message);
                $game = $this->gameManager->validateGame($message);
                if ($player->getPlayerToken() === $game->getHost()->getPlayerToken()) {
                    $game->start();
                } else {
                    throw new GameException('Only the host can start a game');
                }
            } else if (strpos($message['type'], 'game_') === 0) {
                $type = strtolower(substr($message['type'], strlen('game_')));
                $player = $this->playerManager->validatePlayer($message);
                $game = $this->gameManager->validateGame($message);
                $game->receiveData($player, $type, $message['data']);
            } else {
                throw new GameException(sprintf('Invalid type "%s"', $message['type']));
            }
        } catch (GameException $gameException) {
            $this->sendMessage(
                $this->prepareMessage(
                    self::TYPE_ERROR,
                    $gameException->getMessage()
                ),
                $connection
            );
        }
    }

    protected function handleRegistration(ConnectionInterface $connection, $userName)
    {
        $player = $this->playerManager->getPlayerByConnection($connection);
        if ($player) {
            $userToken = $player->getPlayerToken();
        } else {
            $userToken = $this->playerManager->generateUniqueToken();
        }
        $this->playerManager->addPlayer(new Player($connection, $userName, $userToken));
        $this->sendMessage($this->prepareMessage(self::TYPE_REGISTER, $userToken), $connection);
        $this->broadcastPlayerCount();
    }
}
