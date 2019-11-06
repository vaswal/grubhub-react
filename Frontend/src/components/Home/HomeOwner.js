import React, {Component} from 'react';
import {Redirect, Switch} from 'react-router';
import logo from "../../images/grubhub.svg";
import '../../styles/Navbar.css';
import Orders from '../OwnerPages/Orders';
import Menu from '../OwnerPages/Menu';
import ProfileOwner from '../Profile/ProfileOwner';
import SignOut from '../Create/SignOut';

import {Link, NavLink, Route} from "react-router-dom";
import {Nav, Navbar} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import axios from 'axios';
import HelpPage from "../OwnerPages/HelpPage";
import ChatPage from "../OwnerPages/ChatPage";

axios.defaults.withCredentials = true;

class HomeOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            restaurantName: ""
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(key) {
        console.log('selected' + key);
        this.setState({key: key});
    }

    componentWillMount() {
        let userType = localStorage.getItem('userType') ? localStorage.getItem('userType') : null;
        console.log("userType");
        console.log(userType);

        if (userType !== null) {
            console.log("componentWillMount");
            const payload = {};
            payload.queryName = "GET_RESTAURANT_NAME";
            payload.arguments = [localStorage.getItem('userId')];
            // axios.post(`http://${HOSTNMAE}:3001/profile/getByQuery`, payload)
            //     .then((response) => {
            //         //this.setState({restaurantName: response.data[0].restaurantname});
            //     });
        }
    }

    render() {
        const redirectVar = (localStorage.getItem('userType') === null) ? <Redirect to="/home"/> : null;

        return (
            <div>
                {/*{redirectVar}*/}

                <div className="account-logo-container">
                    <img className="account-logo" src={logo} alt="Quora"/>
                </div>
                <div>
                    <Navbar>
                        <Navbar.Brand as={Link} to='/'>{this.state.restaurantName}</Navbar.Brand>
                        <Nav>
                            <Nav.Link as={NavLink} to='/homeOwner/orders/'>Orders</Nav.Link>
                            <Nav.Link as={NavLink} to='/homeOwner/menu/'>Menu</Nav.Link>

                        </Nav>
                        <Nav className="ml-auto">
                            <Nav.Link as={NavLink} to='/homeOwner/help'>Help</Nav.Link>
                            <Nav.Link as={NavLink} to='/homeOwner/chat'>Chat</Nav.Link>
                            <Nav.Link as={NavLink} to='/homeOwner/profileOwner/'>Profile</Nav.Link>
                            <Nav.Link as={NavLink} to='/homeOwner/signOut/'>SignOut</Nav.Link>
                        </Nav>
                    </Navbar>
                </div>


                <div>
                    <Switch>
                        <Route exact path='/homeOwner/orders/' component={Orders}/>
                        <Route exact path='/homeOwner/menu/' component={Menu}/>
                        <Route exact path='/homeOwner/profileOwner/' component={ProfileOwner}/>
                        <Route exact path='/homeOwner/signOut/' component={SignOut}/>
                        <Route exact path='/homeOwner/help' component={HelpPage}/>
                        <Route exact path='/homeOwner/chat' component={ChatPage}/>
                    </Switch>
                </div>
                {((this.props.location.pathname === "/homeOwner") || (this.props.location.pathname === "/homeOwner/")) &&
                <Orders/>}
            </div>
        );
    }
}


export default HomeOwner;