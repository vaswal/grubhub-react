import {PLACE_ORDER, PLACE_ORDER_ERROR, GET_MENU_ITEMS, ON_CLICK_SECTION, PAGE_CHANGED, SEARCH_ITEM, FILTER_RESTAURANTS,
    GET_ORDERS_BY_STATUS, GET_ORDERS_OF_ALL_STATUS, CHANGE_ORDER_STATUS} from "../constants/action-types";
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
    return {type: GET_ORDERS_OF_ALL_STATUS, payload: returnedData}
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