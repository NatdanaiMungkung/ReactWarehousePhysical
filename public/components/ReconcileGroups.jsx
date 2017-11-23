var React = require('react');
var {Grid,Row,Col,Table} = require('react-bootstrap');
var API = require('API');
var ReconcileGroup = require('ReconcileGroup');
var {Button} = require('react-bootstrap');
var ReconcileGroups = React.createClass({
    getInitialState: function() {
        return ({
            Datas: [],
            value:false
        })   
    },
    componentDidMount: function() {
        var that = this;
        API.getReconcileGroups().then(function(res) {
            that.setState({
                Datas:res.data
            })
        })
    },
    deleteData: function(data) {
        var that = this;
        var datas = this.state.Datas;
        API.deleteReconcileGroup(data).then(function(res) {
            if (res.data) {
                var index = datas.indexOf(data);
                datas.splice(index,1);
                that.setState({
                    Datas:datas
                })
            }
        })
    },
    render: function() {
        var that = this;
        var datas = this.state.Datas;
        function add() {
            //var users = this.state.User;
            datas.push({Id:0})
            that.setState({
                Datas:datas
            })
            
        }
        function getData() {
            return datas.map(data=> 
                    <ReconcileGroup data={data} isEditMode={data.Id == 0} handleDelete={that.deleteData}/>
            )
        }
        return (
            <Grid>
            <Row className="show-grid">
              <Col xs={12} md={10} mdOffset={1}>
              <Table striped bordered condensed hover>
    <thead>
      <tr>
        <th>Reconcile Group Id</th>
        <th>Reconcile Group Name</th>
        <th>Reconcile Type</th>
        <th>Reconcile Type Name</th>
        <th>Sign</th>
        <th>Created Date</th>
        <th>Last Changed Date</th>
        <th>Response Person</th>
        <th>Operation</th>
      </tr>
    </thead>
    <tbody>
      {getData()}
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

module.exports = ReconcileGroups;