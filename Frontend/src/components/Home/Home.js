import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import logo from "../../images/grubhub.svg";
import '../../styles/Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let redirectVar = null;

        // if (localStorage.getItem('userType') !== null) {
        //     redirectVar = (localStorage.getItem('userType') === "buyer") ? <Redirect to="/homeBuyer"/> :
        //         <Redirect to="/homeOwner/orders/"/>
        // }

        const divStyle = {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            margin: 0,
            padding: 0
        };

        const NavStyle = {
            padding: 50
        };

        return (
            <div>
                {/*{redirectVar}*/}
                <div className="account-logo-container">
                    <img className="quora-logo-account" src={logo} alt="Quora"/>
                </div>

                <div className="bg" style={divStyle}></div>

                <div className="row">
                    <Link to="/signInBuyer">
                        <div className="half-row">
                            <button type="button" className="signin-btn">Buyer Sign In</button>
                        </div>
                    </Link>
                </div>

                <div className="row">
                    <Link to="/signInOwner">
                        <div className="half-row">
                            <button type="button" className="signin-btn">Owner Sign In</button>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Navbar;