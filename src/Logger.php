<?php


namespace Ludo;


class Logger
{
    public function log($message)
    {
        echo sprintf("%s: %s\n", date('Y-m-d H:i:s'), $message);
    }
}
