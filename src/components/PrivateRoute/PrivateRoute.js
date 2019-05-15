import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserService } from '../../services';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        return !UserService.checkTokenExpired()
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    }} />
)

export default PrivateRoute;
