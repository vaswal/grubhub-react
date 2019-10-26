import {combineReducers} from 'redux';
import AccountReducer from './accountReducer';
import ProfileReducer from './profileReducer';
import RestaurantReducer from './restaurantReducer';
import OwnerReducer from './ownerReducer';

const rootReducer = combineReducers({
    account: AccountReducer,
    profile: ProfileReducer,
    restaurant: RestaurantReducer,
    owner: OwnerReducer
});

export default rootReducer;