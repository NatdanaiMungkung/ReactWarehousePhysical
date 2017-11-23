var React = require('react');
var {Link,IndexLink} = require('react-router');
var {Foundation,Button,color,Colors} = require('react-foundation');
var {MenuItem} = require('react-bootstrap');
var {MenuItem,DropdownButton} = require('react-bootstrap');
var cookie = require('react-cookies'); 

var topBar = {
    marginBottom:'10px'
}
var Nav = React.createClass({
    getInitialState:function() {
        return ({
            loginName:this.props.loginName
        })
    },
    handleLogout:function() {
        cookie.remove('loginName');
        window.location.reload();
    },
    render: function() {
        return (
            <div className="top-bar" style={topBar}>
                <div className="top-bar-left">
                    <ul className="dropdown menu" data-dropdown-menu>
                        <li className="menu-text">Warehouse Physical Count</li>
                        <li><IndexLink to='/' activeClassName="active-link">กระทบยอด</IndexLink></li>
                        <li><Link to='/masterdata' activeClassName="active-link">Master Data</Link></li>
                    </ul>
                </div>
                
                <div className="top-bar-right menu">
                <DropdownButton title={this.state.loginName} pullRight>
                <MenuItem><Link to='/changepass' activeClassName="active-link">Change Password</Link></MenuItem>
                <MenuItem onClick={this.handleLogout}>Log Out</MenuItem>
              </DropdownButton>
                    
                </div>
            </div>
        );
    }
})

module.exports = Nav;