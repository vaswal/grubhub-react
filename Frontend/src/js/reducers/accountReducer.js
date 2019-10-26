import {SIGN_IN, SIGN_UP} from "../constants/action-types";

const initialState = {
    signupSuccess: null,
    signupMessage: null,
    signinSuccess: null,
    signinMessage: null,
    userType: null,
    token: null,
    userId: null
};

export default function accountReducer(state = initialState, action) {
    console.log("action.payload")
    console.log(action.payload)

    if (action.type === SIGN_IN) {
        return Object.assign({}, state, {
            signinSuccess: action.payload.signinSuccess,
            signinMessage: action.payload.signinMessage,
            userType: action.payload.user.userType,
            userId: action.payload._id
        });
    } else if (action.type === SIGN_UP) {
        return Object.assign({}, state, {
            signupSuccess: action.payload.signupSuccess,
            signupMessage: action.payload.signupMessage,
            token: action.payload.token,
            userId: action.payload._id
        });
    }

    return state;
}