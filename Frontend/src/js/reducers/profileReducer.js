import {GET_PROFILE_BUYER, UPDATE_PROFILE_BUYER} from "../constants/action-types";

const initialState = {
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    restaurantName: "",
    cuisine: "",
    imagePreviewUrl: "",
    updateSuccess: null,
    updateMessage: null
};

export default function profileReducer(state = initialState, action) {
    if (action.type === GET_PROFILE_BUYER) {
        console.log("profileReducer SIGN_IN_BUYER");
        console.log("action.payload");
        console.log(action.payload);

        return Object.assign({}, state, {
            userId: action.payload.id,
            firstName: action.payload.firstname,
            lastName: action.payload.lastname,
            email: action.payload.email,
            phoneNumber: action.payload.phonenumber,
            restaurantName: action.payload.restaurantname,
            cuisine: action.payload.cuisine
        });
    } else if (action.type === UPDATE_PROFILE_BUYER) {
        console.log("profileReducer UPDATE_PROFILE_BUYER");
        console.log("action.payload");
        console.log(action.payload);

        return Object.assign({}, state, {
            updateSuccess: action.payload.updateSuccess,
            updateMessage: action.payload.updateMessage
        });
    }

    return state;
}