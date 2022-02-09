<?php


namespace Ludo\Assets\Games;


class GameList
{
    public static array $games = [
        ClickWars::GAME_CODE => ClickWars::class,
        TicTacToe::GAME_CODE => TicTacToe::class,
        ChatRoom::GAME_CODE => ChatRoom::class
    ];
}
