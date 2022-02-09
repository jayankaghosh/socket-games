<?php


namespace Ludo\Assets;


use Ratchet\ConnectionInterface;

class Player
{
    /**
     * @var ConnectionInterface
     */
    protected ConnectionInterface $connection;
    protected string $name;
    private string $playerToken;
    protected ?string $currentGameId;

    /**
     * Player constructor.
     * @param ConnectionInterface $connection
     * @param string $name
     * @param string $playerToken
     * @param string|null $currentGameId
     */
    public function __construct(
        ConnectionInterface $connection,
        string $name,
        string $playerToken,
        ?string $currentGameId = null
    )
    {
        $this->connection = $connection;
        $this->name = $name;
        $this->playerToken = $playerToken;
        $this->currentGameId = $currentGameId;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string|null
     */
    public function getCurrentGameId(): ?string
    {
        return $this->currentGameId;
    }

    /**
     * @param string|null $currentGameId
     */
    public function setCurrentGameId(?string $currentGameId): void
    {
        $this->currentGameId = $currentGameId;
    }

    /**
     * @return string
     */
    public function getPlayerToken(): string
    {
        return $this->playerToken;
    }

    /**
     * @param string $playerToken
     */
    public function setPlayerToken(string $playerToken): void
    {
        $this->playerToken = $playerToken;
    }

    /**
     * @return ConnectionInterface
     */
    public function getConnection(): ConnectionInterface
    {
        return $this->connection;
    }

    /**
     * @param ConnectionInterface $connection
     */
    public function setConnection(ConnectionInterface $connection): void
    {
        $this->connection = $connection;
    }

    public function toArray()
    {
        return [
            'name' => $this->getName(),
            'current_game_id' => $this->getCurrentGameId()
        ];
    }

}
