import {CHANGE_ORDER_STATUS, GET_ORDERS_OF_ALL_STATUS_OWNER, DELETE_SECTION} from "../constants/action-types";
import {HOSTNMAE} from "../../components/Constants/Constants";
import axios from 'axios';

axios.defaults.withCredentials = true;

//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export function getOrders(payload) {
    console.log("getOrders")
    console.log("payload")
    console.log(payload)

    return (dispatch) => {
        console.log("Making rest call")
        axios.post(`http://${HOSTNMAE}:3001/orders/getByOwnerMongo`, payload)
            .then((response) => dispatch(getOrdersUpdate(response.data)))
    }
}

const getOrdersUpdate = (returnedData) => {
    return {type: GET_ORDERS_OF_ALL_STATUS_OWNER, payload: returnedData}
}

export function deleteSection(payload) {
    console.log("deleteSection")
    console.log("payload")
    console.log(payload)

    return (dispatch) => {
        axios.post(`http://${HOSTNMAE}:3001/orders/section/delete`, payload)
            .then((response) => dispatch(deleteSectionUpdate(response.data)))
    }
}

const deleteSectionUpdate = (returnedData) => {
    return {type: DELETE_SECTION, payload: returnedData}
}

export function addSection(payload) {
    console.log("deleteSection")
    console.log("payload")
    console.log(payload)

    return (dispatch) => {
        axios.post(`http://${HOSTNMAE}:3001/orders/section/add`, payload)
            .then((response) => dispatch(addSectionUpdate(response.data)))
    }
}

const addSectionUpdate = (returnedData) => {
    return {type: DELETE_SECTION, payload: returnedData}
}

export function changeOrderStatus(payload) {
    console.log("changeOrderStatus")
    console.log("payload")
    console.log(payload)

    const mongoPayload = {}
    mongoPayload._id = payload._id;
    mongoPayload.status = payload.newStatus;

    return (dispatch) => {
        axios.post(`http://${HOSTNMAE}:3001/orders/order/update`, mongoPayload)
            .then((response) => dispatch(changeOrderStatusUpdate(response.data)))
    }
}

const changeOrderStatusUpdate = (returnedData) => {
    const payload = {};
    payload.userId = localStorage.getItem('_id');
    payload.special = "special";

    getOrders(payload);

    return {type: CHANGE_ORDER_STATUS, payload: returnedData}
}