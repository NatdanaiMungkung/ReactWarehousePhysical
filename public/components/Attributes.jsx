var React = require('react');
var {Grid,Row,Col,Table} = require('react-bootstrap');
var API = require('API');
var Attribute = require('Attribute');
var {Button} = require('react-bootstrap');
//var ToggleButton = require('react-toggle-button')
var Attributes = React.createClass({
    getInitialState: function() {
        return ({
            Attribute: [],
            value:false
        })   
    },
    componentDidMount: function() {
        var that = this;
        API.getAttribute().then(function(res) {
            that.setState({
                Attribute:res.data
            })
        })
    },
    deleteAttribute: function(data) {
        var that = this;
        var attributes = this.state.Attribute;
        API.deleteAttribute(data).then(function(res) {
            if (res.data) {
                var index = attributes.indexOf(data);
                attributes.splice(index,1);
                that.setState({
                    Attribute:attributes
                })
            }
        })
    },
    render: function() {
        var that = this;
        var attributes = this.state.Attribute;
        function add() {
            //var users = this.state.User;
            attributes.push({Id:0})
            that.setState({
                Attribute:attributes
            })
            
        }
        function getAttribute() {
            return attributes.map(attribute=> 
                    <Attribute data={attribute} isEditMode={attribute.Id == 0} handleDelete={that.deleteAttribute}/>
            )
        }
        return (
            <Grid>
            <Row className="show-grid">
              <Col xs={12} md={10} mdOffset={1}>
              <Table striped bordered condensed hover>
    <thead>
      <tr>
        <th>Attribute</th>
        <th>Description</th>
        <th>WHDPlant</th>
        <th>WHDSloc</th>
        <th>WHEPlant</th>
        <th>WHESloc</th>
        <th>Operation</th>
      </tr>
    </thead>
    <tbody>
      {getAttribute()}
    </tbody>
  </Table>
              </Col>
            </Row>
            <Row>
                <Col xs={12} md={10} mdOffset={1}>
                    <Button bsStyle="info" onClick={add}  block>Add</Button>
                </Col>
            </Row>
            </Grid>
        )
    }
});

module.exports = Attributes;