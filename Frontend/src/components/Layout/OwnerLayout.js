import React, {Component} from 'react';
import {Switch} from 'react-router';
import {Route} from "react-router-dom";
import HomeOwner from '../Home/HomeOwner';

class OwnerLayout extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/homeOwner" component={HomeOwner}/>
                </Switch>
            </div>
        );
    }
}

export default OwnerLayout;