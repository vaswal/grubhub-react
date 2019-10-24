import React, {Component} from 'react';
import {Tab, Tabs} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import '../../styles/Orders.css';
import {HOSTNMAE} from "../../components/Constants/Constants";
import {Redirect} from 'react-router';
import axios from 'axios';

axios.defaults.withCredentials = true;

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 'new',
            basicColumns: [{
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
            newOrders: [],
            preparingOrders: [],
            products: [{
                id: '1',
                name: 'burger',
                price: '12'
            }, {
                id: '2',
                name: 'pasta',
                price: '34'
            }, {
                id: '3',
                name: 'pie',
                price: '56'
            }],
            cell: 11
        };

        this.state.newColumns = [...this.state.basicColumns, {
            dataField: 'action',
            text: 'Action',
            formatter: this.addButtonsForNew.bind(this)
        }];

        this.state.preparingColumns = [...this.state.basicColumns, {
            dataField: 'action',
            text: 'Action',
            formatter: this.addButtonsForPreparing.bind(this)
        }];

        this.state.readyColumns = [...this.state.basicColumns, {
            dataField: 'action',
            text: 'Action',
            formatter: this.addButtonsForReady.bind(this)
        }];

        this.handleSelect = this.handleSelect.bind(this);
        this.addButtonsForNew = this.addButtonsForNew.bind(this);
        this.addButtonsForPreparing = this.addButtonsForPreparing.bind(this);
        this.makeOrderStatusPreparing = this.makeOrderStatusPreparing.bind(this);
        this.makeOrderStatusReady = this.makeOrderStatusReady.bind(this);
        this.makeOrderStatusDelivered = this.makeOrderStatusDelivered.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.getOrders = this.getOrders.bind(this);
    }

    changeOrder(orderId, status) {
        const payload = {};
        payload.queryName = "UPDATE_ORDER_STATUS";
        payload.arguments = [status, orderId];

        axios.post(`http://${HOSTNMAE}:3001/orders/update`, payload)
            .then((response) => {
                console.log("response");
                console.log(response);
                const payload = {};
                payload.queryName = "GET_GRUBHUB_ORDERS_BY_OWNER";
                payload.arguments = [localStorage.getItem('userId')];

                this.getOrders(payload);
            });
    }

    makeOrderStatusPreparing(cell) {
        console.log("Inside makeOrderStatusPreparing");
        this.changeOrder(cell.orderId, "Preparing");
    }

    makeOrderStatusReady(cell) {
        console.log("Inside makeOrderStatusPreparing");
        this.changeOrder(cell.orderId, "Ready");
    }

    makeOrderStatusDelivered(cell) {
        console.log("Inside makeOrderStatusPreparing");
        this.changeOrder(cell.orderId, "Delivered");
    }

    cancelOrder(cell) {
        console.log("Inside canelOrder");
        this.changeOrder(cell.orderId, "Cancel");
    }

    handleSelect(key) {
        console.log('selected' + key);
        this.setState({key: key});
    }

    newOrdersTable() {
        console.log("Inside new orders");
        return (
            <BootstrapTable keyField='id'
                            data={this.state.newOrders}
                            columns={this.state.newColumns}
            />
        );
    }

    preparingOrdersTable() {
        console.log("Inside preparingOrdersTable");
        return (
            <BootstrapTable keyField='id'
                            data={this.state.preparingOrders}
                            columns={this.state.preparingColumns}
            />
        );
    }

    readyOrdersTable() {
        console.log("Inside new orders");
        return (
            <BootstrapTable keyField='id'
                            data={this.state.readyOrders}
                            columns={this.state.readyColumns}
            />
        );
    }

    deliveredOrdersTable() {
        console.log("Inside new orders");
        return (
            <BootstrapTable keyField='id'
                            data={this.state.deliveredOrders}
                            columns={this.state.basicColumns}
            />
        );
    }

    addButtonsForNew = (cell, row) => {
        return (
            <div>
                <button type="button" className="btn btn-outline-primary btn-sm ts-buttom" size="sm"
                        onClick={this.makeOrderStatusPreparing.bind(cell, row)}>
                    Mark Preparing
                </button>
                <button type="button" className="btn btn-outline-primary btn-sm ts-buttom" size="sm"
                        onClick={this.cancelOrder.bind(cell, row)}>
                    Cancel
                </button>
            </div>
        );
    };

    addButtonsForPreparing = (cell, row) => {
        return (
            <div>
                <button type="button" className="btn btn-outline-primary btn-sm ts-buttom" size="sm"
                        onClick={this.makeOrderStatusReady.bind(cell, row)}>
                    Mark Ready
                </button>
                <button type="button" className="btn btn-outline-primary btn-sm ts-buttom" size="sm"
                        onClick={this.cancelOrder.bind(cell, row)}>
                    Cancel
                </button>
            </div>
        );
    };

    addButtonsForReady = (cell, row) => {
        return (
            <div>
                <button type="button" className="btn btn-outline-primary btn-sm ts-buttom" size="sm"
                        onClick={this.makeOrderStatusDelivered.bind(cell, row)}>
                    Mark Delivered
                </button>
                <button type="button" className="btn btn-outline-primary btn-sm ts-buttom" size="sm"
                        onClick={this.cancelOrder.bind(cell, row)}>
                    Cancel
                </button>
            </div>
        );
    };

    itemFormatter = (cell, row) => {
        return cell.join(" | ")
    };

    getOrderBasedOnStatus(response, status) {
        const ordersByStatus = response.data.filter(order => {
                return (order.status === status)
            }
        );

        const displayOrders = [];

        ordersByStatus.forEach(function (order) {
            const displayOrder = {};
            const items = JSON.parse(order.items);

            displayOrder["status"] = status;
            displayOrder["orderId"] = order.grubhub_order_id;
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

    getOrders(payload) {
        console.log("Inside signInBuyerAction dispatch");
        axios.post(`http://${HOSTNMAE}:3001/orders/getByOwnerMongo`, payload)
        //axios.post(`http://${HOSTNMAE}:3001/orders/getByOwner`, payload)
            .then((response) => {
                this.setState({
                    newOrders: this.getOrderBasedOnStatus(response, "New"),
                    preparingOrders: this.getOrderBasedOnStatus(response, "Preparing"),
                    readyOrders: this.getOrderBasedOnStatus(response, "Ready"),
                    deliveredOrders: this.getOrderBasedOnStatus(response, "Delivered")
                });
            });
    }

    componentDidMount() {
        if (localStorage.getItem('userType') !== null) {
            const payload = {};
            payload.userId = localStorage.getItem('_id');

            this.getOrders(payload);
        }
    }

    render() {
        const redirectVar = (localStorage.getItem('userType') === null) ? <Redirect to="/home"/> : null;

        return (
            <div>
                {/*{redirectVar}*/}
                <Tabs id="controlled-tab-example" activeKey={this.state.key} onSelect={this.handleSelect}>
                    <Tab className="tabs-style" eventKey="new" title="New">New</Tab>
                    <Tab className="tabs-style" eventKey="preparing" title="Preparing">Preparing</Tab>
                    <Tab className="tabs-style" eventKey="ready" title="Ready">Ready</Tab>
                    <Tab className="tabs-style" eventKey="delivered" title="Delivered">Delivered</Tab>
                </Tabs>
                {this.state.key === 'new' && <div>{this.newOrdersTable()}</div>}
                {this.state.key === 'preparing' && <div>{this.preparingOrdersTable()}</div>}
                {this.state.key === 'ready' && <div>{this.readyOrdersTable()}</div>}
                {this.state.key === 'delivered' && <div>{this.deliveredOrdersTable()}</div>}
            </div>
        );
    }
}

export default Orders;