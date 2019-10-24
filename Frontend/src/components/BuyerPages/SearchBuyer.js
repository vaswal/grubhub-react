import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import '../../styles/Navbar.css';
import axios from 'axios';
import {Button, Card} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Checkbox from "./Checkbox";
import {HOSTNMAE} from "../../components/Constants/Constants";

class SearchBuyer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            searchTerm: null,
            redirectVar: null,
            sidebarOpen: true,
            selectedRestaurantId: null,
            allCuisines: [],
            restaurants: [],
            filteredRestaurants: []
        };

        this.state.checkboxes = this.state.allCuisines.reduce(
            (options, option) => ({
                ...options,
                [option]: false
            }),
            {}
        );

        this.createRestaurants = this.createRestaurants.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);


    }

    handleCheckboxChange = changeEvent => {
        const {name} = changeEvent.target;

        this.setState(prevState => ({
            checkboxes: {
                ...prevState.checkboxes,
                [name]: !prevState.checkboxes[name]
            }
        }));
    };

    createCheckbox = option => (
        <Checkbox
            label={option}
            key={option}
            isSelected={this.state.checkboxes[option]}
            onCheckboxChange={this.handleCheckboxChange}
        />
    );

    createCheckboxes = () => this.state.allCuisines.map(this.createCheckbox);

    handleFormSubmit = formSubmitEvent => {
        formSubmitEvent.preventDefault();
        const selectedCuisines = new Set();

        Object.keys(this.state.checkboxes)
            .filter(checkbox => this.state.checkboxes[checkbox])
            .forEach(checkbox => {
                console.log(checkbox, "is selected.");
                selectedCuisines.add(checkbox);
            });

        if (selectedCuisines.size === 0) {
            this.setState({filteredRestaurants: this.state.restaurants});
            return;
        }

        const _filteredRestaurants = this.state.restaurants.filter(restaurant => {
                return (selectedCuisines.has(restaurant.cuisine))
            }
        );

        this.setState({filteredRestaurants: _filteredRestaurants});
    };

    goToRestaurant(restaurantId) {
        return e => {
            this.setState({redirectVar: true});
            this.setState({selectedRestaurantId: restaurantId});
        }
    }

    createRestaurants() {
        console.log("createRestaurants");
        console.log(this.state.restaurants);

        const allTabs = this.state.filteredRestaurants.map(restaurant => {
            return (
                <li>
                    <div className="menu">
                        <form className="form">
                            <div className="x-div">
                                <div className='rowC'>
                                    <label className="account-labels menu-label">Name</label>
                                    <label style={{whiteSpace: 'nowrap'}} className="account-labels menu-label"
                                           name="name">{restaurant.restaurantName}</label>
                                </div>
                            </div>

                            <div className="email-div">
                                <div className='rowC'>
                                    <label className="account-labels menu-label">Cuisine</label>
                                    <label style={{whiteSpace: 'nowrap'}} className="account-labels desc-label"
                                           name="descriptionStored">{restaurant.cuisine}</label>
                                </div>
                            </div>

                            <div className="email-div">
                                <div className='rowC'>
                                    <label className="account-labels email-label">Phone</label>
                                    <label style={{whiteSpace: 'nowrap'}}
                                           className="account-labels email-label">{restaurant.phoneNumber}</label>
                                </div>
                            </div>

                            <div className='rowC'>
                                <Button type="button" variant="primary" className="menu-btn"
                                        onClick={this.goToRestaurant(restaurant._id)}>Order</Button>
                            </div>
                            <div>
                            </div>
                        </form>
                    </div>

                </li>
            );
        });


        return <div>
            <div className='rowC'>
                <Card style={{width: '18rem'}}>
                    <Card.Body>
                        <Card.Title>Filter by cuisine</Card.Title>
                        <form onSubmit={this.handleFormSubmit}>
                            {this.createCheckboxes()}
                            <Button type="submit" variant="primary">Filter</Button>
                        </form>
                    </Card.Body>
                </Card>

                <ul className="ul li">{allTabs}</ul>
            </div>
        </div>;
    }

    componentWillMount() {
        console.log("SearchBuyer");
        console.log(this.props.location.state);
        this.createRestaurants();

        const payload = {};
        payload.searchTerm = this.props.location.state.searchTerm;

        axios.post(`http://${HOSTNMAE}:3001/orders/menu_item/search`, payload)
            .then((response) => {
                console.log(response.data);
                this.setState({restaurants: response.data, filteredRestaurants: response.data});
                const _allCuisines = [...new Set(this.state.restaurants.map(({cuisine}) => cuisine))];
                this.setState({allCuisines: _allCuisines});
            })
            .catch((error) => {
            });
    }

    render() {
        return (
            <div>
                {this.state.redirectVar != null && <Redirect to={{
                    pathname: "/homeBuyer/restaurant",
                    state: {selectedRestaurantId: this.state.selectedRestaurantId}
                }}/>}
                <h1>Search page</h1>
                {this.createRestaurants()}
            </div>
        )
    }
}

export default SearchBuyer;