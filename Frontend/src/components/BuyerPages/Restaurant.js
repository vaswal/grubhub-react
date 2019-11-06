import React, {Component} from 'react';
import {Button, Card, ListGroup, Pagination} from "react-bootstrap";
import "../../styles/Menu.css"
import axios from 'axios';
import {connect} from "react-redux";
import {Redirect} from 'react-router';
import {HOSTNAME} from "../../components/Constants/Constants";
import {getMenuItems, onClickSection, pageChanged, placeOrder} from "../../js/actions/restaurantActions";

//axios.defaults.withCredentials = true;
//axios.defaults.headers.post['Content-Type'] = 'application/json' // for POST requests
//axios.defaults.headers.post['Authorization'] = 'Token ' + localStorage.getItem('token')

function mapStateToProps(store) {
    return {
        placeOrderSuccess: store.restaurant.placeOrderSuccess,
        placeOrderMessage: store.restaurant.placeOrderMessage,
        allSections: store.restaurant.allSections,
        allItems: store.restaurant.allItems,
        tabs: store.restaurant.tabs,
        currentTab: store.restaurant.currentTab,
        pageItems: store.restaurant.pageItems,
        todosPerPage: store.restaurant.todosPerPage,
        active: store.restaurant.active,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        placeOrder: (payload) => dispatch(placeOrder(payload)),
        getMenuItems: (payload) => dispatch(getMenuItems(payload)),
        onClickSection: (payload) => dispatch(onClickSection(payload)),
        pageChanged: (payload) => dispatch(pageChanged(payload))
    };
}

