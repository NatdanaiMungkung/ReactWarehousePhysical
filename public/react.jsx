var React = require('react');
var ReactDOM = require('react-dom');
var {Route,Router, IndexRoute, hashHistory} = require('react-router');
var Main = require('Main');
var MasterData = require('MasterData');
//Load foundation
require('style!css!foundation-sites/dist/css/foundation.min.css');
require('style!css!sass!ApplicationStyles');
$(document).foundation();
ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Main}>
        <Route path='masterdata' component={MasterData} />
        </Route>
    </Router>
    ,document.getElementById("app")
);