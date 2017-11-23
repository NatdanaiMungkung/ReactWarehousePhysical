var React = require('react');
var ReactDOM = require('react-dom');
var {Route,Router, IndexRoute, hashHistory} = require('react-router');
var Main = require('Main');
var Home = require('Home');
var MasterData = require('MasterData');
var Users = require('Users');
var Login = require('Login');
var Attributes = require('Attributes');
var ReconcileGroups = require('ReconcileGroups');
var Statuses = require('Statuses');
var ChangePassword = require('ChangePassword');
var StandardPrices = require('StandardPrices')
var cookie = require('react-cookies'); 
//Load foundation
require('style!css!foundation-sites/dist/css/foundation.min.css');
require('style!css!sass!ApplicationStyles');
require('style!css!toast');
//require("style!css!style.css")
$(document).foundation();
ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Main}>
        <Route path='masterdata' component={cookie.load('loginName')?MasterData:Login} />
        <Route path='users' component={cookie.load('loginName')?Users:Login}/>
        <Route path='attributes' component={cookie.load('loginName')?Attributes:Login}/>
        <Route path='reconcile' component={cookie.load('loginName')?ReconcileGroups:Login}/>
        <Route path='status' component={cookie.load('loginName')?Statuses:Login}/>
        <Route path='standardprice' component={cookie.load('loginName')?StandardPrices:Login}/>
        <Route path='login' component={Login}/>
        <Route path='changepass' component={cookie.load('loginName')?ChangePassword:Login}/>
        <IndexRoute component={cookie.load('loginName')?Home:Login}/>
        </Route>
    </Router>
    ,document.getElementById("app")
);