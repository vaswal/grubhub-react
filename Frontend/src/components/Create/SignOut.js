import React, {Component} from 'react';
import {Redirect} from 'react-router';

class SignOut extends Component {
    render() {
        console.log("Deleted cookie");
        localStorage.removeItem('token');
        localStorage.removeItem('_id');
        localStorage.removeItem('userType');

        return (
            <Redirect to="/home"/>
        )
    }
}

export default SignOut;