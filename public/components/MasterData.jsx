var React = require('react');
var {Link} = require('react-router');
//var {Callout,Row,Column} = require('react-foundation');
var {Well,Grid,Row,Col} = require('react-bootstrap');
var MasterData = React.createClass({
    render: function() {
        return (

            <Grid>
            <Row className="show-grid">
              <Col xs={12} md={8} mdOffset={2}>
                        <Well bsSize="small">
                            <ul>
                            <li><Link to='/users' activeClassName="active-link">User</Link></li>
                            <li><Link to='/attributes' activeClassName="active-link">Attribute</Link></li>
                            <li><Link to='/reconcile' activeClassName="active-link">Reconcile Group</Link></li>
                            <li><Link to='/status' activeClassName="active-link">Status</Link></li>
                            <li><Link to='/standardprice' activeClassName="active-link">Standard Price</Link></li>
                        </ul>
                        </Well>
                </Col>
            </Row>
            </Grid>
            
        )
        
    }
})

module.exports = MasterData;