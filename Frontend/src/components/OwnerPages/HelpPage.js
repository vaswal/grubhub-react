import React, {Component} from "react";
import {Badge, Button, Card} from "react-bootstrap";
import "../../styles/Menu.css"
import {getOrders} from "../../js/actions/ownerActions";
import {connect} from "react-redux";
import {Redirect} from "react-router";

function mapStateToProps(store) {
    return {
        allOrders: store.owner.allOrders,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getOrders: (payload) => dispatch(getOrders(payload)),
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

        this.props.getOrders(payload);
    }

    getOrderStatusBadge = (status) => {
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

    populateSection = () => {
        console.log("populateSection");

        // console.log("currentTab")
        // console.log(currentTab)
        //
        // console.log("this.state.tabs")
        // console.log(this.props.tabs)
        // const items = this.props.allItems.filter(item => {return (item.section === currentTab.name)});
        //
        // console.log("this.state.pageItems")
        // console.log(this.props.pageItems)
        //
        // const {active, todosPerPage} = this.props;
        //
        //
        // // Logic for displaying todos
        // const indexOfLastTodo = active * todosPerPage;
        // const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        // const currentTodos = items.slice(indexOfFirstTodo, indexOfLastTodo);

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
                            {/*Items - {items}*/}
                            <b>Order Id</b> - {order._id}
                            <br/>
                            <b>Customer Address</b> - {order.customer_address}
                            <br/>
                            <b>Order Status</b> - {this.getOrderStatusBadge(order.status)}
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
                <h1>Owner help</h1>
                {this.state.redirectVar !== null && <Redirect to={{
                    pathname: "/homeOwner/chat",
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