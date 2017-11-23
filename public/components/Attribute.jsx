var React = require('react');
var API = require('API');
var ToggleButton = require('react-toggle-button');
var { ToastContainer, toast } = require('react-toastify');
var {Button} = require('react-bootstrap');
var FontAwesome = require('react-fontawesome');
import TextareaAutosize from 'react-autosize-textarea';
var Attribute = React.createClass({
    getInitialState: function() {
        return ({
            Attribute: this.props.data,
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
        this.props.handleDelete(this.state.Attribute);
    },
    onChange:function(e) {
        var attribute = this.state.Attribute;
        attribute[e.target.name] = e.target.value
        this.setState({
            Attribute: attribute})
    },
    showInput:function(name,isTextArea) {
        var data = this.state.Attribute;
        if (isTextArea != true)
            return (<input type="text" ref={name} name={name} value={data[name]} onChange={(e)=> {this.onChange(e)}}/>)
        else 
            return (<TextareaAutosize type="text" ref={name} name={name} value={data[name]} onChange={(e)=> {this.onChange(e)}}/>)
    },
    handleSave:function() {
        var attribute = this.state.Attribute;
        var that = this;
        API.saveAttribute(attribute).then(function(response) {
            if (response.data > 0) {
                toast("Saved successfully!");
                if (attribute.Id == 0)
                attribute.Id = response.data;
                that.setState({
                    IsEditMode:false,
                    Attribute:attribute
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
        var attribute = this.state.Attribute;
        return(
            <tr>
            <td>{this.state.IsEditMode?this.showInput("Attribute"):attribute.Attribute}</td>
            <td>{this.state.IsEditMode?this.showInput("Description",true):attribute.Description}</td>
            <td>{this.state.IsEditMode?this.showInput("WHDPlant"):attribute.WHDPlant}</td>
            <td>{this.state.IsEditMode?this.showInput("WHDSloc"):attribute.WHDSloc}</td>
            <td>{this.state.IsEditMode?this.showInput("WHEPlant"):attribute.WHEPlant}</td>
            <td>{this.state.IsEditMode?this.showInput("WHESloc"):attribute.WHESloc}</td>
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

module.exports = Attribute;