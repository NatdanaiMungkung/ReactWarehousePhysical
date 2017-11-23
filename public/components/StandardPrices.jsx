var React = require('react');
var {Grid,Row,Col,Table} = require('react-bootstrap');
var API = require('API');
var StandardPrice = require('StandardPrice');
var {Button} = require('react-bootstrap');
var StandardPrices = React.createClass({
    getInitialState: function() {
        return ({
            Datas: [],
            value:false
        })   
    },
    componentDidMount: function() {
        var that = this;
        API.getStandardPrices().then(function(res) {
            that.setState({
                Datas:res.data
            })
        })
    },
    deleteData: function(data) {
        var that = this;
        var datas = this.state.Datas;
        API.deleteStandardPrice(data).then(function(res) {
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
            datas.push({Id:0})
            that.setState({
                Datas:datas
            })
            
        }
        function getData() {
            return datas.map(data=> 
                    <StandardPrice data={data} isEditMode={data.Id == 0} handleDelete={that.deleteData}/>
            )
        }
        return (
            <Grid>
            <Row className="show-grid">
              <Col xs={12} md={10} mdOffset={1}>
              <Table striped bordered condensed hover>
    <thead>
      <tr>
        <th>Plant</th>
        <th>Type</th>
        <th>Material Code</th>
        <th>Description</th>
        <th>UOM</th>
        <th>Price/Unit</th>
        <th>Currency</th>
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

module.exports = StandardPrices;