import React, { PureComponent } from 'react';

import TextField from "@mui/material/TextField";
import styles from './PlayerSelection.module.scss';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export class PlayerSelection extends PureComponent {

    renderRegisterForm() {
        const { onRegister, onNameTyped } = this.props;
        return (
            <div className={ styles.RegisterForm }>
                <form onSubmit={ onRegister }>
                    <TextField
                        onKeyUp={ onNameTyped }
                        autoComplete={ 'off' }
                        label="Enter username"
                        variant="outlined"
                        name='name'
                        InputProps={
                            {
                                endAdornment: (
                                    <Button variant="contained" type='submit'>Register</Button>
                                )
                            }
                        }
                    />
                </form>
            </div>
        )
    }


    render() {
        return (
            <div className={ styles.PlayerSelection }>
                <Stack spacing={2}>
                    <h2>Select username to start playing</h2>
                    { this.renderRegisterForm() }
                </Stack>
            </div>
        )
    }

}

export default PlayerSelection;
