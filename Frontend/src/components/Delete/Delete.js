import React, {Component} from 'react';
import '../../App.css';
import {HOSTNMAE} from "../../components/Constants/Constants";
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Delete extends Component {
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            bookId: "",
            isDeleteBookComplete: false,
            isBookIdValid: false,
            deleteBookResponse: ""
        };

        //Bind the handlers to this class
        this.handleUserInput = this.handleUserInput.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
    }

    handleUserInput = (e) => {
        this.state.isDeleteBookComplete = false;

        const name = e.target.name;
        const value = e.target.value;
        console.log("name: " + name);
        console.log("value: " + value);
        this.setState({[name]: value}, () => {
            this.validateField(name, value)
        });
    };

    validateForm() {
        this.setState({formValid: this.state.isBookIdValid});
    }

    validateField = (fieldName, value) => {
        let isBookIdValid = this.state.isBookIdValid;
        isBookIdValid = /^[0-9]+$/.test(value);

        this.setState({isBookIdValid: isBookIdValid}, this.validateForm);
    };

    deleteBook = (e) => {
        e.preventDefault();
        console.log("Delete this.state.bookId: " + this.state.bookId);
        const data = {
            bookId: this.state.bookId
        };

        //set the with credentials to true
        //axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`http://${HOSTNMAE}:3001/delete`, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.state.deleteBookResponse = response.data;
                    this.setState({
                        authFlag: true
                    })
                } else {
                    this.setState({
                        authFlag: false
                    })
                }
            }).catch(error => {
            if (error.response) {
                console.log("Got error");
                console.log(error.response);
                this.state.deleteBookResponse = error.response;

                this.setState({
                    incorrectCredentials: true
                })
            }
        });

        this.state.isDeleteBookComplete = true;
    };

    renderRedirect = () => {
        if (!cookie.load('cookie')) {
            return <Redirect to="/login"/>
        }
    };

    render() {
        return (
            <div class="container">
                {this.renderRedirect()}
                <form>
                    <div style={{width: "50%", float: "left"}} class="form-group">
                        <input onChange={this.handleUserInput} type="text" class="form-control" name="bookId"
                               placeholder="Book Id"/>
                        {!this.state.isBookIdValid && (
                            <div style={{color: 'red'}}>Enter a unique non-empty numeric Book Id</div>)}
                    </div>
                    <div style={{width: "50%", float: "right"}}>
                        <button disabled={!this.state.formValid} onClick={this.deleteBook} class="btn btn-success"
                                type="submit">Delete
                        </button>
                    </div>

                    {this.state.isDeleteBookComplete && (
                        <div style={{color: 'red'}}>{this.state.deleteBookResponse}</div>)}
                </form>
            </div>
        )
    }
}

export default Delete;