<?php


namespace Ludo;


use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;

abstract class AbstractSocketManager implements MessageComponentInterface
{

    /**
     * @var ConnectionInterface[]
     */
    protected $clients;

    /**
     * @var Logger
     */
    protected $logger;

    public function __construct() {
        $this->clients = [];
        $this->logger = new Logger();
    }

    abstract protected function handleMessage(ConnectionInterface $connection, $message): void;

    protected function getResourceId(ConnectionInterface $connection)
    {
        return $connection->resourceId;
    }

    public function onOpen(ConnectionInterface $conn) {
        $resourceId = $this->getResourceId($conn);
        $this->clients[$resourceId] = $conn;
        $this->logger->log("New connection from ({$resourceId})");
    }

    public function onMessage(ConnectionInterface $from, MessageInterface $msg) {
        $this->logger->log(sprintf('Message from (%s). Contents: %s', $this->getResourceId($from), $msg));
        $this->handleMessage($from, $msg);
    }

    protected function broadCastMessage($message, ?ConnectionInterface $exclude = null)
    {
        $excludeResourceId = null;
        if ($exclude) {
            $excludeResourceId = $this->getResourceId($exclude);
        }
        foreach ($this->clients as $client) {
            if (!$excludeResourceId || $excludeResourceId !== $this->getResourceId($client)) {
                $this->sendMessage($message, $client);
            }
        }
    }

    protected function sendMessage($message, ConnectionInterface $client)
    {
        $this->logger->log(sprintf('Sending message to (%s). Contents: %s', $this->getResourceId($client), $message));
        $client->send($message);
    }

    public function onClose(ConnectionInterface $conn) {
        $resourceId = $this->getResourceId($conn);
        unset($this->clients[$resourceId]);
        $this->logger->log("Connection ($resourceId) has disconnected");
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        $this->logger->log("An error has occurred: {$e->getMessage()}");
        $conn->close();
    }
}
