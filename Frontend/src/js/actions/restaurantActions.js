import {PLACE_ORDER, PLACE_ORDER_ERROR, GET_MENU_ITEMS, ON_CLICK_SECTION, PAGE_CHANGED} from "../constants/action-types";
import {HOSTNMAE} from "../../components/Constants/Constants";
import axios from 'axios';

axios.defaults.withCredentials = true;

//axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export function placeOrder(payload) {
    console.log("placeOrder payload")
    console.log(payload)

    return (dispatch) => {
        console.log("Inside placeOrder");

        axios.post(`http://${HOSTNMAE}:3001/orders/order/add`, payload)
            .then((response) => dispatch(placeOrderUpdate(response.data)))
            .catch((error) => dispatch(placeOrderError(error)));
    }
}

export function getMenuItems(payload) {
    console.log("getMenuItems payload")
    console.log(payload)

    return (dispatch) => {
        axios.post(`http://${HOSTNMAE}:3001/orders/menu_item/get`, payload)
            .then((response) => dispatch(getMenuItemsUpdate(response.data)));
    }
}

export function onClickSection(payload) {
    console.log("onClickSectionUpdate payload");
    console.log(payload);

    return (dispatch) => {
        dispatch(onClickSectionUpdate(payload));
    }
}

export function pageChanged(payload) {
    console.log("pageChanged payload");
    console.log(payload);

    return (dispatch) => {
        dispatch(pageChangedUpdate(payload));
    }
}

const pageChangedUpdate = (returnedData) => {




    return {type: PAGE_CHANGED, payload: returnedData}
}

const onClickSectionUpdate = (returnedData) => {
    console.log("onClickSectionUpdate");
    console.log(returnedData);

    const payload = {};
    payload.index = returnedData.index;


    return {type: ON_CLICK_SECTION, payload: payload}
}

const getMenuItemsUpdate = (returnedData) => {
    console.log("getMenuItemsUpdate");
    console.log(returnedData);

    //const set = new Set();
    const sectionSet = new Set(returnedData.map(menu_item => menu_item.section));

    console.log("sectionSet");
    console.log(sectionSet);

    const tabSkeleton = [];
    let count = 1;
    for (const section of sectionSet) {
        tabSkeleton.push({id: count, name: section, content: null, numberOfItems: 0});
        count = count + 1;
    }

    for (const section of sectionSet) {
        const index = tabSkeleton.findIndex(obj => obj.name === section);
        const items = returnedData.filter(item => {
                return (item.section === section)
            }
        );

        console.log("items");
        console.log(items);

        tabSkeleton[index].numberOfItems = items.length;

        //To do
        //this.setState({tabs: updatedTabs, currentTab: updatedTabs[index]}, () => {this.createPages()});
    }

    const payload = {};
    payload.allSections = sectionSet;
    payload.allItems = returnedData;
    payload.tabs = tabSkeleton;
    payload.currentTab = tabSkeleton[0];

    return {type: GET_MENU_ITEMS, payload: payload}
}

const placeOrderUpdate = (returnedData) => {
    console.log("placeOrderUpdate");
    console.log(returnedData);

    //this.setState({cartItems: [], orderSuccess: true});
    //this.getMenuItems();

    return {type: PLACE_ORDER, payload: returnedData}
};

const placeOrderError = (response) => {
    console.log("placeOrder");
    console.log(response);
    // this.setState({cartItems: [], orderSuccess: true});
    // this.getMenuItems();
    //
    // this.setState({updateItemSuccess: false});

    return {type: PLACE_ORDER_ERROR, payload: {
            placeOrderSuccess: false,
            placeOrderMessage: "Error in placing order"
        }}
};