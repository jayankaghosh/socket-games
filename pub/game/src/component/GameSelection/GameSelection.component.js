import React, {PureComponent} from "react";
import styles from './GameSelection.module.scss';
import Stack from "@mui/material/Stack";
import {getPlayer} from "../../util/Player";
import Button from "@mui/material/Button";

export class GameSelection extends PureComponent {

    render() {
        const { setStep } = this.props;
        return (
            <div className={ styles.GameSelection }>
                <Stack spacing={2}>
                    <h2>Welcome { getPlayer().name }</h2>
                    <Button variant="contained" size={"large"} onClick={ () => setStep('host-game') }>Host Game</Button>
                    <Button variant="outlined" size={"large"} onClick={ () => setStep('join-game') }>Join Game</Button>
                </Stack>
            </div>
        )
    }

}

export default GameSelection;