class Restaurant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: [],
            quantity: 0,
            buyerId: null,
            customer_name: null,
            customer_address: null,
            addItemSuccess: null,
            updateItemSuccess: null,
            currentPage: 1,
        };

        this.getMenuItems = this.getMenuItems.bind(this);
        this.getCartItems = this.getCartItems.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
        this.pageChanged = this.pageChanged.bind(this);
        this.paginationBasic = this.paginationBasic.bind(this);
    }

    addToCart = (menu_item_id) => {
        console.log("menu_item_id");
        console.log(menu_item_id);

        return e => {
            e.preventDefault();
            this.setState({updateItemSuccess: null, placeOrderSuccess: null});

            const data = {};
            for (let i = 0; i < e.target.length; i++) {
                if (e.target[i].value !== "") {
                    data[e.target[i].name] = e.target[i].value;
                }
            }
            const addedItem = this.props.allItems.filter(function (item) {
                return item._id === menu_item_id;
            });

            console.log("addedItem");
            console.log(addedItem);
            console.log(data);

            const cartItem = {
                name: addedItem[0].name,
                quantity: parseInt(data.quantity, 10),
                price: parseInt(addedItem[0].price, 10)
            };

            this.setState({cartItems: this.state.cartItems.concat(cartItem)});
        }
    };

    placeOrder = (e) => {
        e.preventDefault();

        console.log("this.props.placeOrderSuccess")
        console.log(this.props.placeOrderSuccess)
        console.log("this.props.placeOrderMessage")
        console.log(this.props.placeOrderMessage)
        const payload = {};

        payload.customer_name = this.state.customer_name;
        payload.customer_address = this.state.customer_address;
        payload.items = JSON.stringify({items: this.state.cartItems});
        payload.status = "New";
        payload.owner_id = this.state.selectedRestaurantId;
        payload.buyer_id = this.state.buyerId;

        console.log("placeOrder payload");
        console.log(payload);

        this.props.placeOrder(payload);
        this.setState({cartItems: []})
    };

    getTotalPrice = () => {
        console.log("getTotalPrice");
        console.log(this.state.cartItems);
        // console.log(this.state.cartItems.length);

        if (this.state.cartItems.length > 0) {
            return (
                <ul className="ul li">
                    <li>
                        <div style={{whiteSpace: 'nowrap'}}>
                            Total price
                            -
                            ${this.state.cartItems.map(item => (item.price * item.quantity)).reduce((prev, next) => prev + next)}
                        </div>
                    </li>
                </ul>
            );
        }
    };

    getCartItems = () => {
        // console.log("getCartItems");
        // console.log(this.state.cartItems);

        const allTabs = this.state.cartItems.map(item => {
            // console.log("item");
            // console.log(item);
            // console.log("item.name: " + item.name);
            return (
                <li>
                    <div style={{whiteSpace: 'nowrap'}}>Name - {item.name} Qty - {item.quantity}</div>
                </li>
            );
        });

        console.log(allTabs);

        return <ul className="ul li">{allTabs}</ul>;
    };

    getMenuItems() {
        console.log("getMenuItems");
        const outerPayload = {};
        outerPayload.owner_id = this.props.location.state.selectedRestaurantId;

        console.log("outerPayload")
        console.log(outerPayload)

        this.props.getMenuItems(outerPayload);
    }

    componentWillMount() {
        let userType = localStorage.getItem('userType') ? localStorage.getItem('userType') : null;

        console.log("userType");
        console.log(userType);

        if (userType !== null) {
            const buyerId = localStorage.getItem('_id');
            console.log("Restaurant");
            console.log(this.props.location.state.selectedRestaurantId);
            this.setState({selectedRestaurantId: this.props.location.state.selectedRestaurantId, buyerId: buyerId});

            const payload = {};
            payload.buyerId = buyerId;

            axios.post(`http://${HOSTNAME}:3001/profile/get`, payload)
                .then((response) => {
                    console.log("profile/get");
                    console.log(response.data);

                    this.setState({customer_name: (response.data[0].firstName + " " + response.data[0].lastName)}, () => {
                        this.setState({customer_address: this.state.customer_name + "'s GPS address"})
                    });
                });

            // this.getMenuItems();
            // this.createPages();

            this.getMenuItems();
        }
    }

    pageChanged = (e) => {
        console.log("In pageChanged");
        console.log(e.target.text);

        const payload = {};
        payload.pageNumber = parseInt(e.target.text, 10);
        this.props.pageChanged(payload);
    }

    paginationBasic = () => {
        return (<div>
            <Pagination onClick={this.pageChanged}>{this.props.pageItems}</Pagination>
            <br/>
        </div>)
    };

    onClickSection = (e) => {
        e.preventDefault();

        console.log("onClickSection")
        console.log("e.target.text")
        const selectedSection = e.target.href.split("/").pop();
        console.log(selectedSection);

        const index = this.props.tabs.findIndex(obj => obj.name === selectedSection);

        const payload = {};
        payload.index = index;

        this.props.onClickSection(payload);
    }

    createSectionList = () => {
        if (!this.props.allSections) {
            return [];
        }

        console.log("this.state.allSections")
        console.log(this.props.allSections);
        const sections = this.props.allSections;
        const list = [];

        for (let section of sections) {
            console.log("section.name")
            console.log(section)
            list.push(<ListGroup.Item action href={section} onClick={this.onClickSection}>{section}</ListGroup.Item>)
        }
        return list;
    }

    populateSection = (currentTab) => {
        if (!this.props.allItems) {
            return <div>
                <ul className="ul li"></ul>
            </div>;
        }

        console.log("currentTab")
        console.log(currentTab)

        console.log("this.state.tabs")
        console.log(this.props.tabs)
        const items = this.props.allItems.filter(item => {
            return (item.section === currentTab.name)
        });

        console.log("this.state.pageItems")
        console.log(this.props.pageItems)

        const {active, todosPerPage} = this.props;

        // Logic for displaying todos
        const indexOfLastTodo = active * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = items.slice(indexOfFirstTodo, indexOfLastTodo);

        const renderTodos = currentTodos.map((item, index) => {
            return <li key={index}>
                <div className="menu">
                    <form style={{marginTop: "30px"}} className="form" onSubmit={this.addToCart(item._id)}>
                        <div className='rowC'>
                            <div className="card-header"><img style={{width: "150px", height: "150px", margin: 0}}
                                                              src={require(`../../images/grubhub/${item.image}`)}/>
                            </div>
                            <div style={{marginLeft: "-280px"}}>
                                <div className="email-div">
                                    <div className='rowC'>
                                        <label className="account-labels desc-label"
                                               name="descriptionStored">Name</label>
                                        <label style={{whiteSpace: 'nowrap', marginLeft: "-1px"}}
                                               className="account-labels desc-label">{item.name}</label>
                                    </div>
                                </div>

                                <div className="email-div">
                                    <div className='rowC'>
                                        <label className="account-labels menu-label">Description</label>
                                        <label style={{whiteSpace: 'nowrap', marginLeft: "-1px"}}
                                               className="account-labels desc-label"
                                               name="descriptionStored">{item.description}</label>
                                    </div>
                                </div>

                                <div className="email-div">
                                    <div className='rowC'>
                                        <label className="account-labels email-label">Price</label>
                                        <label style={{whiteSpace: 'nowrap', marginLeft: "-1px"}}
                                               className="account-labels email-label">{item.price}</label>
                                    </div>
                                </div>

                                <div className='rowC'>
                                    <label style={{marginRight: "10px"}}
                                           className="account-labels menu-label">Quantity</label>
                                    <div className="input-email">
                                        <input style={{marginLeft: "-1px"}} className="email account-input" type="input"
                                               name="quantity"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='rowC'>
                            <Button style={{marginLeft: "300px"}} type="submit" variant="primary" className="menu-btn">Add
                                item</Button>
                        </div>

                    </form>
                </div>

            </li>;
        });

        return <div>
            <h2>{currentTab.name}</h2>
            <ul className="ul li">{renderTodos}</ul>
        </div>;

    }

    render() {
        const redirectVar = (localStorage.getItem('userType') === null) ? <Redirect to="/home"/> : null;

        return (
            <div>
                {/*{redirectVar}*/}
                {(this.props.placeOrderSuccess != null) && this.props.placeOrderSuccess === true &&
                <div className="success-signup"><span>Successfully placed order</span></div>}

                <div className='rowC'>
                    <ListGroup defaultActiveKey="#link1">
                        <ListGroup.Item variant="primary">Sections</ListGroup.Item>
                        {this.createSectionList()}
                    </ListGroup>

                    <div className="container">
                        <div className="well">
                            {this.populateSection(this.props.currentTab)}
                        </div>
                    </div>

                    {/*<Cart />*/}
                    <div style={{marginLeft: 10, padding: 20}}>
                        <Card style={{width: '38rem'}}>
                            <Card.Body>
                                <Card.Title>Cart</Card.Title>

                                {this.getCartItems()}
                                {this.getTotalPrice()}

                                <Button type="button" variant="primary" onClick={this.placeOrder}>Order</Button>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                {/*{this.paginationBasic()}*/}
                <div>
                    <Pagination onClick={this.pageChanged}>{this.props.pageItems}</Pagination>
                    <br/>
                </div>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Restaurant);