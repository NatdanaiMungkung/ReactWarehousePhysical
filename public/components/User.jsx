var React = require('react');
var API = require('API');
var ToggleButton = require('react-toggle-button');
var { ToastContainer, toast } = require('react-toastify');
var {Button} = require('react-bootstrap');
var FontAwesome = require('react-fontawesome');
import TextareaAutosize from 'react-autosize-textarea';
const ToggleType = {Enable:1,IsAdmin:2};
var User = React.createClass({
    getInitialState: function() {
        return ({
            User: this.props.data,
            IsEditMode:this.props.isEditMode||false
        })   
    },
    handleToggleEnable:function(data) {
        var user = this.state.User;
        user.Enable = !user.Enable;
        this.setState({
            User:user
        })
        API.saveUser(user).then(function(response) {
            if (response.data > 0)
                toast("Saved successfully!");
        })
    },
    handleToggleAdmin:function(data) {
        var user = this.state.User;
        user.IsAdmin = !user.IsAdmin;
        this.setState({
            User:user
        })
        API.saveUser(user).then(function(response) {
            if (response.data > 0)
                toast("Saved successfully!");
        })
        
    },
    setEditMode:function() {
        var prevState = this.state.IsEditMode;
        this.setState({
            IsEditMode:!prevState
        })
    },
    onChange:function(e) {
        var user = this.state.User;
        user[e.target.name] = e.target.value
        this.setState({
            User: user})
    },
    showInput:function(name,isTextArea) {
        var data = this.state.User;
        if (isTextArea != true)
            return (<input type="text" ref={name} name={name} value={data[name]} onChange={(e)=> {this.onChange(e)}}/>)
        else 
            return (<TextareaAutosize type="text" ref={name} name={name} value={data[name]} onChange={(e)=> {this.onChange(e)}}/>)
    },
    handleSave:function() {
        var user = this.state.User;
        user.FirstName = this.refs.FirstName.value;
        var that = this;
        API.saveUser(user).then(function(response) {
            if (response.data > 0) {
                toast("Saved successfully!");
                if (user.Id == 0)
                user.Id = response.data;
                that.setState({
                    IsEditMode:false,
                    User:user
                })
            }
                
        })
    },
    render: function() {
        var user = this.state.User;
        return(
            <tr>
            <td>{this.state.IsEditMode?this.showInput("FirstName"):user.FirstName}</td>
            <td>{this.state.IsEditMode?this.showInput("LastName"):user.LastName}</td>
            <td>{this.state.IsEditMode?this.showInput("UserName"):user.UserName}</td>
            <td>{this.state.IsEditMode?this.showInput("PassWord"):user.PassWord}</td>
            <td><ToggleButton
value={ user.Enable || false} onToggle={this.handleToggleEnable}
  /></td>
            <td><ToggleButton
value={ user.IsAdmin || false} onToggle={this.handleToggleAdmin} /></td>
            <td><ToastContainer 
          position="top-center"
          type="default"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
        <Button bsStyle="primary" bsSize="xsmall" 
        onClick={this.state.IsEditMode?this.handleSave:this.setEditMode}>
        {this.state.IsEditMode? <FontAwesome name='floppy-o' />:<FontAwesome name='pencil-square-o' />} </Button>
        </td>
            
          </tr>
        )
    }
})

module.exports = User;