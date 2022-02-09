import React, {PureComponent} from "react";
import styles from './HostGame.module.scss';
import Stack from "@mui/material/Stack";
import Socket, {TYPE_GAME_START, TYPE_HOST} from "../../util/Socket";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import PersonIcon from '@mui/icons-material/Person';
import games from '../GameArena/games';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export class HostGame extends PureComponent {

    state = {
        selectedGame: null,
        gameCode: null,
        players: []
    }


    onGameSelect(game) {
        this.setState({
            selectedGame: game
        });
        Socket.sendData(TYPE_HOST, game);
        Socket.addListener('on-hosting', TYPE_HOST, ({type, data: gameCode}) => {
            this.setState({ gameCode });
            Socket.setGameId(gameCode);
            Socket.addListener('on-players-broadcast', `game_${ gameCode }_players`, ({ type, data }) => {
                this.setState({ players: JSON.parse(data) });
            });
        });
    }

    renderGameCard(game) {
        return (
            <Grid item xs={4} className={ styles.GameItem } onClick={ () => this.onGameSelect(game) }>
                <div>
                    { game.replace(/-/g, ' ').toUpperCase() }
                </div>
            </Grid>
        )
    }

    renderAvailableGames() {
        if (this.state.selectedGame) return null;
        return (
            <Box sx={{ flexGrow: 1 }} className={styles.GameListContainer}>
                <Grid container spacing={2} className={ styles.GameList }>
                    <Grid item xs={12}>
                        <h2>Choose game to host</h2>
                    </Grid>
                    { Object.keys(games).map(game => this.renderGameCard(game)) }
                </Grid>
            </Box>
        );
    }

    renderJoinedPlayerCard(player) {
        return (
            <ListItem>
                <PersonIcon />
                <ListItemText primary={ player.name } />
            </ListItem>
        )
    }

    renderJoinedPlayers() {
        return (
            <div className={ styles.JoinedPlayers }>
                <h3>Players who joined this game</h3>
                <List>
                    { this.state.players.map(this.renderJoinedPlayerCard) }
                </List>
            </div>
        )
    }

    renderStartGameButton() {
        return (
            <Button variant="contained" onClick={ () => Socket.sendData(TYPE_GAME_START, true) }>
                START GAME
            </Button>
        )
    }

    renderGameInfo() {
        if (!this.state.selectedGame) return null;
        return (
            <Stack spacing={2}>
                <h2>Hosting game...</h2>
                <h3>Current game code is</h3>
                <h2 className={ styles.GameCode }>{ this.state.gameCode }</h2>
                { this.renderStartGameButton() }
                <Divider />
                { this.renderJoinedPlayers() }
            </Stack>
        );
    }

    render() {
        return (
            <div className={ styles.HostGame }>
                { this.renderAvailableGames() }
                { this.renderGameInfo() }
            </div>
        )
    }

}

export default HostGame;
