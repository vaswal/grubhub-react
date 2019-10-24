import React, {Component} from 'react';
import {Button, Card, Pagination, ListGroup, ListGroupItem} from "react-bootstrap";
import {PLACE_ORDER, PLACE_ORDER_ERROR, GET_MENU_ITEMS, ON_CLICK_SECTION, PAGE_CHANGED} from "../constants/action-types";

const initialState = {
    placeOrderSuccess: null,
    placeOrderMessage: null,
    allSections: [],
    allItems: [],
    tabs: [],
    currentTab: {},
    pageItems: [],
    todosPerPage: 3,
    active: 1
};

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
    }


    return state;
}