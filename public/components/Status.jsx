var React = require('react');
var API = require('API');
var ToggleButton = require('react-toggle-button');
var { ToastContainer, toast } = require('react-toastify');
var {Button} = require('react-bootstrap');
var FontAwesome = require('react-fontawesome');
var Status = React.createClass({
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
    showInput:function(name) {
        var data = this.state.Data;
        return (<input type="text" ref={name} name={name} value={data[name]} onChange={(e)=> {this.onChange(e)}}/>)
    },
    handleSave:function() {
        var data = this.state.Data;
        var that = this;
        API.saveStatus(data).then(function(response) {
            if (response.data > 0) {
                toast("Saved successfully!");
                if (data.Id == 0)
                    data.Id = response.data;
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
            <td>{this.state.IsEditMode?this.showInput("StatusId"):data.StatusId}</td>
            <td>{this.state.IsEditMode?this.showInput("StatusDescription"):data.StatusDescription}</td>
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
        {this.showDeleteBtn()}
        </td>
            
          </tr>
        )
    }
})

module.exports = Status;