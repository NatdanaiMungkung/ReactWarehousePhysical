var React = require('react');
var Nav = require('Nav');
var cookie = require('react-cookies'); 
var Main = React.createClass({
    getInitialState:function(){
        return({
            loginName:cookie.load('loginName')||""
        })
    },
    render:function(){
        return(
            <div>
                    
                    <Nav loginName={this.state.loginName}/>
                    <div className="row">
                        <div className="columns  small-centered medium-6 large-4">
                            {this.props.children}
                        </div>
                    </div>
                    
                </div>
                
            );
    } 
}) 

module.exports = Main;