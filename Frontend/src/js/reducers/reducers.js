import {combineReducers} from 'redux';
import AccountReducer from './accountReducer';
import ProfileReducer from './profileReducer';
import RestaurantReducer from './restaurantReducer';

const rootReducer = combineReducers({
    account: AccountReducer,
    profile: ProfileReducer,
    restaurant: RestaurantReducer
});

export default rootReducer;