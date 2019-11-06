import React from 'react';
import {
    ADD_SECTION_NO_SAVE,
    CHANGE_ORDER_STATUS,
    DELETE_SECTION,
    GET_MENU_ITEMS_OWNER,
    GET_ORDERS_OF_ALL_STATUS_OWNER,
    HANDLE_CONTENT_CHANGE,
    SAVE_SECTION,
    SET_EDIT_MODE
} from "../constants/action-types";
import {HOSTNAME} from "../../components/Constants/Constants";
import Popup from "reactjs-popup";
import axios from 'axios';

axios.defaults.withCredentials = true;

export function getOrders(payload) {
    console.log("getOrders")
    console.log("payload")
    console.log(payload)

    return (dispatch) => {
        console.log("Making rest call")
        axios.post(`http://${HOSTNAME}:3001/orders/getByOwner`, payload)
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
        axios.post(`http://${HOSTNAME}:3001/orders/section/delete`, payload)
            .then((response) => dispatch(deleteSectionUpdate(response.data)))
    }
}

const deleteSectionUpdate = (returnedData) => {
    return {type: DELETE_SECTION, payload: returnedData}
}

export function addSection(payload) {
    console.log("addSection")
    console.log("payload")
    console.log(payload)

    return (dispatch) => {
        dispatch(addSectionUpdate(payload))
    }
}

const addSectionUpdate = (returnedData) => {
    return {type: ADD_SECTION_NO_SAVE, payload: returnedData}
}

export function setEditMode(payload) {
    console.log(payload)

    return (dispatch) => {
        dispatch(setEditModeUpdate(payload))
    }
}

const setEditModeUpdate = (returnedData) => {
    return {type: SET_EDIT_MODE, payload: returnedData}
}

export function handleContentChange(payload) {
    console.log(payload)

    return (dispatch) => {
        dispatch(handleContentChangeUpdate(payload))
    }
}

const handleContentChangeUpdate = (returnedData) => {
    return {type: HANDLE_CONTENT_CHANGE, payload: returnedData}
}

export function saveSection(payload) {
    console.log("saveSection")
    console.log("payload")
    console.log(payload)

    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:3001/orders/section/add`, payload)
            .then((response) => dispatch(saveSectionUpdate(response.data)))
    }
}

const saveSectionUpdate = (returnedData) => {
    return {type: SAVE_SECTION, payload: returnedData}
}

export function getMenuItems(payload) {
    console.log("getMenuItems payload")
    console.log(payload)

    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:3001/orders/menu_item/get`, payload)
            .then((response) => dispatch(getMenuItemsUpdate(response.data)));
    }
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

    const updatedTabs = tabSkeleton;

    const payload = {};
    payload.allSections = sectionSet;
    payload.allItems = returnedData;


    for (const section of sectionSet) {
        const index = tabSkeleton.findIndex(obj => obj.name === section);

        const items = returnedData.filter(item => {
                return (item.section === section)
            }
        );

        console.log("items");
        console.log(items);

        updatedTabs[index].content = <div>
            <div>
                <Popup closeOnDocumentClick
                       onOpen={console.log("Opening")}
                       onClose={console.log("Closing")}
                       trigger={open => (
                           <button className="button" type="submit"
                                   onClick={this.addItemTriggerButton()}>Add item</button>
                       )}
                       position="right center">
                    <div>
                        <form className="form" onSubmit={this.addMenuItem}>
                            <div className="x-div">
                                <div className='rowC'>
                                    <label>Name</label>
                                    <div><input type="input" name="name" required/></div>
                                </div>

                                <div className='rowC'>
                                    <label>Description</label>
                                    <div><input type="input" name="description" required/></div>
                                </div>

                                <div className='rowC'>
                                    <label>Price</label>
                                    <div><input type="input" name="price" required/></div>
                                </div>

                                <div className='rowC'>
                                    <label>Image</label>
                                    <input type="file" onChange={this._handleImageChange}/>
                                </div>
                            </div>


                            <div>
                                <button type="submit">Add</button>
                            </div>

                            <div className='rowC'>
                                <br/>
                                <br/>
                                <br/>

                            </div>
                        </form>
                    </div>
                </Popup>
            </div>
            <div>{this.createItems(items)}</div>
        </div>;
        //this.setState({tabs: updatedTabs, currentTab: updatedTabs[index]});

        payload.currentTab = tabSkeleton[index];
    }
    payload.tabs = updatedTabs;

    // payload.tabs = updatedTabs;
    // payload.currentTab = tabSkeleton[0];

    return {type: GET_MENU_ITEMS_OWNER, payload: payload}
}


export function changeOrderStatus(payload) {
    console.log("changeOrderStatus")
    console.log("payload")
    console.log(payload)

    const mongoPayload = {}
    mongoPayload._id = payload._id;
    mongoPayload.status = payload.newStatus;
    mongoPayload.owner_id = payload.owner_id;

    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:3001/orders/order/update`, mongoPayload)
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