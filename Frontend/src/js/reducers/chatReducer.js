import {GET_CHAT, SEND_MESSAGE} from "../constants/action-types";

const initialState = {
    chats: [],
    messages: [],
    currentChatId: null
};

export default function chatReducer(state = initialState, action) {
    console.log("action.payload")
    console.log(action.payload)

    if (action.type === GET_CHAT) {
        const sortedMessages = action.payload;
        sortedMessages.sort(function (a, b) {
            a = new Date(a.updated_at);
            b = new Date(b.updated_at);
            return a > b ? -1 : a < b ? 1 : 0;
        });

        console.log("sortedMessages")
        console.log(sortedMessages)

        console.log("sortedMessages[0]._id")
        console.log(sortedMessages[0]._id)

        return Object.assign({}, state, {
            chats: action.payload,
            messages: action.payload[0].messages,
            currentChatId: sortedMessages[0]._id
        });
    } else if (action.type === SEND_MESSAGE) {
        const sortedMessages = action.payload;
        sortedMessages.sort(function (a, b) {
            a = new Date(a.updated_at);
            b = new Date(b.updated_at);
            return a > b ? -1 : a < b ? 1 : 0;
        });

        return Object.assign({}, state, {
            messages: action.payload[0].messages,
            currentChatId: sortedMessages[0]._id
        });
    }

    return state;
}