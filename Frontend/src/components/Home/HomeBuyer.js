import React, {Component} from 'react';
import {Redirect, Switch} from 'react-router';
import '../../styles/Navbar.css';
import grubhub_logo from "../../images/grubhub.svg";
import logo from '../../images/search-im.jpg';
import SearchBuyer from '../BuyerPages/SearchBuyer';
import Restaurant from '../BuyerPages/Restaurant';
import UpcomingOrdersDraggable from '../BuyerPages/UpcomingOrdersDraggable';
import PastOrders from '../BuyerPages/PastOrders';
import ProfileBuyer from '../Profile/ProfileBuyer';
import SignOut from '../Create/SignOut';
import ChatPage from '../BuyerPages/ChatPage';
import HelpPage from '../BuyerPages/HelpPage';

import {Link, NavLink, Route} from "react-router-dom";
import {Button, Nav, Navbar} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

class HomeBuyer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            searchTerm: null,
            redirectVar: null
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    handleSelect(key) {
        console.log('selected' + key);
        this.setState({key: key});
    }

    doSearch(e) {
        e.preventDefault();
        const data = {};

        for (let i = 0; i < e.target.length; i++) {
            if (e.target[i].value != "") {
                data[e.target[i].name] = e.target[i].value;
            }
        }
        console.log(data);
        console.log(data.searchedTerm);

        this.setState({searchTerm: data.searchedTerm});
        this.setState({redirectVar: true});
    }

    render() {
        const redirectVar = (localStorage.getItem('userType') === null) ? <Redirect to="/home"/> : null;

        return (
            <div>
                {/*{redirectVar}*/}

                {this.state.redirectVar != null && <Redirect to={{
                    pathname: "/homeBuyer/search",
                    state: {searchTerm: this.state.searchTerm}
                }}/>}
                <div className="account-logo-container">
                    <img className="account-logo" src={grubhub_logo} alt="Quora"/>
                </div>
                <div>
                    <Navbar>
                        <Navbar.Brand as={Link} to='/'>Home</Navbar.Brand>
                        <Nav>
                            <Nav.Link as={NavLink} to='/homeBuyer/upcomingOrders'>Upcoming orders</Nav.Link>
                            <Nav.Link as={NavLink} to='/homeBuyer/pastOrders'>Past orders</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            <Nav.Link as={NavLink} to='/homeBuyer/help'>Help</Nav.Link>
                            <Nav.Link as={NavLink} to='/homeBuyer/chat'>Chat</Nav.Link>
                            <Nav.Link as={NavLink} to='/homeBuyer/profileBuyer/'>Profile</Nav.Link>
                            <Nav.Link as={NavLink} to='/homeBuyer/signOut/'>SignOut</Nav.Link>
                        </Nav>
                    </Navbar>
                </div>

                <div>
                    <Switch>
                        <Route exact path='/homeBuyer/search' component={SearchBuyer}/>
                        <Route exact path='/homeBuyer/restaurant' component={Restaurant}/>
                        <Route exact path='/homeBuyer/profileBuyer/' component={ProfileBuyer}/>
                        <Route exact path='/homeBuyer/upcomingOrders/' component={UpcomingOrdersDraggable}/>
                        <Route exact path='/homeBuyer/pastOrders/' component={PastOrders}/>
                        <Route exact path='/homeBuyer/signOut/' component={SignOut}/>
                        <Route exact path='/homeBuyer/help' component={HelpPage}/>
                        <Route exact path='/homeBuyer/chat' component={ChatPage}/>

                    </Switch>
                </div>

                {((this.props.location.pathname === "/homeBuyer") || (this.props.location.pathname === "/homeBuyer/")) &&
                <div>
                    <img className="search-img" src={logo} alt="Quora"/>

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh'}}>
                        <h3>Search your favorite food!</h3>
                    </div>


                    <form className="form" onSubmit={this.doSearch}>
                        <div className='rowC'>
                            <div className="input-email">
                                <input style={{display: 'flex', width: '50vh'}} className="email account-input"
                                       type="input" name="searchedTerm"/>
                            </div>
                            <Button type="submit" variant="primary" className="menu-btn">Search</Button>
                        </div>
                    </form>

                </div>
                }
            </div>
        );
    }
}

export default HomeBuyer;