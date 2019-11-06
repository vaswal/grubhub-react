import {GET_PROFILE_BUYER, UPDATE_PROFILE_BUYER} from "../constants/action-types";
import axios from 'axios';
import {HOSTNAME} from "../../components/Constants/Constants";

export function getProfileImageAction(payload) {
    console.log("Dispatching getProfileImageAction");
    console.log("payload: " + payload);

    //Commented for now
    // return (dispatch) => {
    //     console.log("Inside getProfileImageAction dispatch");
    //     axios.defaults.withCredentials = true;
    //     axios.post('http://localhost:3001/profile/update', payload)
    //         .then((response) => {
    //             console.log("response.data");
    //             console.log(response.data);
    //             dispatch(updateProfileUpdate(response.data))
    //         });
    // }
}

export function updateProfileAction(payload) {
    console.log("Dispatching updateProfileAction");
    console.log("payload: " + payload);

    return (dispatch) => {
        console.log("Inside getProfileAction dispatch");
        //axios.defaults.withCredentials = true;
        axios.post(`http://${HOSTNAME}:3001/profile/update`, payload)
            .then((response) => {
                console.log("response.data");
                console.log(response.data);
                dispatch(updateProfileUpdate(response.data))
            });
    }
}

export function getProfileAction(payload) {
    console.log("Dispatching getProfileAction");
    console.log("payload: " + payload);

    return (dispatch) => {
        console.log("Inside getProfileAction dispatch");
        //axios.defaults.withCredentials = true;
        axios.post(`http://${HOSTNAME}:3001/profile/get`, payload)
            .then((response) => {
                console.log("response.data");
                console.log(response.data[0]);
                dispatch(getProfileUpdate(response.data[0]))
            });
    }
}

export const getProfileUpdate = (returnData) => {
    //console.log("Inside signupUpdate: " + returnData)
    return {type: GET_PROFILE_BUYER, payload: returnData}
};

export const updateProfileUpdate = (returnData) => {
    //console.log("Inside signupUpdate: " + returnData)
    return {type: UPDATE_PROFILE_BUYER, payload: returnData}
};