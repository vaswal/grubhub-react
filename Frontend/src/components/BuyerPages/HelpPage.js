import React, {Component} from "react";
import {Button, Card} from "react-bootstrap";
import "../../styles/Menu.css"
import {getOrdersByStatus, onDragEnd} from "../../js/actions/restaurantActions";
import {connect} from "react-redux";
import {Redirect} from "react-router";

function mapStateToProps(store) {
    return {
        allOrders: store.restaurant.allOrders,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getOrdersByStatus: (payload) => dispatch(getOrdersByStatus(payload)),
        onDragEnd: (payload) => dispatch(onDragEnd(payload))
    };
}

class HelpPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectVar: null,
            selectedOrder: null
        };

        this.goToChat = this.goToChat.bind(this);
    }

    goToChat = (order) => {
        console.log("goToChat")
        console.log("order")
        console.log(order)
        this.setState({redirectVar: true, selectedOrder: order})
    }

    componentDidMount() {
        const payload = {};
        payload.userId = localStorage.getItem('_id');
        payload.statusCode = "All";

        this.props.getOrdersByStatus(payload);
    }

    populateSection = () => {
        console.log("populateSection");

        const renderTodos = this.props.allOrders.map((order, index) => {
            // const items = JSON.parse(order.items);
            console.log("order")
            console.log(order)

            return <li key={index}>
                <Card style={{width: '22rem'}}>
                    <Card.Img variant="top" src={require("../../images/restaurant-logo.png")}/>
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            <b>Order Id</b> - {order._id}
                            <br/>
                            <b>Customer Address</b> - {order.customer_address}
                            <br/>
                            <b>Order Status</b> - {order.status}

                        </Card.Text>
                        <Button onClick={() => this.goToChat(order)} type="button" variant="primary">Chat for
                            help</Button>
                    </Card.Body>
                </Card>
            </li>;
        });

        return <div>
            <ul className="ul li">{renderTodos}</ul>
        </div>;

    }

    render() {

        return (
            <div>
                {this.state.redirectVar !== null && <Redirect to={{
                    pathname: "/homeBuyer/chat",
                    state: {selectedOrder: this.state.selectedOrder}
                }}/>}
                {this.populateSection()}
            </div>
        );
    }
}

const styles = {
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        height: "100vh",
    },
    channelList: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
    },
    chat: {
        display: "flex",
        flex: 3,
        flexDirection: "column",
        borderWidth: "1px",
        borderColor: "#ccc",
        borderRightStyle: "solid",
        borderLeftStyle: "solid",
    },
    settings: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(HelpPage);