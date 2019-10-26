import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../styles/Navbar.css';
import BootstrapTable from "react-bootstrap-table-next";
import {connect} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';

//axios.defaults.withCredentials = true;


class UpcomingOrders extends Component {
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
            upcomingOrders: []
        };

        this.getOrders = this.getOrders.bind(this);
        this.itemFormatter = this.itemFormatter.bind(this);
    }

    itemFormatter = (cell, row) => {
        return cell.join(" | ")
    };

    newOrdersTable() {
        console.log("Inside new orders");
        return (
            <BootstrapTable keyField='id'
                            data={this.state.upcomingOrders}
                            columns={this.state.columns}
            />
        );
    }

    getOrderBasedOnStatus(response, status) {
        const ordersByStatus = response.data.filter(order => {
                return (order.status !== status) && (order.status !== "Cancel")
            }
        );

        const displayOrders = [];

        ordersByStatus.forEach(function (order) {
            const displayOrder = {};
            const items = JSON.parse(order.items);

            displayOrder["status"] = order.status;
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

        // console.log("Inside getOrders");
        // axios.post(`http://${HOSTNMAE}:3001/orders/getByOwner`, payload)
        //     .then((response) => {
        //         this.setState({
        //             upcomingOrders: this.getOrderBasedOnStatus(response, "Delivered")
        //         });
        //     });
    }

    componentWillMount() {
        if (localStorage.getItem('userType') !== null) {
            const payload = {};
            payload.userId = localStorage.getItem('_id');
            payload.statusSet = new Set(["New", "Preparing", "Ready"]);
            payload.statusCode = "Upcoming";

            this.props.getOrdersByStatus(payload);
        }
    }

    render() {
        const redirectVar = (localStorage.getItem('userType') === null) ? <Redirect to="/home"/> : null;

        return (
            <div>
                {/*{redirectVar}*/}
                <div>{this.newOrdersTable()}</div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingOrders);