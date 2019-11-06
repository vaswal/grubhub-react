import {
    FILTER_RESTAURANTS,
    GET_MENU_ITEMS,
    GET_ORDERS_BY_STATUS,
    ON_CLICK_SECTION,
    ON_DRAG_END,
    PAGE_CHANGED,
    PLACE_ORDER,
    PLACE_ORDER_ERROR,
    SEARCH_ITEM,
    CREATE_PAGES_SEARCH,
    PAGE_CHANGED_SEARCH
} from "../constants/action-types";
import {HOSTNAME} from "../../components/Constants/Constants";
import axios from 'axios';

axios.defaults.withCredentials = true;

export function onDragEnd(payload) {
    return (dispatch) => {
        dispatch(onDragEndUpdate(payload));
    }
};

export function setFilteredRestaurants(payload) {
    return (dispatch) => {
        dispatch(setFilteredRestaurantsUpdate(payload));
    }
}

export function searchItem(payload) {
    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:3001/orders/menu_item/search`, payload)
            .then((response) => dispatch(searchItemUpdate(response.data)))
    }
}


export function getOrdersByStatus(payload) {
    console.log("getOrdersByStatus ");

    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:3001/orders/get/byBuyer`, payload)
            .then((response) => {
                const responseEnriched = payload;
                responseEnriched.data = response.data

                // Object.assign({}, response, payload)
                console.log("responseEnriched")
                console.log(responseEnriched)

                dispatch(getOrdersByStatusUpdate(responseEnriched))
            })
    }
}

const getOrdersByStatusUpdate = (returnedData) => {
    console.log("getOrdersByStatusUpdate");
    console.log(returnedData);

    return {type: GET_ORDERS_BY_STATUS, payload: returnedData}
};

const onDragEndUpdate = (returnedData) => {
    return {type: ON_DRAG_END, payload: returnedData}
}

const searchItemUpdate = (returnedData) => {
    return {type: SEARCH_ITEM, payload: returnedData}
}

const setFilteredRestaurantsUpdate = (returnedData) => {
    return {type: FILTER_RESTAURANTS, payload: returnedData}
}

export function placeOrder(payload) {
    console.log("placeOrder payload")
    console.log(payload)

    return (dispatch) => {
        console.log("Inside placeOrder");

        axios.post(`http://${HOSTNAME}:3001/orders/order/add`, payload)
            .then((response) => dispatch(placeOrderUpdate(response.data)))
            .catch((error) => dispatch(placeOrderError(error)));
    }
}

export function getMenuItems(payload) {
    console.log("getMenuItems payload")
    console.log(payload)

    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:3001/orders/menu_item/get`, payload)
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

export function createPagesSearch(payload) {
    console.log("createPagesSearch payload");
    console.log(payload);

    return (dispatch) => {dispatch(createPagesSearchUpdate(payload));}
}

const createPagesSearchUpdate = (returnedData) => {
    return {type: CREATE_PAGES_SEARCH, payload: returnedData}
}

export function pageChangedSearch(payload) {
    console.log("createPagesSearch payload");
    console.log(payload);

    return (dispatch) => {dispatch(pageChangedSearchUpdate(payload));}
}

const pageChangedSearchUpdate = (returnedData) => {
    return {type: PAGE_CHANGED_SEARCH, payload: returnedData}
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

    return {
        type: PLACE_ORDER_ERROR, payload: {
            placeOrderSuccess: false,
            placeOrderMessage: "Error in placing order"
        }
    }
};