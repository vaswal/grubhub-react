import {CHANGE_ORDER_STATUS, GET_ORDERS_OF_ALL_STATUS, SIGN_UP} from "../constants/action-types";

const initialState = {
    newOrders: [],
    preparingOrders: [],
    readyOrders: [],
    deliveredOrders: [],
    canceledOrders: []
};

const getOrderBasedOnStatus = (response, status) => {

    const ordersByStatus = response.filter(order => {
            return (order.status === status)
        }
    );

    const displayOrders = [];

    ordersByStatus.forEach(function (order) {
        const displayOrder = {};
        const items = JSON.parse(order.items);

        displayOrder["status"] = status;
        displayOrder["orderId"] = order._id;
        displayOrder["customerName"] = order.customer_name;
        displayOrder["customerAddress"] = order.customer_address;
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
    console.log("action.payload")
    console.log(action.payload)

    if (action.type === GET_ORDERS_OF_ALL_STATUS) {
        return Object.assign({}, state, {
            newOrders: getOrderBasedOnStatus(action.payload, "New"),
            preparingOrders: getOrderBasedOnStatus(action.payload, "Preparing"),
            readyOrders: getOrderBasedOnStatus(action.payload, "Ready"),
            deliveredOrders: getOrderBasedOnStatus(action.payload, "Delivered"),
            canceledOrders: getOrderBasedOnStatus(action.payload, "Cancel")
        });
    } else if (action.type === CHANGE_ORDER_STATUS) {
        return Object.assign({}, state, {});
    }

    return state;
}