import {PureComponent} from "react";
import PlayerSelection from "./PlayerSelection.component";
import Socket, {TYPE_FETCH_USER_DATA, TYPE_REGISTER} from '../../util/Socket';
import snackbar from 'snackbar';

export class PlayerSelectionContainer extends PureComponent {

    containerFunctions = {
        onRegister: this.onRegister.bind(this),
        onNameTyped: this.onNameTyped.bind(this)
    }

    onRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name').trim();
        if (!name) {
            snackbar.show('Cannot register without a name');
            return;
        }
        Socket.addListener('player-register', TYPE_REGISTER, async ({ data: token }) => {
            await Socket.setToken(token);
            this.props.setStep('game-selection');
        });
        Socket.sendData(TYPE_REGISTER, name);
    }

    onNameTyped(e) {
        const input = e.target;
        let value = input.value;
        value = value.trim().toLowerCase().replace(/ /g, '_');
        input.value = value;
    }

    render() {
        return (
            <PlayerSelection
                { ...this.state }
                { ...this.containerFunctions }
            />
        )
    }

}

export default PlayerSelectionContainer;
