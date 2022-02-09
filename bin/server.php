<?php

require_once __DIR__ . '/../vendor/autoload.php';


$ws = new \Ratchet\WebSocket\WsServer(new \Ludo\GameMaster());

$server = \Ratchet\Server\IoServer::factory(
    new \Ratchet\Http\HttpServer($ws),
    8080
);

$server->run();
