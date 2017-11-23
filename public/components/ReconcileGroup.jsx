var React = require('react');
var API = require('API');
var ToggleButton = require('react-toggle-button');
var { ToastContainer, toast } = require('react-toastify');
var {Button} = require('react-bootstrap');
var FontAwesome = require('react-fontawesome');
import TextareaAutosize from 'react-autosize-textarea';
var cookie = require('react-cookies'); 
import Moment from 'react-moment';
var ReconcileGroup = React.createClass({
    getInitialState: function() {
        return ({
            Data: this.props.data,
            IsEditMode:this.props.isEditMode||false
        })   
    },
    setEditMode:function() {
        var prevState = this.state.IsEditMode;
        this.setState({
            IsEditMode:!prevState
        })
    },
    handleDelete: function() {
        this.props.handleDelete(this.state.Data);
    },
    onChange:function(e) {
        var data = this.state.Data;
        data[e.target.name] = e.target.value
        this.setState({
            Data: data})
    },
    showInput:function(name,isTextArea) {
        var data = this.state.Data;
        if (isTextArea != true)
            return (<input type="text" ref={name} name={name} value={data[name]} onChange={(e)=> {this.onChange(e)}}/>)
        else 
            return (<TextareaAutosize type="text" ref={name} name={name} value={data[name]} onChange={(e)=> {this.onChange(e)}}/>)
    },
    handleSave:function() {
        var data = this.state.Data;
        data.ResponseUserId = cookie.load('loginId');
        var that = this;
        API.saveReconcileGroup(data).then(function(response) {
            if (response.data > 0) {
                toast("Saved successfully!");
                if (data.Id == 0) {
                    data.Id = response.data;
                    data.CreatedDate = new Date();
                }
                    
                else
                    data.LastChangedDate = new Date();
                that.setState({
                    IsEditMode:false,
                    Data:data
                })
            }
                
        })
    },
    showDeleteBtn:function() {
        if (!this.state.IsEditMode)
        return (
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.handleDelete}><FontAwesome name="trash-o"/></Button>
        )
    },
    render: function() {
        var data = this.state.Data;
        return(
            <tr>
            <td>{this.state.IsEditMode?this.showInput("ReconcileGroupId"):data.ReconcileGroupId}</td>
            <td>{this.state.IsEditMode?this.showInput("ReconcileGroupName",true):data.ReconcileGroupName}</td>
            <td>{this.state.IsEditMode?this.showInput("ReconcileType"):data.ReconcileType}</td>
            <td>{this.state.IsEditMode?this.showInput("ReconcileTypeName",true):data.ReconcileTypeName}</td>
            <td>{this.state.IsEditMode?this.showInput("Sign"):data.Sign}</td>
            <td>{data.CreatedDate?<Moment format="YYYY-MM-DD H:m">{data.CreatedDate}</Moment>:""}</td>
            <td>{data.LastChangedDate?<Moment format="YYYY-MM-DD H:m">{data.LastChangedDate}</Moment>:""}</td>
            <td>{this.state.IsEditMode?cookie.load('loginName'):data.ResponsePerson}</td>
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
            {this.state.IsEditMode? <FontAwesome name='floppy-o' />:<FontAwesome name='pencil-square-o' />} 
        </Button>
        
        {this.showDeleteBtn()}
        </td>
            
          </tr>
        )
    }
})

module.exports = ReconcileGroup;