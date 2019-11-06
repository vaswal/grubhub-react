import {SIGN_IN, SIGN_IN_BUYER, SIGN_UP, SIGN_UP_BUYER, SIGN_UP_OWNER} from "../constants/action-types";
import {HOSTNAME} from "../../components/Constants/Constants";
import axios from 'axios';

axios.defaults.withCredentials = true;

//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export function signInMongo(payload) {
    console.log("signInMongo payload")
    console.log(payload)

    return (dispatch) => {
        console.log("Inside signInMongo");

        axios.post(`http://${HOSTNAME}:3001/access/loginkafka`, payload)
            .then((response) => dispatch(signIn(response.data)));

        // axios.post(`http://${HOSTNMAE}:3001/access/loginpassport`, payload)
        //     .then((response) => dispatch(signIn(response.data)))
    }
}

export function signUpMongo(payload) {
    console.log("signUpMongo payload")
    console.log(payload)

    return (dispatch) => {
        console.log("Inside  signUpMongo");

        axios.post(`http://${HOSTNAME}:3001/access/savemongo`, payload)
            .then((response) => dispatch(signUp(response.data)))
    }
}

export const signIn = (returnData) => {
    console.log("Inside signIn dispatch")
    console.log(returnData)
    localStorage.setItem('token', returnData.user.token);
    localStorage.setItem('_id', returnData.user._id);
    localStorage.setItem('userType', returnData.user.userType);
    return {type: SIGN_IN, payload: returnData}
};

export const signUp = (returnData) => {
    console.log("Inside signUp dispatch")
    console.log(returnData)
    localStorage.setItem('token', returnData.token);
    localStorage.setItem('_id', returnData._id);
    localStorage.setItem('userType', returnData.userType);
    return {type: SIGN_UP, payload: returnData}
};

export function signUpOwnerAction(payload) {
    console.log("Dispatching the action");
    console.log("payload: " + payload);

    return (dispatch) => {
        console.log("Inside signUpOwnerAction dispatch");
        axios.post(`http://${HOSTNAME}:3001/access/createOwner`, payload)
            .then((response) => dispatch(signUpOwnerUpdate(response.data)))
    }
}

export function signInBuyerAction(payload) {
    console.log("Dispatching the action");
    console.log("payload: " + payload);

    return (dispatch) => {
        console.log("Inside signInBuyerAction dispatch");

        axios.post(`http://${HOSTNAME}:3001/access/loginpassport`, payload)
            .then((response) => dispatch(signInUpdate(response.data)))
    }
}

export function signUpBuyerAction(payload) {
    console.log("Dispatching the action");
    console.log("payload: ");
    console.log(payload);

    return (dispatch) => {
        console.log("Inside signUpBuyerAction dispatch");
        // axios.post(`http://${HOSTNMAE}:3001/access/create`, payload)
        //     .then((response) => dispatch(signUpUpdate(response.data)))

        axios.post(`http://${HOSTNAME}:3001/access/save`, payload)
            .then((response) => dispatch(signUpUpdate(response.data)))
    }
}

export const signInUpdate = (returnData) => {
    console.log("returnData");
    console.log(returnData);
    localStorage.setItem('userId', returnData.userId);
    localStorage.setItem('userType', returnData.userType);
    //console.log("Inside signupUpdate: " + returnData)
    return {type: SIGN_IN_BUYER, payload: returnData}
};

export const signInError = () => {
    return {
        type: SIGN_IN_BUYER, payload: {
            signinSuccess: false,
            signinMessage: "Network error"
        }
    }
};

export const signUpUpdate = (returnData) => {
    //console.log("Inside signupUpdate: " + returnData)
    return {type: SIGN_UP_BUYER, payload: returnData}
};

export const signUpOwnerUpdate = (returnData) => {
    //console.log("Inside signupUpdate: " + returnData)
    return {type: SIGN_UP_OWNER, payload: returnData}
};





