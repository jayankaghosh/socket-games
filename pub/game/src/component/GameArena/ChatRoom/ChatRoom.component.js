import React, {createRef, PureComponent} from "react";
import styles from './ChatRoom.module.scss';
import TextField from "@mui/material/TextField";
import SendIcon from '@mui/icons-material/Send';
import {getPlayer} from "../../../util/Player";
import Divider from "@mui/material/Divider";
import Socket from "../../../util/Socket";
import IconButton from "@mui/material/IconButton";
import dateformat from "dateformat";

export default class ChatRoomComponent extends PureComponent {

    messagesRef = createRef();

    state = {
        gameArenaHeight: 0,
        messages: []
    }

    componentDidMount() {
        const totalHeight = window.screen.availHeight;
        const headerHeight = document.querySelector('header').clientHeight;
        const gameArenaHeight = totalHeight - headerHeight;
        this.setState({ gameArenaHeight });
        Socket.addListener('game_message', 'game_message', ({type, data}) => {
            data = JSON.parse(data);
            data.date = new Date();
            const messages = [...this.state.messages];
            messages.push(data);
            this.setState({ messages });
            this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
            if (data.from !== getPlayer().name) {
                const ding = new Audio('https://cdn.videvo.net/videvo_files/audio/premium/audio0277/watermarked/_Soundstorm 4_Metal-MetalPing-44MagnumS-1_B03-03971_preview.mp3');
                ding.play();
            }
        });
    }

    renderMessageBubble(message) {
        const self = getPlayer().name;
        return (
            <div className={styles.MessageItem} data-is_self={ message.from === self ? 'true': 'false' }>
                <div className={styles.MessageBubble}>
                    <div className={ styles.From }>
                        <div className={styles.Name}>
                            { message.from }
                        </div>
                        <div className={styles.Date}>
                            { dateformat(message.date, 'mmm dd hh:MM TT') }
                        </div>
                    </div>
                    <Divider />
                    <div className={ styles.Message }>{ message.message }</div>
                </div>
            </div>
        )
    }

    renderMessages() {
        return (
            <div className={styles.Messages}>
                <div className={styles.MessageList} ref={ this.messagesRef }>
                    { this.state.messages.map(message => this.renderMessageBubble(message)) }
                </div>
            </div>
        )
    }

    onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const message = formData.get('message').trim();
        if (message) {
            Socket.sendData('game_message', message);
        }
        e.target.reset();
    }

    renderInputForm() {
        return (
            <form className={styles.FormContainer} onSubmit={ this.onSubmit.bind(this) }>
                <TextField
                    name='message'
                    autoComplete={'off'}
                    className={styles.TextField}
                    placeholder="Enter message"
                    variant="outlined"
                    InputProps={
                        {
                            endAdornment: (
                                <IconButton type={"submit"}>
                                    <SendIcon />
                                </IconButton>
                            )
                        }
                    }
                />
            </form>
        );
    }

    render() {
        return (
            <div className={styles.ChatRoom} style={ { height: `${this.state.gameArenaHeight}px` } }>
                { this.renderMessages() }
                { this.renderInputForm() }
            </div>
        )
    }

}
