import React, { Component } from "react";
import ReactDOM from "react-dom";
import { GiftedChat } from "react-web-gifted-chat";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const config = {
    apiKey: "AIzaSyC9Hcq-eFBRGcC79SXtYp1NVDjsss3tEC8",
    authDomain: "chat-16ee2.firebaseapp.com",
    databaseURL: "https://chat-16ee2.firebaseio.com",
    projectId: "chat-16ee2",
    storageBucket: "chat-16ee2.appspot.com",
    messagingSenderId: "703172176372",
};
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

class ChatPage extends Component {
    constructor() {
        super();
        this.state = {
            messages: [{
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React',
                    avatar: 'https://facebook.github.io/react/img/logo_og.png',
                },
            }],
            user: {},
            isAuthenticated: false,
        };
    }

    onSend(messages) {
        console.log("messages")
        console.log(messages)
        const msgs = this.state.messages;

        if (messages[0].text === "Kiss me") {
            const msg = {
                id: 14,
                text: 'Kiss me',
                createdAt: new Date(),
                user: {
                    id: 1,
                    name: 'Vini',
                    avatar: 'https://facebook.github.io/react/img/logo_og.png',
                }
            };

            const msg2 = {
                id: 15,
                text: 'Sure I can do that for you',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Vini',
                    avatar: 'https://facebook.github.io/react/img/logo_og.png',
                }
            };

            msgs.push(msg);
            msgs.push(msg2);

            this.setState({messages: msgs});
        } else {
            const msg = {
                id: 12,
                text: 'Hi',
                createdAt: new Date(),
                user: {
                    id: 1,
                    name: 'Vini',
                    avatar: 'https://facebook.github.io/react/img/logo_og.png',
                }
            };
            const msg2 = {
                id: 13,
                text: 'What can I do for you?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Vini',
                    avatar: 'https://facebook.github.io/react/img/logo_og.png',
                }
            };

            msgs.push(msg);
            msgs.push(msg2);

            this.setState({messages: msgs});
            // for (const message of messages) {
            //     this.saveMessage(message);
            // }
        }




    }

    saveMessage(message) {
        return firebase
            .database()
            .ref("/messages/")
            .push(message)
            .catch(function(error) {
                console.error("Error saving message to Database:", error);
            });
    }

    renderSignOutButton() {
        if (this.state.isAuthenticated) {
            return <Button onClick={() => this.signOut()}>Sign out</Button>;
        }
        return null;
    }

    renderChat() {
        return (
            <GiftedChat
                user={this.chatUser}
                messages={this.state.messages.slice().reverse()}
                onSend={messages => this.onSend(messages)}
            />
        );
    }

    renderChannels() {
        return (
            <List>
                <ListItem button>
                    <ListItemAvatar>
                        <Avatar>D</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Default" />
                </ListItem>
                <ListItem button>
                    <ListItemAvatar>
                        <Avatar>P</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Pizza" />
                </ListItem>
            </List>
        );
    }

    renderChannelsHeader() {
        return (
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        Channels
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
    renderChatHeader() {
        return (
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        Default channel
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
    renderSettingsHeader() {
        return (
            <AppBar position="static" color="default">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        Settings
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }

    render() {
        return (
            <div style={styles.container}>
                {/*{this.renderPopup()}*/}
                <div style={styles.channelList}>
                    {this.renderChannelsHeader()}
                    {this.renderChannels()}
                </div>
                <div style={styles.chat}>
                    {this.renderChatHeader()}
                    {this.renderChat()}
                </div>
                <div style={styles.settings}>
                    {this.renderSettingsHeader()}
                    {this.renderSignOutButton()}
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        height: "100vh",
    },
    channelList: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
    },
    chat: {
        display: "flex",
        flex: 3,
        flexDirection: "column",
        borderWidth: "1px",
        borderColor: "#ccc",
        borderRightStyle: "solid",
        borderLeftStyle: "solid",
    },
    settings: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
    },
};


export default ChatPage;