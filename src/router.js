import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import activityPage from './routes/activityPage';// 主页

const RouterConfig = ({ app, history }) => {
    return (
        <Router history={history}>
            <Switch>
                <Route path='/' component={activityPage} exact />
                <Route path='/activity/:activityId?' component={activityPage} exact />
                <Route path='/activity/:activityId?/' component={activityPage} exact />
            </Switch>
        </Router>
    );
};

export default RouterConfig;
