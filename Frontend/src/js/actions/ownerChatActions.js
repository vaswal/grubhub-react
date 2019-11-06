import {GET_CHAT_OWNER, SEND_MESSAGE_OWNER} from "../constants/action-types";
import {HOSTNAME} from "../../components/Constants/Constants";
import axios from 'axios';

axios.defaults.withCredentials = true;

//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export function getChats(payload) {
    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:3001/chats/get`, payload)
            .then((response) => dispatch(getChatsUpdate(response.data)))
    }
}

const getChatsUpdate = (returnedData) => {
    console.log("getChatsUpdate")
    console.log("returnedData")
    console.log(returnedData)
    return {type: GET_CHAT_OWNER, payload: returnedData}
}

export function sendMessage(payload) {
    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:3001/chats/message/add`, payload)
            .then((response) => dispatch(sendMessageUpdate(response.data)))
    }
}

const sendMessageUpdate = (returnedData) => {
    console.log("getChatsUpdate")
    console.log("returnedData")
    console.log(returnedData)
    return {type: SEND_MESSAGE_OWNER, payload: returnedData}
}


