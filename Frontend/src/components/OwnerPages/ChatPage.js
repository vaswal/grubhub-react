import React, {Component} from "react";
import {GiftedChat} from "react-web-gifted-chat";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import uuid from "uuid";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {connect} from "react-redux";
import {getChats, sendMessage} from "../../js/actions/ownerChatActions";

function mapStateToProps(store) {
    return {
        chats: store.ownerChat.chats,
        messages: store.ownerChat.messages,
        currentChatId: store.ownerChat.currentChatId,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getChats: (payload) => dispatch(getChats(payload)),
        sendMessage: (payload) => dispatch(sendMessage(payload)),

    };
}

class ChatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatUser: {
                _id: 2,
                name: 'Vini',
                avatar: 'https://facebook.github.io/react/img/logo_og.png',
            }
            // messages: [{
            //     _id: 1,
            //     text: 'Hello developer',
            //     createdAt: new Date(),
            //     user: {
            //         _id: 2,
            //         name: 'React',
            //         avatar: 'https://facebook.github.io/react/img/logo_og.png',
            //     },
            // }],
        };
    }

    onSend(messages) {
        //message.preventDefault();
        console.log("messages")
        console.log(messages)

        const selectedOrder = this.props.location.state.selectedOrder
        const payload = {};
        payload.buyer_id = selectedOrder.buyer_id;
        payload.chat_id = this.props.currentChatId;
        payload.message = messages[0];
        payload.userType = "owner";

        this.props.sendMessage(payload);
    }

    componentDidMount() {
        console.log("ChatPage");
        const selectedOrder = this.props.location.state.selectedOrder
        console.log(selectedOrder);

        // buyer_id: "5dae0aa889ba4d39c3c194ee"
        // customer_address: "undefined undefined's GPS address"
        // customer_name: "undefined undefined"
        // items: "{"items":[{"name":"4","quantity":2,"price":4}]}"
        // owner_id: "5dae13bf4ca4c93b76b61384"
        // status: "Preparing"
        // __v: 0
        // _id: "5daebc962afc4d4c1f2e0cbf"
        const msg = {
            _id: uuid(),
            text: 'What can I do for you?',
            createdAt: new Date(),
            user: {
                _id: selectedOrder.buyer_id,
                name: selectedOrder.buyer_id + "name"
            }
        };

        const payload = {};
        payload.order_id = selectedOrder._id;
        payload.buyer_id = selectedOrder.buyer_id;
        payload.messages = [];
        payload.messages.push(msg);
        //payload.messages = JSON.stringify(payload.messages);
        payload.customer_name = selectedOrder.customer_name;
        payload.customer_address = selectedOrder.customer_address;
        payload.items = selectedOrder.items;
        payload.status = selectedOrder.status;
        payload.owner_id = selectedOrder.owner_id;
        payload.price = selectedOrder.price;
        payload.userType = "owner";

        this.props.getChats(payload);
    }

    renderChat() {
        // console.log("this.props.messages");
        // console.log(this.props.messages);
        //
        // const msgs = [];
        // const msg = {
        //     id: 15,
        //     text: 'Sure I can do that for you',
        //     createdAt: new Date(),
        //     user: {
        //         _id: 2,
        //         name: 'Vini',
        //         avatar: 'https://facebook.github.io/react/img/logo_og.png',
        //     }
        // };
        //
        // msgs.push(msg);
        // console.log("msgs");
        // console.log(msgs);


        return (
            <GiftedChat
                user={this.state.chatUser}
                messages={this.props.messages.slice().reverse()}
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
                    <ListItemText primary="Default"/>
                </ListItem>
                <ListItem button>
                    <ListItemAvatar>
                        <Avatar>P</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Pizza"/>
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
                <div style={styles.channelList}>
                    {this.renderChannelsHeader()}
                    {this.renderChannels()}
                </div>
                <div style={styles.chat}>
                    {this.renderChatHeader()}
                    {this.renderChat()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);