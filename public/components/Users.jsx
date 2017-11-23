var React = require('react');
var {Grid,Row,Col,Table} = require('react-bootstrap');
var API = require('API');
var User = require('User');
var {Button} = require('react-bootstrap');
//var ToggleButton = require('react-toggle-button')
var Users = React.createClass({
    getInitialState: function() {
        return ({
            User: [],
            value:false
        })   
    },
    componentDidMount: function() {
        var that = this;
        API.getUser().then(function(res) {
            that.setState({
                User:res.data
            })
        })
    },
    handleSetAdmin: function(user) {
        API.saveUser(user);
    },
    
    render: function() {
        var that = this;
        var users = this.state.User;
        function handleToggle (value) {
            self.setState({
                value: !value,
              })
        };
        function add() {
            //var users = this.state.User;
            users.push({Id:0})
            that.setState({
                User:users
            })
            
        }
        function getUser() {
            
            return users.map(user=> 
                    <User data={user} isEditMode={user.Id == 0}/>
            )
            //return data.map(i => <div>{i}</div>)
        }
        return (
            <Grid>
            <Row className="show-grid">
              <Col xs={12} md={8} mdOffset={2}>
              <Table striped bordered condensed hover>
    <thead>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
        <th>Password</th>
        <th>Enable</th>
        <th>Admin</th>
        <th>Operation</th>
      </tr>
    </thead>
    <tbody>
      {getUser()}
    </tbody>
  </Table>
              </Col>
            </Row>
            <Row>
                <Col xs={12} md={8} mdOffset={2}>
                    <Button bsStyle="info" onClick={add} block>Add</Button>
                </Col>
            </Row>
            </Grid>
        )
    }
});

module.exports = Users;