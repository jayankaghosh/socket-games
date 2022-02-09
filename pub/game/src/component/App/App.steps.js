import PlayerSelection from "../PlayerSelection";
import GameSelection from "../GameSelection";
import HostGame from "../HostGame";
import JoinGame from "../JoinGame";
import ClickWars from "../GameArena/ClickWars";
import games from '../GameArena/games';

const steps = {
    'player-selection': {
        title: 'Player Selection',
        component: PlayerSelection
    },
    'game-selection': {
        title: 'Game Selection',
        component: GameSelection
    },
    'host-game': {
        title: 'Host Game',
        component: HostGame
    },
    'join-game': {
        title: 'Join Game',
        component: JoinGame
    }
}

Object.keys(games).forEach(game => {
    steps[`game-arena-${ game }`] = {
        title: game.replace(/-/g, ' ').toUpperCase(),
        component: games[game]
    }
});

export default steps;
