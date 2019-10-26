import React, {Component} from 'react';
import '../../styles/Account.css';
import logo from '../../images/grubhubOwnerLogo.png';
import {connect} from "react-redux";
import {signUpMongo} from "../../js/actions/accessActions";
import {NavLink} from 'react-router-dom';

function mapStateToProps(store) {
    return {
        signupSuccess: store.account.signupSuccess,
        signupMessage: store.account.signupMessage
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signUpOwner: (book) => dispatch(signUpMongo(book))
    };
}

class ConnectedSignUpOwner extends Component {
    constructor(props) {
        super(props);
        this.signUpOwner = this.signUpOwner.bind(this);
    }

    signUpOwner = (e) => {
        e.preventDefault();
        //const data = new FormData(e.target);
        const data = {};
        for (let i = 0; i < e.target.length; i++) {
            if (e.target[i].name !== "") {
                data[e.target[i].name] = e.target[i].value;
            }
        }

        data.userType = "owner";

        console.log("signUpOwner data")
        console.log(data)

        this.props.signUpOwner({user: data});
        //this.props.signUpOwner({"user": {firstName: "x", lastName: "x", emailId: "x", password: "x", userType: "owner"}});
    };

    render() {
        let message;
        if (this.props.signupSuccess != null && this.props.signupSuccess) {
            message = <div className="success-signup"><span>{this.props.signupMessage}</span></div>
        }
        if (this.props.signupSuccess != null && !this.props.signupSuccess) {
            message = <div className="unsuccess-signup"><span>{this.props.signupMessage}</span></div>
        }
        if (this.props.signinSuccess != null && !this.props.signinSuccess) {
            message = <div className="unsuccess-signup"><span>{this.props.signinMessage}</span></div>
        }

        return (
            <div>
                <div className="account-logo-container">
                    <img className="account-owner-logo" src={logo} alt="Quora"/>
                </div>

                {message}
                <div className="signUp">
                    <p className="signUp-text">Create your account</p>
                    <form className="form" onSubmit={this.signUpOwner}>
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">First Name</label>
                                <div className="input-firstName">
                                    <input className="first-name account-input" type="text" name="firstName"
                                           required/>
                                </div>
                            </div>
                            <div className="second-half">
                                <label className="account-labels last-name-label">Last Name</label>
                                <div className="input-lastName">
                                    <input className="last-name account-input" type="text" name="lastName"
                                           required/>
                                </div>
                            </div>
                        </div>

                        <div className="email-div">
                            <label className="account-labels email-label">Email</label>
                            <div className="input-email">
                                {/*<input className="email account-input" type="input" name="emailId"*/}
                                {/*       pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="abc@example.com"*/}
                                {/*       required/>*/}
                                <input className="email account-input" type="input" name="emailId"
                                       required/>
                            </div>
                        </div>
                        <div className="pw">
                            <label className="account-labels email-label">Password (8 character minimum)</label>
                            {/*<div className="input-email">*/}
                            {/*    <input className="email account-input" type="password" name="password" minLength="8"*/}
                            {/*           required/>*/}
                            {/*</div>*/}
                            <div className="input-email">
                                <input className="email account-input" type="password" name="password"
                                       required/>
                            </div>
                        </div>
                        <div className="pw">
                            <label className="account-labels email-label">Phone Number</label>
                            <div className="input-email">
                                {/*<input className="email account-input" type="input" name="phoneNumber"*/}
                                {/*       pattern="[0-9]+" minLength="10" title="Enter 10 digit numeric phone number" required/>*/}
                                <input className="email account-input" type="input" name="phoneNumber"
                                       title="Enter 10 digit numeric phone number" required/>
                            </div>
                        </div>
                        <div className="pw">
                            <label className="account-labels email-label">Restaurant Name</label>
                            <div className="input-email">
                                <input className="email account-input" type="input" name="restaurantName"
                                       required/>
                            </div>
                        </div>
                        <div className="pw">
                            <label className="account-labels email-label">Cuisine</label>
                            <div className="input-email">
                                <input className="email account-input" type="input" name="cuisine"
                                       required/>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="new-btn">Create your account</button>
                        </div>

                        <div className="signUp-label">
                            <label className="account-labels">Have an account?</label>
                            <NavLink to="/signInOwner">Sign In</NavLink>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedSignUpOwner);