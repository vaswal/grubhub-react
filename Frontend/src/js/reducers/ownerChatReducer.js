import {GET_CHAT_OWNER, SEND_MESSAGE_OWNER} from "../constants/action-types";

const initialState = {
    chats: [],
    messages: [],
    currentChatId: null
};

export default function ownerChatReducer(state = initialState, action) {
    console.log("action.payload")
    console.log(action.payload)

    if (action.type === GET_CHAT_OWNER) {
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
    } else if (action.type === SEND_MESSAGE_OWNER) {
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