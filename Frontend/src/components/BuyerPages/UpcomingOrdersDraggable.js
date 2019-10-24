import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../styles/Navbar.css';
import axios from 'axios';
import BootstrapTable from "react-bootstrap-table-next";
import 'bootstrap/dist/css/bootstrap.min.css';
import {HOSTNMAE} from "../../components/Constants/Constants";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

//axios.defaults.withCredentials = true;

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'white',
    padding: grid,
    width: 250
});

class UpcomingOrdersDraggable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [{
                dataField: 'orderId',
                text: 'Order ID'
            }, {
                dataField: 'customerName',
                text: 'Customer Name'
            }, {
                dataField: 'customerAddress',
                text: 'Customer Address'
            }, {
                dataField: 'items',
                text: 'items',
                formatter: this.itemFormatter.bind(this)
            }, {
                dataField: 'status',
                text: 'status'
            }],
            upcomingOrders: [],
            items: [],
            selected: []
        };

        this.getOrders = this.getOrders.bind(this);
        this.itemFormatter = this.itemFormatter.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        console.log("onDragEnd")
        console.log("result")
        console.log(result  )


        const { source, destination } = result;
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
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                items: result.droppable,
                selected: result.droppable2
            });
        }
    };

    itemFormatter = (cell, row) => {
        return cell.join(" | ")
    };

    getOrderBasedOnStatus(response, status) {
        const ordersByStatus = response.data.filter(order => {
                return (order.status === "New") || (order.status === "Cancel")
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
                <img style={{width: "150px", height: "150px", margin: 0}} src={require("../../images/" + displayOrder.image)}/>
                <h4>Name: {order.customer_address}</h4>
            </div>;

            displayOrders.push(displayOrder);
        });

        return displayOrders;
    }

    getOrders() {
        console.log("Inside UpcomingOrdersDraggable");

        const payload = {};
        payload.userId = localStorage.getItem('_id');

        axios.post(`http://${HOSTNMAE}:3001/orders/getByBuyer`, payload)
            .then((response) => {
                // console.log("response")
                // console.log(response)

                const array = this.getOrderBasedOnStatus(response, "New");

                let halfWayThough = Math.ceil(array.length / 2)

                let arrayFirstHalf = array.slice(0, halfWayThough);
                let arraySecondHalf = array.slice(halfWayThough, array.length);

                this.setState({
                    items: arrayFirstHalf, selected: arraySecondHalf
                });
            });
    }

    componentWillMount() {
        if (localStorage.getItem('userType') !== null) {
            this.getOrders();
        }
    }

    render() {
        const redirectVar = (localStorage.getItem('userType') === null) ? <Redirect to="/home"/> : null;

        return (
            <div>
                <div className='rowC'>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    {this.state.items.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                    {item.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <Droppable droppableId="droppable2">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    {this.state.selected.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                    {item.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        )
    }
}

export default UpcomingOrdersDraggable;