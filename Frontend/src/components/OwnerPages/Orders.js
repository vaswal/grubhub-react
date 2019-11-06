import React, {Component} from 'react';
import {Tab, Tabs} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import '../../styles/Orders.css';
import {Redirect} from 'react-router';
import {connect} from "react-redux";
import {changeOrderStatus, getOrders} from "../../js/actions/ownerActions";


function mapStateToProps(store) {
    return {
        newOrders: store.owner.newOrders,
        preparingOrders: store.owner.preparingOrders,
        readyOrders: store.owner.readyOrders,
        deliveredOrders: store.owner.deliveredOrders,
        canceledOrders: store.owner.canceledOrders
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getOrders: (payload) => dispatch(getOrders(payload)),
        changeOrderStatus: (payload) => dispatch(changeOrderStatus(payload))
    };
}

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
    }

    makeOrderStatusPreparing(cell) {
        console.log("Inside makeOrderStatusPreparing");
        this.props.changeOrderStatus({_id: cell.orderId, newStatus: "Preparing", owner_id: cell.owner_id});
    }

    makeOrderStatusReady(cell) {
        console.log("Inside makeOrderStatusPreparing");
        console.log("cell");
        console.log(cell);
        this.props.changeOrderStatus({_id: cell.orderId, newStatus: "Ready", owner_id: cell.owner_id});
    }

    makeOrderStatusDelivered(cell) {
        console.log("Inside makeOrderStatusPreparing");
        console.log("cell");
        console.log(cell);
        this.props.changeOrderStatus({_id: cell.orderId, newStatus: "Delivered", owner_id: cell.owner_id});
    }

    cancelOrder(cell) {
        console.log("Inside canelOrder");
        this.props.changeOrderStatus({_id: cell.orderId, newStatus: "Cancel", owner_id: cell.owner_id});
    }

    handleSelect(key) {
        console.log('selected' + key);
        this.setState({key: key});
    }

    newOrdersTable() {
        console.log("Inside new orders");
        return (
            <BootstrapTable keyField='id'
                            data={this.props.newOrders}
                            columns={this.state.newColumns}
            />
        );
    }

    preparingOrdersTable() {
        console.log("Inside preparingOrdersTable");
        return (
            <BootstrapTable keyField='orderId'
                            data={this.props.preparingOrders}
                            columns={this.state.preparingColumns}
            />
        );
    }

    readyOrdersTable() {
        console.log("Inside new orders");
        return (
            <BootstrapTable keyField='orderId'
                            data={this.props.readyOrders}
                            columns={this.state.readyColumns}
            />
        );
    }

    deliveredOrdersTable() {
        console.log("Inside new orders");
        return (
            <BootstrapTable keyField='orderId'
                            data={this.props.deliveredOrders}
                            columns={this.state.basicColumns}
            />
        );
    }

    canceledOrdersTable() {
        console.log("Inside new orders");
        return (
            <BootstrapTable keyField='orderId'
                            data={this.props.canceledOrders}
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

    componentDidMount() {
        if (localStorage.getItem('userType') !== null) {
            const payload = {};
            payload.userId = localStorage.getItem('_id');

            this.props.getOrders(payload);
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
                    <Tab className="tabs-style" eventKey="cancel" title="Canceled">Canceled</Tab>
                </Tabs>
                {this.state.key === 'new' && <div>{this.newOrdersTable()}</div>}
                {this.state.key === 'preparing' && <div>{this.preparingOrdersTable()}</div>}
                {this.state.key === 'ready' && <div>{this.readyOrdersTable()}</div>}
                {this.state.key === 'delivered' && <div>{this.deliveredOrdersTable()}</div>}
                {this.state.key === 'cancel' && <div>{this.canceledOrdersTable()}</div>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);