var React = require('react');
var {Grid,Row,Col,Table} = require('react-bootstrap');
var API = require('API');
var Status = require('Status');
var {Button} = require('react-bootstrap');
var Statuses = React.createClass({
    getInitialState: function() {
        return ({
            Datas: [],
            value:false
        })   
    },
    componentDidMount: function() {
        var that = this;
        API.getStatuses().then(function(res) {
            that.setState({
                Datas:res.data
            })
        })
    },
    deleteData: function(data) {
        var that = this;
        var datas = this.state.Datas;
        API.deleteStatus(data).then(function(res) {
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
                    <Status data={data} isEditMode={data.Id == 0} handleDelete={that.deleteData}/>
            )
        }
        return (
            <Grid>
            <Row className="show-grid">
              <Col xs={12} md={10} mdOffset={1}>
              <Table striped bordered condensed hover>
    <thead>
      <tr>
        <th>Status Id</th>
        <th>Status Description</th>
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

module.exports = Statuses;