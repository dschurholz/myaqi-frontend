import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { utils } from '../../utils';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        utils.auth.getUser()
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)

export default PrivateRoute;
