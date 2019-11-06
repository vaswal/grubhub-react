import React from 'react';
import {Badge, Button, Card, Pagination} from "react-bootstrap";
import {
    FILTER_RESTAURANTS,
    GET_MENU_ITEMS,
    GET_ORDERS_BY_STATUS,
    GET_ORDERS_OF_ALL_STATUS,
    ON_CLICK_SECTION,
    ON_DRAG_END,
    PAGE_CHANGED,
    PLACE_ORDER,
    PLACE_ORDER_ERROR,
    SEARCH_ITEM,
    CREATE_PAGES_SEARCH, PAGE_CHANGED_SEARCH
} from "../constants/action-types";
import Checkbox from "../../components/BuyerPages/Checkbox";

const initialState = {
    placeOrderSuccess: null,
    placeOrderMessage: null,
    allSections: [],
    allItems: [],
    tabs: [],
    currentTab: {},
    pageItems: [],
    pageItemsSearch: [],
    todosPerPage: 3,
    active: 1,
    restaurants: [],
    filteredRestaurants: [],
    restaurantDivs: [],
    allCuisines: [],
    items: [],
    selected: [],
    allOrders: []

};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const getOrderStatusBadge = (status) => {
    let badge = null;

    switch (status) {
        case "New":
            badge = <Badge style={{fontSize: 10}} variant="primary">New</Badge>
            break;

        case "Preparing":
            badge = <Badge style={{fontSize: 10}} variant="info">Preparing</Badge>
            break;

        case "Ready":
            badge = <Badge style={{fontSize: 10}} variant="dark">Ready</Badge>
            break;

        case "Delivered":
            badge = <Badge style={{fontSize: 10}} variant="success">Delivered</Badge>
            break;

        case "Cancel":
            badge = <Badge style={{fontSize: 10}} variant="danger">Cancel</Badge>
            break;
    }

    return badge;
}

const getOrderBasedOnStatus = (data, statusSet) => {
    console.log("getOrderBasedOnStatus")
    console.log(data);

    const ordersByStatus = data.filter(order => {
            return (statusSet.has(order.status))
        }
    );

    const displayOrders = [];

    ordersByStatus.forEach(function (order) {
        const displayOrder = {};
        const items = JSON.parse(order.items);

        displayOrder["status"] = order.status;
        displayOrder["id"] = order._id;
        displayOrder["orderId"] = order._id;
        displayOrder["customerName"] = order.customer_name;
        displayOrder["customerAddress"] = order.customer_address;
        displayOrder["items"] = [];
        displayOrder["image"] = "restaurant-logo.png";

        items.items.forEach(function (item) {
            const line = `Name: ${item.name} Quantity: ${item.quantity} Price: ${item.price}`;
            displayOrder.items.push(line);
        });

        displayOrder["content"] = <div>
            <img style={{width: "150px", height: "150px", margin: 0}}
                 src={require("../../images/" + displayOrder.image)}/>
            <h4>Name: {order.customer_name}</h4>
            <b>Order Status</b> - {getOrderStatusBadge(order.status)}
            <h4>OrderId: {order._id}</h4>
            <h4>Name: {order.items}</h4>
        </div>;

        displayOrders.push(displayOrder);
    });

    return displayOrders;
}



const createPages = (state, currentTab, activePage) => {
    const newItems = [];
    //const currentTab = state.tabs[action.payload.index];
    const numberOfItems = currentTab.numberOfItems;
    const todosPerPage = state.todosPerPage;

    const numberOfPages = ((numberOfItems % todosPerPage) === 0) ? numberOfItems / todosPerPage : ((numberOfItems / todosPerPage) + 1)

    console.log("numberOfPages")
    console.log(numberOfPages)

    for (let number = 1; number <= numberOfPages; number++) {
        //for (let number = 1; number <= 5; number++) {
        newItems.push(
            <Pagination.Item key={number} active={number === activePage}>
                {number}
            </Pagination.Item>,
        );
    }

    return newItems;
}

