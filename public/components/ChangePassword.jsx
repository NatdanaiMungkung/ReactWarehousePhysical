var React = require('react');
var API = require('API');
var {Button,Grid,Row,Col} = require('react-bootstrap');
var {Router,Route} = require('react-router');
var cookie = require('react-cookies'); 
var { ToastContainer, toast } = require('react-toastify');
var Main = require('Main');

var ChangePassword = React.createClass({
    getInitialState:function() {
        return ({
            isSuccess:null,
            samePass:false
        })
    },
    componentWillMount:function() {
        
    },
    handleChangePassword:function(e) {
        e.preventDefault();
        var that = this;
        API.changePassword(cookie.load('loginName'),this.refs.oldPass.value,this.refs.newPass.value)
        .then(function(response) {
            if (response.data) {
                toast("Saved successfully!");
                that.setState({
                    isSuccess:response.data
                })
            }
            
            
        })
    },
    checkSamePass:function() {
        if (this.refs.newPass && this.refs.confPass && this.refs.oldPass) {
            if (this.refs.newPass.value == this.refs.confPass.value && this.refs.newPass.value != this.refs.oldPass.value)
            this.setState({
                samePass:true
            })
        }
        
    },
    renderForm:function() {
        var err = "current password incorrect";
        if (!this.state.isSuccess) {
            return (
                <Row>
                <form onSubmit={this.handleChangePassword}>
                <Col xs={12} md={4} mdOffset={4}>{this.state.isSuccess == false?err:""}</Col>
            <Col xs={12} md={4} mdOffset={4}>
                <input type="password" ref="oldPass" placeholder="Current Password" /></Col>
                <Col xs={12} md={4} mdOffset={4}>
                <input type="password" ref="newPass" onChange={this.checkSamePass} placeholder="New Password" /></Col>
                <Col xs={12} md={4} mdOffset={4}>
                <input type="password" ref="confPass" placeholder="Confirm Password" onChange={this.checkSamePass} /></Col>
                <Col xs={12} md={4} mdOffset={4}>
                {this.state.samePass?<Button type="submit" bsStyle="info" block>Change Password</Button>:""}</Col>
                </form>
                
            </Row>
            )
        } else if (this.state.isSuccess) {
            return (
            <Row><Col xs={12} md={4} mdOffset={4}>Change Password Success</Col></Row>
            )
        }
    },
    render:function() {
        return(
            <div >
                {this.renderForm()}
                <ToastContainer 
          position="top-center"
          type="default"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
            </div>
        )
    }
})

module.exports = ChangePassword;