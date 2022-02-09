<?php


namespace Ludo\Assets\Games;


use Ludo\Assets\AbstractGame;
use Ludo\Assets\Player;

class ChatRoom extends AbstractGame
{

    const GAME_CODE = 'chat-room';

    protected function getChatInfoMessage()
    {
        return \json_encode([
            'from' => 'ADMIN',
            'message' => sprintf('The current chatroom\'s code is %s. You can share this with other people to chat with them', $this->getToken())
        ]);
    }

    public function start()
    {
        parent::start();
        $this->broadcast('game_message', $this->getChatInfoMessage());
    }

    public function addPlayer(Player $player)
    {
        parent::addPlayer($player);
        if ($this->isGameStarted) {
            $message = $this->prepareMessage('game_start', static::GAME_CODE);
            $player->getConnection()->send($message);
            $player->getConnection()->send($this->prepareMessage('game_message', $this->getChatInfoMessage()));
        }
    }

    public function getMaximumNumberOfPlayers(): int
    {
        return 4000;
    }

    public function receiveData(Player $player, string $type, $data)
    {
        if ($type === 'message') {
            $this->broadcast('game_message', \json_encode([
                'from' => $player->getName(),
                'message' => $data
            ]));
        }
    }

    public function getMinimumNumberOfPlayers(): int
    {
        return 1;
    }
}
