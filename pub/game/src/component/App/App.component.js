import React, { PureComponent } from 'react';
import { Helmet } from "react-helmet";
import 'snackbar/src/snackbar.scss';
import steps from './App.steps';
import styles from './App.module.scss';
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import Socket, {TYPE_ERROR, TYPE_INFO, TYPE_PLAYER_COUNT} from '../../util/Socket';
import snackbar from 'snackbar';
import PersonIcon from '@mui/icons-material/Person';
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import {getPlayer} from "../../util/Player";

export class App extends PureComponent {

    state = {
        isShowPopup: false,
        popupMessage: null,
        currentStep: null,
        totalPlayers: 0
    }

    componentDidMount() {
        Socket.connect(`ws://${ window.location.hostname }:8080`);
        Socket.addListener('on-player-count-change', TYPE_PLAYER_COUNT, ({type, data: totalPlayers}) => {
            this.setState({ totalPlayers });
        });
        Socket.addListener('handle-error', TYPE_ERROR, ({type, data}) => {
            snackbar.show(data);
        });
        Socket.addListener('handle-info', TYPE_INFO, ({type, data}) => {
            snackbar.show(data);
        });
        this.setCurrentStep('player-selection');
        Socket.addListener('on-game-start', 'game_start', ({ type, data: game }) => {
            this.setCurrentStep(`game-arena-${ game }`);
        });
        Socket.addListener('on-game-over', 'game_over', ({type, data}) => {
            this.setState({
                isShowPopup: true,
                popupMessage: data
            });
        });
    }

    setCurrentStep(currentStep) {
        this.setState({ currentStep });
    }

    renderNumberOfPlayers() {
        return (
            <div>
                <PersonIcon style={ {verticalAlign: 'sub'} } />
                <span>{ this.state.totalPlayers }</span>
            </div>
        )
    }

    onLogoClick() {
        if (getPlayer().name) {
            this.setCurrentStep('game-selection')
        } else {
            this.setCurrentStep('player-selection');
        }
    }

    renderAppBar() {
        const { currentStep } = this.state;
        const stepData = steps[currentStep] || {};
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={ () => this.onLogoClick() }
                        >
                            { <SportsEsportsRoundedIcon /> }
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            { stepData.title || 'Ludo' }
                        </Typography>
                        { this.renderNumberOfPlayers() }
                    </Toolbar>
                </AppBar>
            </Box>
        );
    }

    renderCurrentStep() {
        const { currentStep } = this.state;
        const stepData = steps[currentStep];
        if (!stepData) return null;
        const StepComponent = stepData.component;
        return (
            <div>
                { this.renderAppBar() }
                <StepComponent
                    setStep={ this.setCurrentStep.bind(this) }
                />
            </div>
        );
    }

    onPlayAgain() {
        this.setState({
            isShowPopup: false,
            popupMessage: ''
        });
        this.setCurrentStep('game-selection');
    }

    renderPopup() {
        const { isShowPopup, popupMessage } = this.state;
        return (
            <Modal open={ isShowPopup }>
                <Box className={ styles.popup }>
                    <div className={ styles.popupBody }>
                        <Typography variant={ "h4" } component={"h4"}>{ popupMessage }</Typography>
                        <Button variant={"outlined"} onClick={ () => this.onPlayAgain() }>
                            PLAY AGAIN
                        </Button>
                    </div>
                </Box>
            </Modal>
        )
    }

    render() {
        return (
            <div className={ styles.gameMaster }>
                <Helmet>
                    <title>Touch wars</title>
                    <meta name="viewport"
                          content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    />
                </Helmet>
                { this.renderPopup() }
                { this.renderCurrentStep() }
            </div>
        )
    }

}

export default App;
