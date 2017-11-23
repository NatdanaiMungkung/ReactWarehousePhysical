var React = require('react');
var API = require('API');
var {Button,Grid,Row,Col} = require('react-bootstrap');
var {Router,Route} = require('react-router');
var cookie = require('react-cookies'); 
var Main = require('Main');

var Login = React.createClass({
    getInitialState:function() {
        return ({
            isSuccess:null
        })
    },
    componentWillMount:function() {
        
    },
    checkLogin:function(e) {
        e.preventDefault();
        var that = this;
        API.CheckLogin({ UserName: this.refs.Username.value, Password: this.refs.Password.value})
        .then(function(response) {
            if (response.data) {
                cookie.save('loginName', that.refs.Username.value);
                cookie.save('loginId', response.data.Id);
                cookie.save('isAdmin', response.data.IsAdmin);
                that.setState({
                    isSuccess:response.data
                })
                window.location.reload();
            } else {
                that.setState({
                    isSuccess:false
                })
            }
            
            
        })
    },
    renderForm:function() {
        var err = "Username or password incorrect";
        if (!this.state.isSuccess) {
            return (
                <Row>
                    <form onSubmit={this.checkLogin}>
                    <Col xs={12} md={4} mdOffset={4}>{this.state.isSuccess == false?err:""}</Col>
                <Col xs={12} md={4} mdOffset={4}>
                    <input type="text" ref="Username" placeholder="Username" /></Col>
                    <Col xs={12} md={4} mdOffset={4}>
                    <input type="password" ref="Password" placeholder="Password" /></Col>
                    <Col xs={12} md={4} mdOffset={4}>
                    <Button type="submit" bsStyle="info" block>Login</Button></Col>
                    </form>
                    
                </Row>
            )
        } else if (this.state.isSuccess) {
            return (
            //     <Router >
            //     <div>
            //       <Route path={"/"} component={Main} />
            //     </div>
            //   </Router>
            <Row><Col xs={12} md={4} mdOffset={4}>Login Success</Col></Row>
            )
        }
    },
    render:function() {
        return(
            <div >
                {this.renderForm()}
                
            </div>
        )
    }
})

module.exports = Login;