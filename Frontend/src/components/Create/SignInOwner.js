import React, {Component} from 'react';
import '../../styles/Account.css';
import logo from '../../images/grubhubOwnerLogo.png';
import {connect} from "react-redux";
import {Redirect} from 'react-router';
import {signInMongo} from "../../js/actions/accessActions";
import {NavLink} from 'react-router-dom';

function mapStateToProps(store) {
    return {
        signinSuccess: store.account.signinSuccess,
        signinMessage: store.account.signinMessage,
        userType: store.account.userType,
        userId: store.account.userId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signInOwner: (book) => dispatch(signInMongo(book))
    };
}

class ConnectedSignInOwner extends Component {
    constructor(props) {
        super(props);
        this.signInOwner = this.signInOwner.bind(this);
    }

    signInOwner = (e) => {
        e.preventDefault();
        const data = {};
        for (let i = 0; i < e.target.length; i++) {
            if (e.target[i].name !== "") {
                data[e.target[i].name] = e.target[i].value;
            }
        }
        data.userType = "owner";
        this.props.signInOwner({user: data});
    };

    render() {
        let message;
        let redirectVar;


        if (this.props.signinSuccess != null && this.props.signinSuccess && this.props.token !== null) {
            console.log("Signin success");
            console.log("Inside signInOwner");
            redirectVar = (this.props.userType === "buyer") ? <Redirect to="/homeBuyer"/> : <Redirect to="/homeOwner/"/>
        }

        if (this.props.signinSuccess != null && !this.props.signinSuccess) {
            message = <div className="unsuccess-signup"><span>{this.props.signinMessage}</span></div>
        }

        return (
            <div>
                {redirectVar}
                <div className="account-logo-container">
                    <img className="account-owner-logo" src={logo} alt="Quora"/>
                </div>

                {message}
                <div className="signUp">
                    <p className="signUp-text">Sign in with your Grubhub account</p>
                    <form className="form" onSubmit={this.signInOwner}>
                        <div className="email-div">
                            <label className="account-labels email-label">Email</label>
                            <div className="input-email">
                                <input className="email account-input" type="input" name="emailId"
                                       title="abc@example.com"
                                       required></input>
                                {/*<input className="email account-input" type="input" name="emailId"*/}
                                {/*       pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="abc@example.com"*/}
                                {/*       required></input>*/}
                            </div>
                        </div>
                        <div className="pw">
                            <label className="account-labels email-label">Password (8 character minimum)</label>
                            <div className="input-email">
                                <input className="email account-input" type="password" name="password"
                                       required></input>
                                {/*<input className="email account-input" type="password" name="password" minLength="8"*/}
                                {/*       required></input>*/}
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="new-btn">Sign In</button>
                        </div>
                        <div className="signUp-label">
                            <NavLink to="/signUpOwner">Create you account</NavLink>
                        </div>

                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedSignInOwner);