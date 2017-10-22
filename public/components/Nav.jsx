var React = require('react');
var {Link,IndexLink} = require('react-router');
var Nav = React.createClass({
    render: function() {
        return (
            <div className="top-bar">
                <div className="top-bar-left">
                    <ul className="menu">
                        <li className="menu-text">Warehouse Physical Count</li>
                        <li><IndexLink to='/' activeClassName="active-link">กระทบยอด</IndexLink></li>
                        <li><Link to='/masterdata' activeClassName="active-link">Master Data</Link></li>
                    </ul>
                </div>
                <div className="top-bar-right menu">
                    <span className="menu-text">Created By </span><a href="#">Natdanai Mungkung</a>
                </div>
            </div>
        );
    }
})

module.exports = Nav;