import React, {Component} from 'react';
import '../../styles/Profile.css';
import {connect} from "react-redux";
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {getProfileAction, updateProfileAction} from "../../js/actions/profileActions";

function mapStateToProps(store) {
    return {
        userId: store.profile.userId,
        firstName: store.profile.firstName,
        lastName: store.profile.lastName,
        email: store.profile.email,
        phoneNumber: store.profile.phoneNumber,
        restaurantName: store.profile.restaurantName,
        cuisine: store.profile.cuisine
        //Phone Number, Restaurant Name, Restaurant Image, Cuisine)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getProfile: (payload) => dispatch(getProfileAction(payload)),
        updateProfile: (payload) => dispatch(updateProfileAction(payload))
    };
}

//Profile of Owner (Profile Image, Name, Email, Phone Number, Restaurant Name, Restaurant Image, Cuisine)
class ConnectedOwnerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            restaurantName: "",
            cuisine: "",
            isLoggedIn: false,
            showNameDiv: true,
            showNameEditDiv: false,
            showEmailDiv: true,
            showEmailEditDiv: false,
            showPhoneNumberDiv: true,
            showPhoneNumberEditDiv: false,
            showRestaurantNameDiv: true,
            showRestaurantNameEditDiv: false,
            showCuisineDiv: true,
            showCuisineEditDiv: false,
            signUpSuccess: null,
            responseData: {}
        }
    }

    reset = () => {
        this.setState({
            signUpSuccess: null,
            showNameDiv: true,
            showNameEditDiv: false,
            showEmailDiv: true,
            showEmailEditDiv: false,
            showPhoneNumberDiv: true,
            showPhoneNumberEditDiv: false,
            showRestaurantNameDiv: true,
            showRestaurantNameEditDiv: false,
            showCuisineDiv: true,
            showCuisineEditDiv: false
        });
    };

    getProfile = (data) => {
        this.props.getProfile(data);
    };

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        console.log("name: " + name);
        console.log("value: " + value);
        this.setState({[name]: value});
    };

    enableNameEditDiv = (e) => {
        e.preventDefault();
        this.reset();
        this.setState({
            showNameDiv: false,
            showNameEditDiv: true
        });
    };

    enableNameDiv = (e) => {
        e.preventDefault();

        const payload = {
            userId: this.props.userId,
            userType: "owner",
            firstName: this.state.firstName,
            lastName: this.state.lastName
        };

        this.props.updateProfile(payload);
        const cookieData = cookie.load('cookie');
        cookieData.userType = "owner";
        this.props.getProfile(cookieData);

        this.reset();
        this.setState({
            showNameDiv: true,
            showNameEditDiv: false
        });
    };

    cancelNameEditDiv = (e) => {
        e.preventDefault();
        this.reset();
        this.setState({
            showNameDiv: true,
            showNameEditDiv: false
        });
    };

    enableEmailEditDiv = (e) => {
        e.preventDefault();
        this.reset();
        this.setState({
            showEmailDiv: false,
            showEmailEditDiv: true
        });
    };

    enableEmailDiv = (e) => {
        e.preventDefault();

        const payload = {
            userId: this.props.userId,
            userType: "owner",
            email: this.state.email
        };

        this.props.updateProfile(payload);
        const cookieData = cookie.load('cookie');
        cookieData.userType = "owner";
        this.props.getProfile(cookieData);

        this.reset();
        this.setState({
            showEmailDiv: true,
            showEmailEditDiv: false
        });
    };

    cancelEmailEditDiv = (e) => {
        e.preventDefault();
        this.reset();
        this.setState({
            showEmailDiv: true,
            showEmailEditDiv: false
        });
    };

    enablePhoneNumberEditDiv = (e) => {
        e.preventDefault();
        this.reset();
        this.setState({
            showPhoneNumberDiv: false,
            showPhoneNumberEditDiv: true,
        });
    };

    enablePhoneNumberDiv = (e) => {
        e.preventDefault();

        const payload = {
            userId: this.props.userId,
            userType: "owner",
            phonenumber: this.state.phoneNumber
        };

        this.props.updateProfile(payload);
        const cookieData = cookie.load('cookie');
        cookieData.userType = "owner";
        this.props.getProfile(cookieData);

        this.reset();
        this.setState({
            showPhoneNumberDiv: true,
            showPhoneNumberEditDiv: false
        });
    };

    cancelPhoneNumberEditDiv = (e) => {
        e.preventDefault();
        this.reset();
        this.setState({
            showPhoneNumberDiv: true,
            showPhoneNumberEditDiv: false
        });
    };


    enableRestaurantNameEditDiv = (e) => {
        e.preventDefault();
        this.reset();
        this.setState({
            showRestaurantNameDiv: false,
            showRestaurantNameEditDiv: true
        });
    };

    enableRestaurantNameDiv = (e) => {
        e.preventDefault();

        const payload = {
            userId: this.props.userId,
            userType: "owner",
            restaurantname: this.state.restaurantName
        };

        this.props.updateProfile(payload);
        this.props.getProfile(payload);

        this.reset();
        this.setState({
            showRestaurantNameDiv: true,
            showRestaurantNameEditDiv: false
        });
    };

    cancelRestaurantNameEditDiv = (e) => {
        e.preventDefault();
        this.reset();
        this.setState({
            showRestaurantNameDiv: true,
            showRestaurantNameEditDiv: false
        });
    };

    enableCuisineEditDiv = (e) => {
        e.preventDefault();
        this.reset();
        this.setState({
            showCuisineDiv: false,
            showCuisineEditDiv: true
        });
    };

    enableCuisineDiv = (e) => {
        e.preventDefault();

        const payload = {
            userId: this.props.userId,
            userType: "owner",
            cuisine: this.state.cuisine
        };

        this.props.updateProfile(payload);
        this.props.getProfile(payload);

        this.reset();
        this.setState({
            showCuisineDiv: true,
            showCuisineEditDiv: false
        });
    };

    cancelCuisineEditDiv = (e) => {
        e.preventDefault();
        this.reset();
        this.setState({
            showCuisineDiv: true,
            showCuisineEditDiv: false
        });
    };

    componentWillMount() {
        if (localStorage.getItem('userType') !== null) {
            console.log("Inside componentWillMount");
            const payload = {};
            payload.userId = localStorage.getItem('userId')
            payload.userType = "owner";

            this.getProfile(payload);
        }
    }

    //Profile of Owner (Profile Image, Name, Email, Phone Number, Restaurant Name, Restaurant Image, Cuisine)
    render() {
        let message;
        const redirectVar = (localStorage.getItem('userType') === null) ? <Redirect to="/home"/> : null;

        if (this.state.signUpSuccess != null && this.state.signUpSuccess) {
            message = <div className="success-signup"><span>Update was successful</span></div>
        }
        if (this.state.signUpSuccess != null && !this.state.signUpSuccess) {
            message = <div className="unsuccess-signup"><span>Update was unsuccessful</span></div>
        }

        return (
            <div>
                {/*{redirectVar}*/}
                {message}

                <div className="signUp">
                    <p className="signUp-text">Your account</p>
                    <br/>
                    <form className="form" onSubmit={this.signInBuyer}>
                        {this.state.showNameDiv &&
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">Name</label>
                                <label
                                    className="account-labels first-name-label">{this.props.firstName + " " + this.props.lastName}</label>
                            </div>
                            <div className="second-half">
                                <button type="submit" onClick={this.enableNameEditDiv} className="edit-btn">Edit
                                </button>
                            </div>
                        </div>
                        }

                        {this.state.showNameEditDiv &&
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">Edit name</label>
                                <label className="account-labels first-name-label">First Name</label>
                                <input onChange={this.handleUserInput} className="first-name account-input" type="text"
                                       name="firstName" required></input>
                                <label className="account-labels first-name-label">Last Name</label>
                                <input onChange={this.handleUserInput} className="first-name account-input" type="text"
                                       name="lastName" required></input>

                                <div className="row">
                                    <div className="inner-first-half">
                                        <button type="submit" onClick={this.enableNameDiv}
                                                className="inner-edit-btn">Update
                                        </button>
                                    </div>
                                    <div className="inner-second-half">
                                        <button type="submit" onClick={this.cancelNameEditDiv}
                                                className="inner-edit-btn">Cancel
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        }
                        <br/>

                        {this.state.showEmailDiv &&
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">Email</label>
                                <label className="account-labels first-name-label">{this.props.email}</label>
                            </div>
                            <div className="second-half">
                                <button type="submit" onClick={this.enableEmailEditDiv} className="edit-btn">Edit
                                </button>
                            </div>
                        </div>
                        }

                        {this.state.showEmailEditDiv &&
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">Edit email</label>
                                <label className="account-labels first-name-label">New email</label>
                                <input onChange={this.handleUserInput} className="first-name account-input" type="text"
                                       name="email" required></input>
                                {/*<label className="account-labels first-name-label">Confirm email</label>*/}
                                {/*<input onChange = {this.handleUserInput} className="first-name account-input" type="text" name="confirmEmail" required></input>*/}

                                <div className="row">
                                    <div className="inner-first-half">
                                        <button type="submit" onClick={this.enableEmailDiv}
                                                className="inner-edit-btn">Update
                                        </button>
                                    </div>
                                    <div className="inner-second-half">
                                        <button type="submit" onClick={this.cancelEmailEditDiv}
                                                className="inner-edit-btn">Cancel
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        }

                        <br/>

                        {this.state.showPhoneNumberDiv &&
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">Phone number</label>
                                <label className="account-labels first-name-label">{this.props.phoneNumber}</label>
                            </div>
                            <div className="second-half">
                                <button type="submit" onClick={this.enablePhoneNumberEditDiv}
                                        className="edit-btn">Edit
                                </button>
                            </div>
                        </div>}

                        {this.state.showPhoneNumberEditDiv &&
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">Edit phone number</label>
                                <label className="account-labels first-name-label">Phone number</label>
                                <input onChange={this.handleUserInput} className="first-name account-input" type="text"
                                       name="phoneNumber" required></input>

                                <div className="row">
                                    <div className="inner-first-half">
                                        <button type="submit" onClick={this.enablePhoneNumberDiv}
                                                className="inner-edit-btn">Update
                                        </button>
                                    </div>
                                    <div className="inner-second-half">
                                        <button type="submit" onClick={this.cancelPhoneNumberEditDiv}
                                                className="inner-edit-btn">Cancel
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>}

                        <br/>

                        {this.state.showRestaurantNameDiv &&
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">Restaurant name</label>
                                <label className="account-labels first-name-label">{this.props.restaurantName}</label>
                            </div>
                            <div className="second-half">
                                <button type="submit" onClick={this.enableRestaurantNameEditDiv}
                                        className="edit-btn">Edit
                                </button>
                            </div>
                        </div>}

                        {this.state.showRestaurantNameEditDiv &&
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">Edit restaurant name</label>
                                <label className="account-labels first-name-label">Restaurant name</label>
                                <input onChange={this.handleUserInput} className="first-name account-input" type="text"
                                       name="restaurantName" required></input>

                                <div className="row">
                                    <div className="inner-first-half">
                                        <button type="submit" onClick={this.enableRestaurantNameDiv}
                                                className="inner-edit-btn">Update
                                        </button>
                                    </div>
                                    <div className="inner-second-half">
                                        <button type="submit" onClick={this.cancelRestaurantNameEditDiv}
                                                className="inner-edit-btn">Cancel
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>}

                        <br/>

                        {/*asfasdasdasdas*/}

                        {this.state.showCuisineDiv &&
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">Cuisine</label>
                                <label className="account-labels first-name-label">{this.props.cuisine}</label>
                            </div>
                            <div className="second-half">
                                <button type="submit" onClick={this.enableCuisineEditDiv} className="edit-btn">Edit
                                </button>
                            </div>
                        </div>}

                        {this.state.showCuisineEditDiv &&
                        <div className="row">
                            <div className="first-half">
                                <label className="account-labels first-name-label">Edit cuisine</label>
                                <label className="account-labels first-name-label">Cuisine</label>
                                <input onChange={this.handleUserInput} className="first-name account-input" type="text"
                                       name="cuisine" required></input>

                                <div className="row">
                                    <div className="inner-first-half">
                                        <button type="submit" onClick={this.enableCuisineDiv}
                                                className="inner-edit-btn">Update
                                        </button>
                                    </div>
                                    <div className="inner-second-half">
                                        <button type="submit" onClick={this.cancelCuisineEditDiv}
                                                className="inner-edit-btn">Cancel
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>}

                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedOwnerProfile);