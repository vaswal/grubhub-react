import React, {Component} from 'react';
import {Switch} from 'react-router';
import {Route} from "react-router-dom";
import HomeBuyer from '../Home/HomeBuyer';

class BuyerLayout extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/homeBuyer" component={HomeBuyer}/>
                </Switch>
            </div>
        );
    }
}

export default BuyerLayout;