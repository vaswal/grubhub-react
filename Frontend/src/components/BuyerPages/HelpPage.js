import React, { Component } from "react";
import {Card, Button} from "react-bootstrap";
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

        // if (this.props.allOrders.length === 0) {
        //     return <div>
        //         <Card style={{ width: '18rem' }}>
        //             <Card.Img variant="top" src={require("../../images/restaurant-logo.png")} />
        //             <Card.Body>
        //                 <Card.Title>Card Title</Card.Title>
        //                 <Card.Text>
        //                     Some quick example text to build on the card title and make up the bulk of
        //                     the card's content.
        //                 </Card.Text>
        //                 <Button variant="primary" type="button" onClick={this.goToChat} >Chat for help</Button>
        //             </Card.Body>
        //         </Card>
        //     </div>;
        // }

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
                <Card style={{ width: '22rem'}}>
                    <Card.Img variant="top" src={require("../../images/restaurant-logo.png")}/>
                    <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                            {/*Items - {items}*/}
                            <br/>
                            <b>Customer Address</b> - {order.customer_address}
                            <br/>
                            <b>Order Status</b> - {order.status}

                        </Card.Text>
                        <Button onClick={() => this.goToChat(order)} type="button" variant="primary">Chat for help</Button>
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