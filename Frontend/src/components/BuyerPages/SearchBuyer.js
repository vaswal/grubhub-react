import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../styles/Navbar.css';
import axios from 'axios';
import {Button, Card} from "react-bootstrap";
import {connect} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Checkbox from "./Checkbox";
import {searchItem, setFilteredRestaurants, pageChanged, placeOrder} from "../../js/actions/restaurantActions";

function mapStateToProps(store) {
    return {
        restaurants: store.restaurant.restaurants,
        filteredRestaurants: store.restaurant.filteredRestaurants,
        allCuisines: store.restaurant.allCuisines,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        searchItem: (payload) => dispatch(searchItem(payload)),
        setFilteredRestaurants: (payload) => dispatch(setFilteredRestaurants(payload)),
    };
}

class SearchBuyer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            searchTerm: null,
            redirectVar: null,
            sidebarOpen: true,
            selectedRestaurantId: null
        };

        this.state.checkboxes = this.props.allCuisines.reduce(
            (options, option) => ({
                ...options,
                [option]: false
            }),
            {}
        );

        this.createRestaurants = this.createRestaurants.bind(this);
        this.doFilter = this.doFilter.bind(this);
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

    createCheckboxes = () => this.props.allCuisines.map(this.createCheckbox);

    doFilter = formSubmitEvent => {
        formSubmitEvent.preventDefault();
        const selectedCuisines = new Set();

        Object.keys(this.state.checkboxes)
            .filter(checkbox => this.state.checkboxes[checkbox])
            .forEach(checkbox => {
                console.log(checkbox, "is selected.");
                selectedCuisines.add(checkbox);
            });

        const _filteredRestaurants = selectedCuisines.size === 0 ?
            this.props.restaurants :
            this.props.restaurants
            .filter(restaurant => {
                return (selectedCuisines.has(restaurant.cuisine))
            });

        this.props.setFilteredRestaurants(_filteredRestaurants);
    };

    goToRestaurant(restaurantId) {
        return e => {
            this.setState({redirectVar: true});
            this.setState({selectedRestaurantId: restaurantId});
        }
    }

    createRestaurants() {
        console.log("createRestaurants");
        console.log(this.props.restaurants);

        const allTabs = this.props.filteredRestaurants.map(restaurant => {
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
                        <form onSubmit={this.doFilter}>
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

        this.props.searchItem(payload);
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchBuyer);