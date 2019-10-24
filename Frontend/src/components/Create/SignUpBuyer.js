import React, {Component} from 'react';
import '../../styles/Account.css';
import logo from '../../images/grubhub.svg';
import {connect} from "react-redux";
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
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
        signUpBuyer: (book) => dispatch(signUpMongo(book))
    };
}

class ConnectedSignUpBuyer extends Component {
    constructor(props) {
        super(props);
        this.signUpBuyer = this.signUpBuyer.bind(this);
    }

    signUpBuyer = (e) => {
        e.preventDefault();
        //const data = new FormData(e.target);
        const data = {};
        for (let i = 0; i < e.target.length; i++) {
            if (e.target[i].name !== "") {
                data[e.target[i].name] = e.target[i].value;
            }
        }

        data.userType = "buyer";

        console.log("signUpBuyer data")
        console.log(data)

        // this.props.signUpBuyer(data);
        //this.props.signUpBuyer({"user": {"username": "x", "password": "x"}});
        //this.props.signUpBuyer({"user": {firstName: "x", lastName: "x", emailId: "x", password: "x", userType: "buyer"}});
        this.props.signUpBuyer({"user": data});
    };

    renderRedirect = () => {
        if (!cookie.load('cookie')) {
            return <Redirect to="/home"/>
        }
    };

    render() {
        {
            this.renderRedirect()
        }
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
                    <img className="account-logo" src={logo} alt="Quora"/>
                </div>

                {message}
                <div className="signUp">
                    <p className="signUp-text">Create your account</p>
                    <form className="form" onSubmit={this.signUpBuyer}>
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
                                <input className="email account-input" type="input" name="emailId"
                                       required/>
                                {/*<input className="email account-input" type="input" name="emailId" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"*/}
                                {/*       title="abc@example.com" required/>*/}
                            </div>
                        </div>
                        <div className="pw">
                            <label className="account-labels email-label">Password (8 character minimum)</label>
                            <div className="input-email">
                                <input className="email account-input" type="password" name="password"
                                       required/>
                                {/*<input className="email account-input" type="password" name="password"*/}
                                {/*       minLength="8" required/>*/}
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="new-btn">Create your account</button>
                        </div>

                        <div className="signUp-label">
                            <label className="account-labels">Have an account?</label>
                            <NavLink to="/signInBuyer">Sign In</NavLink>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedSignUpBuyer);