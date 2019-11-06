import React, {Component} from 'react';
import '../../styles/Profile.css';
import logo from '../../images/grubhub.svg';
import profileImage from '../../images/grubhub/blankProfile.png';
import {connect} from "react-redux";
import cookie from 'react-cookies';
import uuid from "uuid";
import {Redirect} from 'react-router';
import {getProfileAction, updateProfileAction} from "../../js/actions/profileActions";
import axios from 'axios';
import {HOSTNAME} from "../../components/Constants/Constants";

global.Buffer = global.Buffer || require('buffer').Buffer

function mapStateToProps(store) {
    return {
        userId: store.profile.userId,
        firstName: store.profile.firstName,
        lastName: store.profile.lastName,
        email: store.profile.email,
        imagePreviewUrl: store.profile.imagePreviewUrl
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getProfile: (payload) => dispatch(getProfileAction(payload)),
        updateProfile: (payload) => dispatch(updateProfileAction(payload)),
        //getProfileImage: (payload) => dispatch(getProfileImageAction(payload))
    };
}

class ConnectedBuyerProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            firstName: "",
            lastName: "",
            email: "",
            isLoggedIn: false,
            showNameDiv: true,
            showNameEditDiv: false,
            showEmailDiv: true,
            showEmailEditDiv: false,
            showImageEditDiv: false,
            signUpSuccess: null,
            responseData: {},
            image: logo,
            allowZoomOut: false,
            position: {x: 1.5, y: 1.5},
            scale: 1,
            rotate: 0,
            borderRadius: 0,
            width: 80,
            height: 80,
            imageName: "blankProfile.png",
            profileImage: profileImage,
            preview: profileImage,
            file: '',
            imagePreviewUrl: profileImage
        };

        this.handleNewImage = this.handleNewImage.bind(this);
        this._handleImageChange = this._handleImageChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    reset = () => {
        this.setState({
            signUpSuccess: null,
            showNameDiv: true,
            showNameEditDiv: false,
            showEmailDiv: true,
            showEmailEditDiv: false
        });
    };

    getProfileImage = (userId) => {
        const payload = {};
        payload.queryName = "GET_BUYER_IMAGE";
        payload.arguments = [userId];

        axios.post(`http://${HOSTNAME}:3001/profile/getImage`, payload)
            .then((response) => {
                if (response !== null) {
                    console.log("getProfileImage");
                    console.log(response.data);
                    if (response.data !== "nullImage") {
                        this.setState({imageName: response.data})
                    }

                    //var decoder = new TextDecoder('utf8');
                    //var b64encoded = btoa(decoder.decode(response));
                    //const bf = new Buffer.from(response.data, 'binary').toString('base64');
                    // const bf = new Buffer.from(response.data, 'base64');
                    // //const bf = Buffer.from(response.data, 'binary').toString('base64');
                    // console.log("bf")
                    // console.log(bf)

                    //this.setState({imagePreviewUrl: imageUrl});


                    //fs.writeFile(filename, data,  "binary", function(){...});
                }
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
            userType: "buyer",
            firstName: this.state.firstName,
            lastName: this.state.lastName
        };

        this.props.updateProfile(payload);
        const cookieData = cookie.load('cookie');
        cookieData.userType = "buyer";
        this.props.getProfile(cookieData);

        this.reset();
        this.setState({
            showNameDiv: true,
            showNameEditDiv: false
        });
    };

    cancelNameEditDiv = (e) => {
        e.preventDefault();
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
            userType: "buyer",
            email: this.state.email
        };

        this.props.updateProfile(payload);
        const cookieData = cookie.load('cookie');
        cookieData.userType = "buyer";
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

    handleNewImage = e => {
        this.setState({
            profileImage: e.target.files[0],
            preview: e.target.files[0]
        })
    };

    _handleSubmit(e) {
        e.preventDefault();

        const data = new FormData();
        console.log("filename");
        console.log(this.state.file.name);
        const extension = this.state.file.name.split(".")[1];

        data.append('file', this.state.file, (uuid() + "." + extension));
        data.append('userId', this.props.userId);
        data.append('queryName', "INSERT_BUYER_IMAGE");

        axios.post(`http://${HOSTNAME}:3001/profile/image`, data, {})
            .then(res => { // then print response status
                console.log(res.statusText)
            })
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };

        reader.readAsDataURL(file)
    }

    componentWillMount() {
        if (localStorage.getItem('userType') !== null) {
            console.log("Inside componentWillMount");
            const payload = {};
            payload.userType = "buyer";
            payload.userId = localStorage.getItem('userId');

            this.getProfile(payload);
            this.getProfileImage(localStorage.getItem('userId'));
        }
    }

    render() {
        let message;
        const redirectVar = (localStorage.getItem('userType') === null) ? <Redirect to="/home"/> : null;

        if (this.state.signUpSuccess != null && this.state.signUpSuccess) {
            message = <div className="success-signup"><span>Update was successful</span></div>
        }
        if (this.state.signUpSuccess != null && !this.state.signUpSuccess) {
            message = <div className="unsuccess-signup"><span>Update was unsuccessful</span></div>
        }

        let imagePreviewUrl = this.state.imagePreviewUrl;
        console.log("imagePreviewUrl");
        console.log(imagePreviewUrl);

        let $imagePreview = null;
        // if (imagePreviewUrl) {
        //     $imagePreview = (
        //         <div className="card-header"><img style={{width: "150px", height: "150px"}} src={imagePreviewUrl}/>
        //         </div>);
        // }

        if (imagePreviewUrl) {
            $imagePreview = (
                <div className="card-header"><img style={{width: "150px", height: "150px"}}
                                                  src={require(`../../images/grubhub/${this.state.imageName}`)}/>
                </div>);
        }

        return (
            <div>
                {/*{redirectVar}*/}
                {message}

                <div className="signUp">
                    <p className="signUp-text">Your account</p>
                    <br/>
                    <form className="form">
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
                                <input onChange={this.handleUserInput} class="form-control"
                                       className="first-name account-input" type="text" name="firstName"
                                       required></input>
                                <label className="account-labels first-name-label">Last Name</label>
                                <input onChange={this.handleUserInput} class="form-control"
                                       className="first-name account-input" type="text" name="lastName"
                                       required></input>

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
                        </div>}

                        {$imagePreview}
                        <input type="file" onChange={this._handleImageChange}/>
                        <button type="submit" onClick={this._handleSubmit} className="inner-edit-btn">Upload image
                        </button>

                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedBuyerProfile);