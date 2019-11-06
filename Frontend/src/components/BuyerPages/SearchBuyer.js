import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../styles/Navbar.css';
import {Button, Card, Pagination} from "react-bootstrap";
import {connect} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Checkbox from "./Checkbox";
import {searchItem, setFilteredRestaurants, createPagesSearch, pageChangedSearch} from "../../js/actions/restaurantActions";

function mapStateToProps(store) {
    return {
        pageItemsSearch: store.restaurant.pageItemsSearch,
        todosPerPage: store.restaurant.todosPerPage,
        active: store.restaurant.active,
        restaurants: store.restaurant.restaurants,
        filteredRestaurants: store.restaurant.filteredRestaurants,
        allCuisines: store.restaurant.allCuisines,
        restaurantDivs: store.restaurant.restaurantDivs,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        searchItem: (payload) => dispatch(searchItem(payload)),
        setFilteredRestaurants: (payload) => dispatch(setFilteredRestaurants(payload)),
        createPagesSearch: (payload) => dispatch(createPagesSearch(payload)),
        pageChangedSearch: (payload) => dispatch(pageChangedSearch(payload)),
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
            selectedRestaurantId: null,
            pageItems: [],
            restaurantDivs: <div></div>
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

        const {active, todosPerPage} = this.props;

        // Logic for displaying todos
        const indexOfLastTodo = active * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = this.props.filteredRestaurants.slice(indexOfFirstTodo, indexOfLastTodo);

        console.log("this.props.filteredRestaurants");
        console.log(this.props.filteredRestaurants);
        console.log("createRestaurants numOfFilteredRestaurants: " + this.props.filteredRestaurants.length)

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
        //
        // this.setState({restaurantDivs: <div>
        //         <div className='rowC'>
        //             <Card style={{width: '18rem'}}>
        //                 <Card.Body>
        //                     <Card.Title>Filter by cuisine</Card.Title>
        //                     <form onSubmit={this.doFilter}>
        //                         {this.createCheckboxes()}
        //                         <Button type="submit" variant="primary">Filter</Button>
        //                     </form>
        //                 </Card.Body>
        //             </Card>
        //
        //             <ul className="ul li">{allTabs}</ul>
        //         </div>
        //     </div>})
    }

    pageChanged = (e) => {
        console.log("In pageChanged");
        console.log(e.target.text);

        // const newItems = createPages(state, state.currentTab, action.payload.pageNumber);
        //
        // return Object.assign({}, state, {
        //     active: action.payload.pageNumber,
        //     pageItems: newItems
        // });

        // const payload = {};
        // payload.pageNumber = parseInt(e.target.text, 10);
        // this.props.pageChanged(payload);
        const payload = {};
        payload.activePage = parseInt(e.target.text, 10);

        this.props.pageChangedSearch(payload);
        this.createRestaurants();
    }

    createPagesSearch(numOfFilteredRestaurants, activePage) {
        console.log("1numOfFilteredRestaurants: " + numOfFilteredRestaurants);
        const payload = {};
        payload.numOfFilteredRestaurants = numOfFilteredRestaurants;
        payload.activePage = activePage;

        this.props.createPagesSearch(payload);
        // console.log("numOfFilteredRestaurants: " + numOfFilteredRestaurants)
        // const newItems = [];
        // //const currentTab = state.tabs[action.payload.index];
        // const numberOfItems = numOfFilteredRestaurants;
        // const todosPerPage = this.props.todosPerPage;
        //
        // const numberOfPages = ((numberOfItems % todosPerPage) === 0) ? numberOfItems / todosPerPage : ((numberOfItems / todosPerPage) + 1)
        //
        // console.log("numberOfPages")
        // console.log(numberOfPages)
        //
        // for (let number = 1; number <= numberOfPages; number++) {
        //     //for (let number = 1; number <= 5; number++) {
        //     newItems.push(
        //         <Pagination.Item key={number} active={number === activePage}>
        //             {number}
        //         </Pagination.Item>,
        //     );
        // }
        //
        // this.setState({pageItems: newItems})

        //return newItems;
    }

    componentDidMount() {
        console.log("SearchBuyer");
        console.log(this.props.location.state);

        const payload = {};
        payload.searchTerm = this.props.location.state.searchTerm;

        this.props.searchItem(payload);
        this.createRestaurants();
        this.createPagesSearch(this.props.filteredRestaurants.length, 1);
    }

    render() {
        console.log("this.state.pageItems")
        console.log(this.state.pageItems)
        return (
            <div>
                {this.state.redirectVar != null && <Redirect to={{
                    pathname: "/homeBuyer/restaurant",
                    state: {selectedRestaurantId: this.state.selectedRestaurantId}
                }}/>}
                <h1>Search page</h1>
                {this.createRestaurants()}
                {/*{this.props.restaurantDivs}*/}
                <div>
                    <Pagination onClick={this.pageChanged}>{this.props.pageItemsSearch}</Pagination>
                    <br/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBuyer);