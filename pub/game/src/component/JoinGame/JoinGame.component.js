import React, {PureComponent} from "react";
import styles from './JoinGame.module.scss';
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export class JoinGame extends PureComponent {

    renderJoinFormButton() {
        const { isJoining } = this.props;
        return (
            <div>
                <Button type='submit' disabled={ isJoining } variant="outlined">
                    { isJoining ? 'Joining...': 'Join' }
                </Button>
            </div>
        );
    }

    renderJoinForm() {
        const { onJoin, onGameCodeChange } = this.props;
        return (
            <form onSubmit={ onJoin }>
                <TextField label="Game Code" name='game_code' autoComplete='off' variant="standard" onKeyUp={ onGameCodeChange } />
                { this.renderJoinFormButton() }
            </form>
        );
    }

    render() {
        return (
            <div className={ styles.JoinGame }>
                <Stack spacing={2}>
                    <h2>Enter the game code to join the game</h2>
                    { this.renderJoinForm() }
                </Stack>
            </div>
        )
    }

}

export default JoinGame;