export default function restaurantReducer(state = initialState, action) {
    console.log("action.payload")
    console.log(action.payload)

    if (action.type === PLACE_ORDER) {
        console.log("restaurantReducer PLACE_ORDER")
        console.log("action.payload.placeOrderSuccess")
        console.log(action.payload.placeOrderSuccess)

        //this.setState({cartItems: [], orderSuccess: true});
        //this.getMenuItems();
        return Object.assign({}, state, {
            placeOrderSuccess: action.payload.placeOrderSuccess,
            placeOrderMessage: action.payload.placeOrderMessage
        });
    } else if (action.type === PLACE_ORDER_ERROR) {
        return Object.assign({}, state, {
            placeOrderSuccess: action.payload.signupSuccess,
            placeOrderMessage: action.payload.signupMessage
        });
    } else if (action.type === GET_MENU_ITEMS) {
        const newItems = createPages(state, action.payload.currentTab, 1);

        return Object.assign({}, state, {
            allSections: action.payload.allSections,
            allItems: action.payload.allItems,
            tabs: action.payload.tabs,
            currentTab: action.payload.currentTab,
            pageItems: newItems
        });
    } else if (action.type === ON_CLICK_SECTION) {
        //this.setState({currentTab: this.props.tabs[index]}, () => {this.createPages()});

        console.log("ON_CLICK_SECTION")
        console.log("state")
        console.log(state)
        console.log("action.payload.index")
        console.log(action.payload.index)

        console.log("state.tabs[action.payload.index]")
        console.log(state.tabs[action.payload.index])

        const newItems = createPages(state, state.tabs[action.payload.index], state.active);

        console.log("newItems")
        console.log(newItems)

        return Object.assign({}, state, {
            currentTab: state.tabs[action.payload.index],
            pageItems: newItems
        });
    } else if (action.type === PAGE_CHANGED) {
        console.log("PAGE_CHANGED action.payload.index")
        console.log(action.payload.pageNumber)

        console.log("PAGE_CHANGED state.tabs[action.payload.index]")
        console.log(state.tabs[action.payload.pageNumber])

        const newItems = createPages(state, state.currentTab, action.payload.pageNumber);

        return Object.assign({}, state, {
            active: action.payload.pageNumber,
            pageItems: newItems
        });
        //this.createPages();
    } else if (action.type === SEARCH_ITEM) {
        const allCuisinesLocal = [...new Set(action.payload.map(({cuisine}) => cuisine))];

        return Object.assign({}, state, {
            restaurants: action.payload,
            filteredRestaurants: action.payload,
            allCuisines: allCuisinesLocal,
        });
    } else if (action.type === FILTER_RESTAURANTS) {
        return Object.assign({}, state, {
            filteredRestaurants: action.payload
        });
    }  else if (action.type === CREATE_PAGES_SEARCH) {
        const numOfFilteredRestaurants = action.payload.numOfFilteredRestaurants;
        const activePage = action.payload.activePage
        console.log("CREATE_PAGES_SEARCH numOfFilteredRestaurants: " + numOfFilteredRestaurants)
        const newItems = [];
        //const currentTab = state.tabs[action.payload.index];
        const numberOfItems = numOfFilteredRestaurants;
        const todosPerPage = state.todosPerPage;

        const numberOfPages = ((numberOfItems % todosPerPage) === 0) ? numberOfItems / todosPerPage : ((numberOfItems / todosPerPage) + 1)

        console.log("numberOfPages")
        console.log(numberOfPages)

        for (let number = 1; number <= numberOfPages; number++) {
            //for (let number = 1; number <= 5; number++) {
            newItems.push(
                <Pagination.Item key={number} active={number === activePage}>
                    {number}
                </Pagination.Item>,
            );
        }

        return Object.assign({}, state, {
            pageItemsSearch: newItems
        });

    }  else if (action.type === PAGE_CHANGED_SEARCH) {
        const numOfFilteredRestaurants = state.filteredRestaurants.length;
        const activePage = action.payload.activePage
        console.log("PAGE_CHANGED_SEARCH numOfFilteredRestaurants: " + numOfFilteredRestaurants)
        const newItems = [];
        //const currentTab = state.tabs[action.payload.index];
        const numberOfItems = numOfFilteredRestaurants;
        const todosPerPage = state.todosPerPage;

        const numberOfPages = ((numberOfItems % todosPerPage) === 0) ? numberOfItems / todosPerPage : ((numberOfItems / todosPerPage) + 1)

        console.log("numberOfPages")
        console.log(numberOfPages)

        for (let number = 1; number <= numberOfPages; number++) {
            //for (let number = 1; number <= 5; number++) {
            newItems.push(
                <Pagination.Item key={number} active={number === activePage}>
                    {number}
                </Pagination.Item>,
            );
        }

        return Object.assign({}, state, {
            activePage: activePage,
            pageItemsSearch: newItems
        });
    } else if (action.type === GET_ORDERS_BY_STATUS) {
        if ("Upcoming" === action.payload.statusCode) {
            const filteredOrders = getOrderBasedOnStatus(action.payload.data, action.payload.statusSet);
            let halfWayThough = Math.ceil(filteredOrders.length / 2)

            const arrayFirstHalf = filteredOrders.slice(0, halfWayThough);
            const arraySecondHalf = filteredOrders.slice(halfWayThough, filteredOrders.length);

            return Object.assign({}, state, {
                items: arrayFirstHalf,
                selected: arraySecondHalf
            });
        } else if ("All" === action.payload.statusCode) {
            return Object.assign({}, state, {
                allOrders: action.payload.data
            });
        }
    } else if (action.type === GET_ORDERS_OF_ALL_STATUS) {


    } else if (action.type === ON_DRAG_END) {
        const id2List = {
            droppable: 'items',
            droppable2: 'selected'
        };

        const getList = id => state[id2List[id]];


        console.log("onDragEnd")
        console.log("result")
        console.log(action.payload)

        const {source, destination} = action.payload;
        console.log("source")
        console.log(source)
        console.log("destination")
        console.log(destination)

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = {items};

            if (source.droppableId === 'droppable2') {
                state = {selected: items};
            }

            console.log("Intra list movement")
            console.log("state")
            console.log(state)
            console.log("this.getList(source.droppableId")
            console.log(getList(source.droppableId))

            //this.setState(state);

            return Object.assign({}, state, {
                items: state
            });

        } else {
            console.log("(source.droppableId)")
            console.log(source.droppableId)

            console.log("this.getList(source.droppableId)")
            console.log(getList(source.droppableId))

            console.log("this.getList(\"droppable\")")
            console.log(getList("droppable"))

            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );

            return Object.assign({}, state, {
                items: result.droppable,
                selected: result.droppable2
            });
        }
    }

    return state;
}