import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import '../../styles/Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    renderRedirect = () => {
        if (!cookie.load('cookie')) {
            return <Redirect to="/home"/>
        }

        return (cookie.load('cookie').userType === "buyer") ? <Redirect to="/homeBuyer"/> : <Redirect to="/homeOwner"/>
    };

    render() {
        return (this.renderRedirect())
    }
}

export default Navbar;