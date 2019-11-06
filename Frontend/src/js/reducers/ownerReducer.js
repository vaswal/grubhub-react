import {
    ADD_SECTION_NO_SAVE,
    CHANGE_ORDER_STATUS,
    GET_MENU_ITEMS_OWNER,
    GET_ORDERS_OF_ALL_STATUS_OWNER,
    HANDLE_CONTENT_CHANGE,
    SAVE_SECTION,
    SET_EDIT_MODE
} from "../constants/action-types";

const initialState = {
    tabs: [],
    currentTab: {},
    editMode: false,
    editTabNameMode: false,
    allItems: [],
    allSections: [],
    newOrders: [],
    preparingOrders: [],
    readyOrders: [],
    deliveredOrders: [],
    canceledOrders: [],
    allOrders: []
};

const getOrderBasedOnStatus = (response, status) => {
    console.log("getOrderBasedOnStatus")
    console.log("response")
    console.log(response)


    const ordersByStatus = response.filter(order => {
        return (order.status === status)
    });

    const displayOrders = [];

    ordersByStatus.forEach(function (order) {
        const displayOrder = {};
        const items = JSON.parse(order.items);

        displayOrder["status"] = status;
        displayOrder["orderId"] = order._id;
        displayOrder["customerName"] = order.customer_name;
        displayOrder["customerAddress"] = order.customer_address;
        displayOrder["owner_id"] = order.owner_id;
        displayOrder["items"] = [];

        items.items.forEach(function (item) {
            const line = `Name: ${item.name} Quantity: ${item.quantity} Price: ${item.price}`;
            displayOrder.items.push(line);
        });

        displayOrders.push(displayOrder);
    });

    return displayOrders;
}


export default function ownerReducer(state = initialState, action) {
    console.log("ownerReducer action.payload")
    console.log(action.payload)

    if (action.type === GET_ORDERS_OF_ALL_STATUS_OWNER) {
        return Object.assign({}, state, {
            allOrders: action.payload,
            newOrders: getOrderBasedOnStatus(action.payload, "New"),
            preparingOrders: getOrderBasedOnStatus(action.payload, "Preparing"),
            readyOrders: getOrderBasedOnStatus(action.payload, "Ready"),
            deliveredOrders: getOrderBasedOnStatus(action.payload, "Delivered"),
            canceledOrders: getOrderBasedOnStatus(action.payload, "Cancel"),

        });
    } else if (action.type === CHANGE_ORDER_STATUS) {
        return Object.assign({}, state, {
            allOrders: action.payload,
            newOrders: getOrderBasedOnStatus(action.payload, "New"),
            preparingOrders: getOrderBasedOnStatus(action.payload, "Preparing"),
            readyOrders: getOrderBasedOnStatus(action.payload, "Ready"),
            deliveredOrders: getOrderBasedOnStatus(action.payload, "Delivered"),
            canceledOrders: getOrderBasedOnStatus(action.payload, "Cancel"),
        });
    } else if (action.type === ADD_SECTION_NO_SAVE) {
        console.log("Inside ADD_SECTION")
        return Object.assign({}, state, {
            tabs: action.payload.tabs,
            currentTab: action.payload.currentTab,
            editMode: action.payload.editMode,
            editTabNameMode: action.payload.editTabNameMode
        });
    } else if (action.type === SET_EDIT_MODE) {
        return Object.assign({}, state, {
            editMode: action.payload.editMode,
        });
    } else if (action.type === HANDLE_CONTENT_CHANGE) {
        return Object.assign({}, state, {
            tabs: action.payload.tabs,
            currentTab: action.payload.currentTab,
        });
    } else if (action.type === SAVE_SECTION) {
        return Object.assign({}, state, {
            editMode: !state.editMode
        })
    } else if (action.type === GET_MENU_ITEMS_OWNER) {
        // const payload = {};
        // payload.allSections = sectionSet;
        // payload.allItems = returnedData;
        // payload.tabs = updatedTabs;
        // payload.currentTab = tabSkeleton[0];


        return Object.assign({}, state, {
            allSections: action.payload.allSections,
            allItems: action.payload.allItems,
            tabs: action.payload.tabs,
            currentTab: action.payload.currentTab,

        })
    }

    return state;
}