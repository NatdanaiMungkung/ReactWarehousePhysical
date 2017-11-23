var React = require('react');
//var {Callout,Row,Column} = require('react-foundation');
var {Well,Grid,Row,Col,Tabs,Tab,Table} = require('react-bootstrap');
var Dropzone = require('react-dropzone'); 
var {Button,Jumbotron,ToggleButton,ButtonToolbar,ToggleButtonGroup} = require('react-bootstrap');
var { ToastContainer, toast } = require('react-toastify');
var API = require('API');
var ReactTable = require('react-table').default
var NumberFormat = require('react-number-format');
import { BarLoader } from 'react-spinners';
var Home = React.createClass({
    getInitialState: function() {
        return ({
            filesSap:[],
            filesReconcile:[],
            filesItile:[],
            resultReconcile:[],
            resultSAP:[],
            resultItile:[],
            resultCalculate:[],
            jobs:[],
            job:[],
            completedJobs:[],
            typeId:1,
            isUseNewJob:true,
            isLoading:false,
            AttributeMaster:[],
            isReconcileError:false,
            isSapError:false,
            isItileError:false,
            reconcileGroup:[],
            reconcileType:[],
            isAlreadySaveItile: false,
            itileExcelPath:null
        })
    },
    componentDidMount: function() {
      var that = this;
      API.getIncompletedJobs().then(function(res) {
        if (res.data.length > 0) {
          that.setState({
            jobs: res.data,
            job:res.data.filter((job)=> job.WarehouseType == 1)
          })
          API.getSAPInput(that.state.job[0].Id).then((res)=> {
            that.setState({
              resultSAP: res.data
            })
          })
          API.getReconcileInput(that.state.job[0].Id).then((res)=> {
            that.setState({
              resultReconcile: res.data
            })
          })
          API.getItileInput(that.state.job[0].Id).then((res)=> {
            that.setState({
              resultItile: res.data
            })
          })
        }
      })
      API.getCompletedJobs().then(function(res) {
        if (res.data.length > 0) {
          that.setState({
            completedJobs:res.data,
          })
        }
      })
      API.getReconcileGroups().then(function(res) {
        if (res.data.length > 0) {
          that.setState({
            reconcileType:res.data
          })
        }
      })
      API.getReconcileDistinctGroup().then(function(res) {
        if (res.data.length > 0) {
          that.setState({
            reconcileGroup:res.data
          })
        }
      })
      API.getAttribute().then((res)=> {
        if (res.data.length > 0) {
          that.setState({
            AttributeMaster:res.data
          })
        }
      })
      document.title = "Warehouse Physical Count";
    },
    onDrop: function(type,files) {
        if (files[0].name.match(/.xlsx/g)) {
          if (type == "SAP") {
            this.setState({
              filesSap:files,
              isSapError:false
            });
          }
            else if (type == "Reconcile") {
              this.setState({
                filesReconcile:files,
                isReconcileError:false
              });
            }
            else if (type == "ITile") {
              this.setState({
                filesItile:files,
                isItileError:false
              });
            }
        }
        
    },
    generateItileResult:function() {
      var that = this;
      API.generateItileResult().then((res) => {
        if (res.data) {
          var url = API.getAPIURL();
          that.setState({
            itileExcelPath:url + res.data
          })
        }
      })
    },
    handleUploadReconcile:function() {
      this.setState({
        resultReconcile:[],
        isLoading:true
      })
        var that = this;
        API.UploadReconcileExcel(this.state.filesReconcile,function(err,res) {
          res.body.forEach((row)=> {
            row.JobId = that.state.job[0].Id;
          })
            that.setState({
                resultReconcile:res.body,
                isLoading:false
            })
        })
    },
    handleUploadSAP:function() {
      this.setState({
        resultSAP:[],
        isLoading:true
      })
        var that = this;
        
        API.UploadSAPExcel(this.state.filesSap,function(err,res) {
            res.body.forEach((row)=> {
              row.JobId = that.state.job[0].Id;
            })
            that.setState({
                resultSAP:res.body,
                isLoading:false
            })
        })
    },
    handleUploadItile:function() {
      this.setState({
        resultItile:[],
        isLoading:true
      })
        var that = this;
        
        API.UploadItileExcel(this.state.filesItile,function(err,res) {
            res.body.forEach((row)=> {
              row.JobId = that.state.job[0].Id;
            })
            that.setState({
                resultItile:res.body,
                isLoading:false,
                isAlreadySaveItile:false
            })
        })
    },
    handleCreateJob:function() {
      var that = this;
      var reqModel = {
        Prefix: this.state.typeId == 1?"WHD":"WHE",
      }
      API.saveJob(reqModel).then(function(res) {
        var jobs = that.state.jobs;
        jobs.push(res.data);
        that.setState({
          job:[res.data],
          jobs:jobs,
          isUseNewJob:true
        })
      })
    },
    renderTableReconcile:function() {
      var job = this.state.job[0];
        const columns = [{
            Header: 'Job Name',
            accessor: 'JobName', // String-based value accessors!
            Cell: props=> ((props.value != job.JobName)?<div style={{color:'red'}}>{props.value}{this.setState({isReconcileError:true})}</div>:<div>{props.value}</div>)
          }, {
            Header: 'Plant',
            accessor: 'Plant',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
          }, {
            Header: 'Sloc',
            accessor: 'Sloc' // String-based value accessors!
          }, {
            Header: 'Material',
            accessor: 'MaterialCode' // String-based value accessors!
          },{
            Header: 'Material Description',
            accessor: 'MaterialDescription' // String-based value accessors!
          }, {
            Header: 'Batch',
            accessor: 'Batch' // String-based value accessors!
          }, {
            Header: 'Stock Type',
            accessor: 'StockType' // String-based value accessors!
          }, {
            Header: 'Rec Id',
            accessor: 'ReconcileTypeId' // String-based value accessors!
          }, {
            Header: 'Reconcile Type Name',
            accessor: 'ReconcileTypeName' // String-based value accessors!
          }, {
            Header: 'Sign',
            accessor: 'Sign' // String-based value accessors!
          }, {
            Header: 'Qty',
            accessor: 'Qty', // String-based value accessors!
            Cell: props=> (<div style={{textAlign:'right'}}><NumberFormat  value={props.value} displayType={'text'} thousandSeparator={true}  /></div>)
          }, {
            Header: 'Unit',
            accessor: 'Unit' // String-based value accessors!
          }, {
            Header: 'Reference Doc',
            accessor: 'ReferenceDoc' // String-based value accessors!
          }, {
            Header: 'Reference Item',
            accessor: 'ReferenceItem' // String-based value accessors!
          }, {
            Header: 'Reference Customer',
            accessor: 'ReferenceCustomer' // String-based value accessors!
          }, {
            Header: 'Reference Vendor',
            accessor: 'ReferenceVendor' // String-based value accessors!
          }, {
            Header: 'Reference UL',
            accessor: 'ReferenceUL' // String-based value accessors!
          }, {
            Header: 'Data Provider',
            accessor: 'DataProvider' // String-based value accessors!
          }
        ]
        return (<div><ReactTable
        data={this.state.resultReconcile}
        columns={columns}
        defaultPageSize={20}
          className="-striped -highlight" filterable="true"
      />{this.state.isReconcileError?<Button bsStyle="success" bsSize="xsmall" 
                        onClick={this.saveReconcileInput} block>Save Result</Button>:""}</div>)
    },
    renderTableSAP:function() {
      var job = this.state.job[0];
        const columns = [{
            Header: 'Job Name',
            accessor: 'JobName', // String-based value accessors!
            Cell: props=> ((props.value != job.JobName)?<div style={{color:'red'}}>{props.value}{this.setState({isSapError:true})}</div>:<div>{props.value}</div>)
          }, {
            Header: 'PhysInvDoc',
            accessor: 'PhysInvDoc',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
          }, {
            Header: 'Item',
            accessor: 'Item', // String-based value accessors!
            Cell: props=> (<div style={{textAlign:'right'}}>{props.value}</div>)
          }, {
            Header: 'Plant',
            accessor: 'Plant' // String-based value accessors!
          }, {
            Header: 'Sloc',
            accessor: 'Sloc' // String-based value accessors!
          }, {
            Header: 'Material',
            accessor: 'MaterialCode' // String-based value accessors!
          }, {
            Header: 'Material Description',
            accessor: 'MaterialDescription' // String-based value accessors! 
          }, {
            Header: 'Stock Type',
            accessor: 'StockType' // String-based value accessors!
          }, {
            Header: 'Batch',
            accessor: 'Batch' // String-based value accessors!
          }, {
            Header: 'Book Qty',
            accessor: 'BookQty', // String-based value accessors!
            Cell: props=> (<div style={{textAlign:'right'}}><NumberFormat  value={props.value} displayType={'text'} thousandSeparator={true}  /></div>)
          }, {
            Header: 'BUN',
            accessor: 'BUN' // String-based value accessors!
          }, {
            Header: 'Values',
            accessor: 'Values', // String-based value accessors!
            Cell: props=> (<div style={{textAlign:'right'}}><NumberFormat  value={props.value} displayType={'text'} thousandSeparator={true}  /></div>)
          },  {
            Header: 'Reference Doc',
            accessor: 'ReferenceDoc' // String-based value accessors!
          }, {
            Header: 'Reference Item',
            accessor: 'ReferenceItem' // String-based value accessors!
          }, {
            Header: 'Reference Customer',
            accessor: 'ReferenceCustomer' // String-based value accessors!
          }, {
            Header: 'Reference Vendor',
            accessor: 'ReferenceVendor' // String-based value accessors!
          }, {
            Header: 'Reference UL',
            accessor: 'ReferenceUL' // String-based value accessors!
          }, {
            Header: 'Data Provider',
            accessor: 'DataProvider' // String-based value accessors!
          }
        ]
        return (<div><ReactTable
        data={this.state.resultSAP}
        columns={columns}
        defaultPageSize={20}
          className="-striped -highlight" filterable="true"
      />
      {this.state.isSapError?<Button bsStyle="success" bsSize="xsmall" 
                        onClick={this.saveSAPInput} block>Save Result</Button>:""}</div>)
    },
    renderTableItile:function() {
      var job = this.state.job[0];
        const columns = [{
            Header: 'Job Name',
            accessor: 'JobName', // String-based value accessors!
            Cell: props=> ((props.value != job.JobName)?<div style={{color:'red'}}>{props.value}{this.setState({isItileError:true})}</div>:<div>{props.value}</div>)
          }, {
            Header: 'Physical Doc No',
            accessor: 'PhysicalDocumentNo',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
          }, {
            Header: 'Physical Doc Book No',
            accessor: 'PhysicalDocumentBookNo', // String-based value accessors!
            //Cell: props=> (<div style={{textAlign:'right'}}>{props.value}</div>)
          }, {
            Header: 'UL',
            accessor: 'UL' // String-based value accessors!
          }, {
            Header: 'Area',
            accessor: 'Area' // String-based value accessors!
          }, {
            Header: 'Position',
            accessor: 'Position' // String-based value accessors!
          }, {
            Header: 'Material',
            accessor: 'MaterialCode' // String-based value accessors! 
          }, {
            Header: 'Material Description',
            accessor: 'MaterialDescription' // String-based value accessors!
          }, {
            Header: 'Batch',
            accessor: 'Batch' // String-based value accessors!
          }, {
            Header: 'Qty',
            accessor: 'Qty', // String-based value accessors!
            Cell: props=> (<div style={{textAlign:'right'}}><NumberFormat  value={props.value} displayType={'text'} thousandSeparator={true}  /></div>)
          }, {
            Header: 'UM',
            accessor: 'UM' // String-based value accessors!
          }, {
            Header: 'Qty UM Stock',
            accessor: 'QtyUMStock', // String-based value accessors!
            Cell: props=> (<div style={{textAlign:'right'}}><NumberFormat  value={props.value} displayType={'text'} thousandSeparator={true}  /></div>)
          },  {
            Header: 'UM Stock',
            accessor: 'UMStock' // String-based value accessors!
          }, {
            Header: 'Attribute ID',
            accessor: 'AttributeID' // String-based value accessors!
          }, {
            Header: 'Attribute Description',
            accessor: 'AttributeDescription' // String-based value accessors!
          }, {
            Header: 'Create Date',
            accessor: 'CreationDate' // String-based value accessors!
          }, {
            Header: 'Days from Introduction',
            accessor: 'DaysFromIntroduction' // String-based value accessors!
          }, {
            Header: 'Tag',
            accessor: 'Tag' // String-based value accessors!
          }
        ]
        return (<div>
          {this.state.isAlreadySaveItile?<Button bsStyle="primary" 
          bsSize="small" onclick={this.generateItileResult} block>Generate Result</Button>:""}
          {this.state.itileExcelPath?<form method="get" action={this.state.itileExcelPath}><Button bsStyle="success" bsSize="small" block>Download Excel file</Button></form>:""}
          <ReactTable
        data={this.state.resultItile}
        columns={columns}
        defaultPageSize={20}
          className="-striped -highlight" filterable="true"
      />
      {this.state.isItileError?<Button bsStyle="success" bsSize="xsmall" 
                        onClick={this.saveItileInput} block>Save Result</Button>:""}</div>)
    },
    renderTableCalcuate:function() {
      var job = this.state.job[0];

      var reconcileColumns = [];
      this.state.reconcileGroup.forEach((group,index) => {
        reconcileColumns.push({
          Header: group.ReconcileGroupName,
          accessor: d => d.reconcile[group.ReconcileGroupId]
        })
      })
      const columns = [{
          Header: 'Job Name',
          accessor: 'JobName', // String-based value accessors!
          Cell: props=> ((props.value != job.JobName)?<div style={{color:'red'}}>{props.value}</div>:<div>{props.value}</div>)
        }, {
          Header: 'Physical Inv Doc',
          accessor: 'PhysInvDoc',
          //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
          Header: 'Item',
          accessor: 'Item', // String-based value accessors!
          //Cell: props=> (<div style={{textAlign:'right'}}>{props.value}</div>)
        }, {
          Header: 'Plant',
          accessor: 'Plant' // String-based value accessors!
        }, {
          Header: 'Sloc',
          accessor: 'Sloc' // String-based value accessors!
        }, {
          Header: 'Material',
          accessor: 'Material' // String-based value accessors!
        }, {
          Header: 'Material Description',
          accessor: 'MaterialDescription' // String-based value accessors! 
        }, {
          Header: 'Stock Type',
          accessor: 'StockType' // String-based value accessors!
        }, {
          Header: 'Batch',
          accessor: 'Batch' // String-based value accessors!
        }, {
          Header: 'Book (Bun)',
          accessor: 'BookBUN', // String-based value accessors!
          Cell: props=> (<div style={{textAlign:'right'}}><NumberFormat  value={props.value} displayType={'text'} thousandSeparator={true}  /></div>)
        }, {
          Header: 'BUN',
          accessor: 'BUN' // String-based value accessors!
        }, {
          Header: 'Book (Lun)',
          accessor: 'BookLUN', // String-based value accessors!
          Cell: props=> (<div style={{textAlign:'right'}}><NumberFormat  value={props.value} displayType={'text'} thousandSeparator={true}  /></div>)
        },  {
          Header: 'LUN',
          accessor: 'LUN' // String-based value accessors!
        }, {
          Header: 'Amount',
          accessor: 'Amount', // String-based value accessors!
          Cell: props=> (<div style={{textAlign:'right'}}><NumberFormat  value={props.value} displayType={'text'} thousandSeparator={true}  /></div>)
        }, {
          Header: 'ITile Qty (LUN)',
          accessor: 'ITileQtyLUN', // String-based value accessors!
          Cell: props=> (<div style={{textAlign:'right'}}><NumberFormat  value={props.value} displayType={'text'} thousandSeparator={true}  /></div>)
        }, 
        // {
        //   Header: 'Reconcile',
        //   columns: reconcileColumns // String-based value accessors!
        // }, 
        {
          Header: 'Sum Qty Count',
          accessor: 'SumReconcile' // String-based value accessors!
        }, {
          Header: 'Different',
          columns: [{Header: "Qty (lun)",accessor: "diffQty"}, {Header: "Amount", accessor: "diffAmount"}]
        }
      ]
      return (<div><ReactTable
      data={this.state.resultCalculate}
      columns={columns}
      defaultPageSize={20}
        className="-striped -highlight" filterable="true"
      />
    <Button bsStyle="success" bsSize="xsmall" 
                      onClick={this.saveItileInput} block>Save Result</Button></div>)
    },
    renderJobOption: function() {
      var jobs = this.state.completedJobs.filter((job)=> job.WarehouseType == this.state.typeId)
      return jobs.map((job) => <option value={job.Id}>{job.JobName}</option>)
    },
    loadPreviousJob: function(){
      var that = this;
      var job = React.findDOMNode(this.refs.previousJobSelected).value;
      this.setState({
        completedJobSelected:job
      })
      API.getSAPInput(job).then((res)=> {
        that.setState({
          resultSAP: res.data
        })
      })
      API.getReconcileInput(job).then((res)=> {
        that.setState({
          resultReconcile: res.data
        })
      })
      API.getItileInput(that.state.job[0].Id).then((res)=> {
        that.setState({
          resultItile: res.data
        })
      })
    },
    changeJobId:function(typeId,isUseNewJob) {
      var job = null;
      var that = this;
      if (isUseNewJob)
        job = this.state.jobs.filter((job)=> job.WarehouseType == typeId)
      else
        job = this.state.completedJobs.filter((job)=> job.WarehouseType == typeId)
      job = job.length > 0?job:[];
      this.setState({
        job:job,
        typeId: typeId
      })
      if (isUseNewJob && job.length > 0) {
        API.getSAPInput(job[0].Id).then((res)=> {
          that.setState({
            resultSAP: res.data
          })
        })
        API.getReconcileInput(job[0].Id).then((res)=> {
          that.setState({
            resultReconcile: res.data
          })
        })
        API.getItileInput(that.state.job[0].Id).then((res)=> {
          that.setState({
            resultItile: res.data
          })
        })
      }
    },
    handleChangeJob: function(job) {
      this.setState({completedJobSelected:job})
    },
    setIsUseNewJob:function() {
      var isUseNewJob = this.state.isUseNewJob;
      var that = this;
      this.setState({
        isUseNewJob:!isUseNewJob
      })
      if (!isUseNewJob) {
        this.changeJobId(this.state.typeId,!isUseNewJob);
      } else {
        this.setState({
          resultReconcile:[],
          resultSAP:[]
        })
      }
    },
    saveSAPInput: function() {
      API.saveSAPInput(this.state.resultSAP).then((res)=> {
        if (res.data) {
          toast("Saved successfully!");
        }
      })
    },
    saveItileInput: function () {
      var that = this;
      API.saveItileInput(this.state.resultItile).then((res)=> {
        if (res.data) {
          toast("Saved successfully!");
          that.setState({
            isAlreadySaveItile: true
          })
        }
      })
    },
    saveReconcileInput:function() {
      API.saveReconcileInput(this.state.resultReconcile).then((res)=> {
        if (res.data) {
          toast("Saved successfully!");
        }
      })
    },
    handleCalculate: function() {
      var that = this;
      var resultCalculate = [];
      var itileWHD = this.state.resultItile.filter((itile)=> {
        return itile.Area.indexOf('D.') == 0;
      })
      var itileWHE = this.state.resultItile.filter((itile)=> {
        return itile.Area.indexOf('E.') == 0;
      })
      var resultCalculate = [];
      var Sap8010List = this.state.resultSAP.filter((data)=> {
        return data.Sloc == "8010" && data.StockType == 'W'
      })

      var Sap8020List = this.state.resultSAP.filter((data) => {
        return data.Sloc == "8020"
      });

      var Sap8040PLTList = this.state.resultSAP.filter((data) => {
        return data.Sloc == "8040" && data.StockType == 'Q' && data.Batch.indexOf("T") == 0 && data.Batch.indexOf("TN") != 0
      });

      var Sap8040TNList = this.state.resultSAP.filter((data) => {
        return data.Sloc == "8040" && data.StockType == 'Q' && data.Batch.indexOf("TN-") == 0
      });

      var Sap8040FMFList = this.state.resultSAP.filter((data) => {
        return data.Sloc == "8040" && data.StockType == 'Q' && data.Batch.indexOf("FMF-") == 0
      });

      var Sap8110List = this.state.resultSAP.filter((data) => {
        return data.Sloc == "8110" && data.StockType == 'Q' && data.StockType == 'W' 
      });

      var attribute8010List = this.state.AttributeMaster.filter((att) => {
        return att.WHDSloc == '8010'
      });
      Sap8010List.forEach((sapData) => {
        var eachRowCalculate = {};
        eachRowCalculate.JobId = that.state.job[0].Id;
        eachRowCalculate.PhysInvDoc = sapData.PhysInvDoc;
        eachRowCalculate.Item = sapData.Item;
        eachRowCalculate.Plant = sapData.Plant;
        eachRowCalculate.Sloc = sapData.Sloc;
        eachRowCalculate.Material = sapData.MaterialCode;
        eachRowCalculate.MaterialDescription = sapData.MaterialDescription;
        eachRowCalculate.StockType = sapData.StockType;
        eachRowCalculate.Batch = sapData.Batch;
        eachRowCalculate.BookBUN = sapData.BookQty;
        eachRowCalculate.BUN = sapData.BUN;
        eachRowCalculate.BookLUN = 0;
        eachRowCalculate.LUN = "";
        eachRowCalculate.Amount = sapData.Values;
        var BUNToLUN = 0;
        var totalCountItile = 0;
        var totalCountItileStock = 0;
        //8010 concern only "W" type
        
          //Find attribute list 
          
          //Find itile that match attribute
          var itileList = itileWHD.filter((itile) => {
            var isMatchAttribute = attribute8010List.filter((att) => {
              return att.Attribute == itile.AttributeID
            }).length > 0;
            return itile.MaterialCode == sapData.MaterialCode && 
            itile.Batch == sapData.Batch &&
            isMatchAttribute
          });
          
          itileList.forEach((eachItile) => {
            eachRowCalculate.BookLUN = eachRowCalculate.BookLUN == 0?(eachItile.QtyUMStock / eachItile.Qty) * eachRowCalculate.BookBUN:eachRowCalculate.BookLUN;
            eachRowCalculate.LUN = eachRowCalculate.LUN == ""?eachItile.UMStock:eachRowCalculate.LUN;
            totalCountItile += eachItile.Qty;
            totalCountItileStock += eachItile.QtyUMStock;
          });




        eachRowCalculate.ITileQtyLUN = totalCountItileStock;
        eachRowCalculate.SumReconcile = totalCountItileStock; //TODO sum reconcile - ItileQtyLUN
        eachRowCalculate.diffQty = eachRowCalculate.BookLUN - eachRowCalculate.ITileQtyLUN;
        eachRowCalculate.diffAmount = (eachRowCalculate.BookLUN / eachRowCalculate.Amount) * eachRowCalculate.diffQty;
        resultCalculate.push(eachRowCalculate);
      })
      //  8020
      //var Sap8020Processed = [];
      var attributeList8020 = this.state.AttributeMaster.filter((att) => {
        return att.WHDSloc == "8020"
      });
      var itile8020TotalOfEachMat = [];
      itileWHD.forEach((itile) => {
        var isMatchAttribute = attributeList8020.filter((att) => {
          return att.Attribute == itile.AttributeID
        }).length > 0;
        if (isMatchAttribute) {
          var itile8020TotalFilter = itile8020TotalOfEachMat.filter((mat) => {
            return mat.MaterialCode == itile.MaterialCode && mat.Batch == itile.Batch
          });
          if (itile8020TotalFilter.length > 0) {
            itile8020TotalFilter[0].TotalQty += itile.Qty;
            itile8020TotalFilter[0].TotalQtyUM += itile.QtyUMStock;
          } else {
            itile8020TotalOfEachMat.push({
              MaterialCode: itile.MaterialCode,
              Batch: itile.Batch,
              TotalQty: itile.Qty,
              TotalQtyUM: itile.QtyUMStock,
              BUN: itile.UM,
              LUN: itile.UMStock
            })
          }
        }
      })

      var calculate8020 = function(sapData,itile,isLeaveQtyAsIs) {
        var eachRowCalculate = {};
        eachRowCalculate.JobId = that.state.job[0].Id;
        eachRowCalculate.PhysInvDoc = sapData.PhysInvDoc;
        eachRowCalculate.Item = sapData.Item;
        eachRowCalculate.Plant = sapData.Plant;
        eachRowCalculate.Sloc = sapData.Sloc;
        eachRowCalculate.Material = sapData.MaterialCode;
        eachRowCalculate.MaterialDescription = sapData.MaterialDescription;
        eachRowCalculate.StockType = sapData.StockType;
        eachRowCalculate.Batch = sapData.Batch;
        eachRowCalculate.BookBUN = sapData.BookQty;
        eachRowCalculate.BUN = sapData.BUN;
        eachRowCalculate.BookLUN = (itile.TotalQtyUM / itile.TotalQty) * eachRowCalculate.BookBUN;
        eachRowCalculate.LUN = itile.LUN;
        eachRowCalculate.Amount = sapData.Values;
        if (eachRowCalculate.Batch.indexOf("000") == 0 || itile.TotalQtyUM == 0)
          eachRowCalculate.ITileQtyLUN = 0;
        else {
          eachRowCalculate.ITileQtyLUN = isLeaveQtyAsIs?itile.TotalQtyUM:itile.TotalQtyUM > eachRowCalculate.LUN?eachRowCalculate.LUN:itile.TotalQtyUM;
          itile.TotalQtyUM = itile.TotalQtyUM > eachRowCalculate.LUN || !isLeaveQtyAsIs? itile.TotalQtyUM - eachRowCalculate.LUN:0;
        }
        
        eachRowCalculate.SumReconcile = itile.TotalQtyUM; //TODO sum reconcile - ItileQtyLUN
        eachRowCalculate.diffQty = eachRowCalculate.BookLUN - eachRowCalculate.ITileQtyLUN;
        eachRowCalculate.diffAmount = (eachRowCalculate.BookLUN / eachRowCalculate.Amount) * eachRowCalculate.diffQty;
        return eachRowCalculate;
      }

      // var sort8020 = function(a,b) {
      //   if (a.Batch.indexOf("DOM") >= 0) return -1;
      //   if (b.Batch.indexOf("DOM") >= 0) return 1;
      //   return a.BookQty - b.BookQty;
      // }


      itile8020TotalOfEachMat.forEach((itile) => {
        var sap8020filterW = Sap8020List.filter((sap) => {
          return (sap.MaterialCode == itile.MaterialCode && sap.StockType == 'W' && sap.Batch.indexOf("DOM") != 0)
        })
        var sap8020filterQ = Sap8020List.filter((sap) => {
          return (sap.MaterialCode == itile.MaterialCode && sap.StockType == 'Q' && sap.Batch.indexOf("DOM") != 0)
        })
        var sap8020filterB = Sap8020List.filter((sap) => {
          return (sap.MaterialCode == itile.MaterialCode && sap.StockType == 'B' && sap.Batch.indexOf("DOM") != 0)
        })

        var sap8020filterDOM = Sap8020List.filter((sap) => {
          return (sap.MaterialCode == itile.MaterialCode && sap.Batch.indexOf("DOM") == 0)
        })
        //var sap8020filterSorted = sap8020filterW.sort(sort8020);
      
        sap8020filterW.forEach((sapData) => {
          resultCalculate.push(calculate8020(sapData,itile,false));
        })

        //var sap8020filterSorted = sap8020filterQ.sort(sort8020);
        
        sap8020filterQ.forEach((sapData) => {
          resultCalculate.push(calculate8020(sapData,itile,false));
        })

        //var sap8020filterSorted = sap8020filterB.sort(sort8020);
        
        sap8020filterB.forEach((sapData) => {
          resultCalculate.push(calculate8020(sapData,itile,false));
        })

        sap8020filterDOM.forEach((sapData) => {
          resultCalculate.push(calculate8020(sapData,itile,true));
        })

      })
      

      //8040 PLT
      var attributeList8040PLT = this.state.AttributeMaster.filter((att) => {
        return att.Attribute == "8040-PLT"
      });

      var itile8040PLTTotalOfEachMatUL = [];
      itileWHD.forEach((itile) => {
        var isMatchAttribute = attributeList8040PLT.filter((att) => {
          return att.Attribute == itile.AttributeID
        }).length > 0;
        if (isMatchAttribute) {
          var itile8040PLTTotalFilter = itile8040PLTTotalOfEachMatUL.filter((mat) => {
            var batch = itile.Batch.charAt(0) == "T"?"T":"U"
            return mat.MaterialCode == itile.MaterialCode && mat.Batch == itile.Batch 
            && mat.UL == itile.UL && mat.Batch == batch;
          });
          if (itile8040PLTTotalFilter.length > 0) {
            itile8040PLTTotalFilter[0].TotalQty += itile.Qty;
            itile8040PLTTotalFilter[0].TotalQtyUM += itile.QtyUMStock;
          } else {
            itile8040PLTTotalOfEachMatUL.push({
              MaterialCode: itile.MaterialCode,
              Batch: itile.Batch.charAt(0) == "T"?"T":"U",
              TotalQty: itile.Qty,
              TotalQtyUM: itile.QtyUMStock,
              BUN: itile.UM,
              LUN: itile.UMStock,
              UL: itile.UL
            })
          }
        }
      })

      itile8040PLTTotalOfEachMatUL.forEach((itile) => {
        var sap8040PLTfilter = Sap8040PLTList.filter((sap) => {
          return (sap.MaterialCode == itile.MaterialCode && sap.Batch == itile.Batch + itile.UL.substring(2,4) + "-" + itile.UL.substring(5))
        })
        sap8040PLTfilter.forEach((sap) => {
          var eachRowCalculate = {};
          eachRowCalculate.JobId = that.state.job[0].Id;
          eachRowCalculate.PhysInvDoc = sapData.PhysInvDoc;
          eachRowCalculate.Item = sapData.Item;
          eachRowCalculate.Plant = sapData.Plant;
          eachRowCalculate.Sloc = sapData.Sloc;
          eachRowCalculate.Material = sapData.MaterialCode;
          eachRowCalculate.MaterialDescription = sapData.MaterialDescription;
          eachRowCalculate.StockType = sapData.StockType;
          eachRowCalculate.Batch = sapData.Batch;
          eachRowCalculate.BookBUN = sapData.BookQty;
          eachRowCalculate.BUN = sapData.BUN;
          eachRowCalculate.BookLUN = (itile.TotalQtyUM / itile.TotalQty) * eachRowCalculate.BookBUN;
          eachRowCalculate.LUN = itile.LUN;
          eachRowCalculate.Amount = sapData.Values;

            eachRowCalculate.ITileQtyLUN = itile.TotalQtyUM;
            itile.TotalQtyUM = 0;
          
          eachRowCalculate.SumReconcile = itile.TotalQtyUM; //TODO sum reconcile - ItileQtyLUN
          eachRowCalculate.diffQty = eachRowCalculate.BookLUN - eachRowCalculate.ITileQtyLUN;
          eachRowCalculate.diffAmount = (eachRowCalculate.BookLUN / eachRowCalculate.Amount) * eachRowCalculate.diffQty;
          resultCalculate.push(eachRowCalculate);
        })

      })
      //END 8040PLT

      //START 8040TN
      var attributeList8040TN = this.state.AttributeMaster.filter((att) => {
        return att.Attribute == "8040"
      });
      Sap8040TNList.forEach((sapData) => {
        var eachRowCalculate = {};
        eachRowCalculate.JobId = that.state.job[0].Id;
        eachRowCalculate.PhysInvDoc = sapData.PhysInvDoc;
        eachRowCalculate.Item = sapData.Item;
        eachRowCalculate.Plant = sapData.Plant;
        eachRowCalculate.Sloc = sapData.Sloc;
        eachRowCalculate.Material = sapData.MaterialCode;
        eachRowCalculate.MaterialDescription = sapData.MaterialDescription;
        eachRowCalculate.StockType = sapData.StockType;
        eachRowCalculate.Batch = sapData.Batch;
        eachRowCalculate.BookBUN = sapData.BookQty;
        eachRowCalculate.BUN = sapData.BUN;
        eachRowCalculate.BookLUN = 0;
        eachRowCalculate.LUN = "";
        eachRowCalculate.Amount = sapData.Values;
        var BUNToLUN = 0;
        var totalCountItile = 0;
        var totalCountItileStock = 0;
        //8040 concern only "W" type
        
          //Find attribute list 
          
          //Find itile that match attribute
          var itileList = itileWHD.filter((itile) => {
            var isMatchAttribute = attributeList8040TN.filter((att) => {
              return att.Attribute == itile.AttributeID
            }).length > 0;
            return itile.MaterialCode == sapData.MaterialCode && 
            "TN-" + itile.Batch == sapData.Batch &&
            isMatchAttribute
          });
          
          itileList.forEach((eachItile) => {
            eachRowCalculate.BookLUN = eachRowCalculate.BookLUN == 0?(eachItile.QtyUMStock / eachItile.Qty) * eachRowCalculate.BookBUN:eachRowCalculate.BookLUN;
            eachRowCalculate.LUN = eachRowCalculate.LUN == ""?eachItile.UMStock:eachRowCalculate.LUN;
            totalCountItile += eachItile.Qty;
            totalCountItileStock += eachItile.QtyUMStock;
          });




        eachRowCalculate.ITileQtyLUN = totalCountItileStock;
        eachRowCalculate.SumReconcile = totalCountItileStock; //TODO sum reconcile - ItileQtyLUN
        eachRowCalculate.diffQty = eachRowCalculate.BookLUN - eachRowCalculate.ITileQtyLUN;
        eachRowCalculate.diffAmount = (eachRowCalculate.BookLUN / eachRowCalculate.Amount) * eachRowCalculate.diffQty;
        resultCalculate.push(eachRowCalculate);
      })
      //END 8040TN

      //START 8040FMF
      var attributeList8040FMF = this.state.AttributeMaster.filter((att) => {
        return att.Attribute == "8040-FMF"
      });
      Sap8040FMFList.forEach((sapData) => {
        var eachRowCalculate = {};
        eachRowCalculate.JobId = that.state.job[0].Id;
        eachRowCalculate.PhysInvDoc = sapData.PhysInvDoc;
        eachRowCalculate.Item = sapData.Item;
        eachRowCalculate.Plant = sapData.Plant;
        eachRowCalculate.Sloc = sapData.Sloc;
        eachRowCalculate.Material = sapData.MaterialCode;
        eachRowCalculate.MaterialDescription = sapData.MaterialDescription;
        eachRowCalculate.StockType = sapData.StockType;
        eachRowCalculate.Batch = sapData.Batch;
        eachRowCalculate.BookBUN = sapData.BookQty;
        eachRowCalculate.BUN = sapData.BUN;
        eachRowCalculate.BookLUN = 0;
        eachRowCalculate.LUN = "";
        eachRowCalculate.Amount = sapData.Values;
        var BUNToLUN = 0;
        var totalCountItile = 0;
        var totalCountItileStock = 0;
        //8040 concern only "Q" type
        
          //Find attribute list 
          
          //Find itile that match attribute
          var itileList = itileWHD.filter((itile) => {
            var isMatchAttribute = attributeList8040FMF.filter((att) => {
              return att.Attribute == itile.AttributeID
            }).length > 0;
            return itile.MaterialCode == sapData.MaterialCode && 
            "FMF-" + itile.Batch == sapData.Batch &&
            isMatchAttribute
          });
          
          itileList.forEach((eachItile) => {
            eachRowCalculate.BookLUN = eachRowCalculate.BookLUN == 0?(eachItile.QtyUMStock / eachItile.Qty) * eachRowCalculate.BookBUN:eachRowCalculate.BookLUN;
            eachRowCalculate.LUN = eachRowCalculate.LUN == ""?eachItile.UMStock:eachRowCalculate.LUN;
            totalCountItile += eachItile.Qty;
            totalCountItileStock += eachItile.QtyUMStock;
          });




        eachRowCalculate.ITileQtyLUN = totalCountItileStock;
        eachRowCalculate.SumReconcile = totalCountItileStock; //TODO sum reconcile - ItileQtyLUN
        eachRowCalculate.diffQty = eachRowCalculate.BookLUN - eachRowCalculate.ITileQtyLUN;
        eachRowCalculate.diffAmount = (eachRowCalculate.BookLUN / eachRowCalculate.Amount) * eachRowCalculate.diffQty;
        resultCalculate.push(eachRowCalculate);
      })

      //END 8040FMF
      
      //START 8110
      var attribute8110List = this.state.AttributeMaster.filter((att) => {
        return att.WHESloc == '8110'
      });
      var itile8110TotalOfEachMat = [];
      itileWHE.forEach((itile) => {
        var isMatchAttribute = attribute8110List.filter((att) => {
          return att.Attribute == itile.AttributeID
        }).length > 0;
        if (isMatchAttribute) {
          var itile8110TotalFilter = itile8110TotalOfEachMat.filter((mat) => {
            return mat.MaterialCode == itile.MaterialCode && mat.Batch == itile.Batch
          });
          if (itile8110TotalFilter.length > 0) {
            itile8110TotalFilter[0].TotalQty += itile.Qty;
            itile8110TotalFilter[0].TotalQtyUM += itile.QtyUMStock;
          } else {
            itile8110TotalOfEachMat.push({
              MaterialCode: itile.MaterialCode,
              Batch: itile.Batch,
              TotalQty: itile.Qty,
              TotalQtyUM: itile.QtyUMStock,
              BUN: itile.UM,
              LUN: itile.UMStock
            })
          }
        }
      })

      var calculate8110 = function(sapData,itile,isLeaveQtyAsIs) {
        var eachRowCalculate = {};
        eachRowCalculate.JobId = that.state.job[0].Id;
        eachRowCalculate.PhysInvDoc = sapData.PhysInvDoc;
        eachRowCalculate.Item = sapData.Item;
        eachRowCalculate.Plant = sapData.Plant;
        eachRowCalculate.Sloc = sapData.Sloc;
        eachRowCalculate.Material = sapData.MaterialCode;
        eachRowCalculate.MaterialDescription = sapData.MaterialDescription;
        eachRowCalculate.StockType = sapData.StockType;
        eachRowCalculate.Batch = sapData.Batch;
        eachRowCalculate.BookBUN = sapData.BookQty;
        eachRowCalculate.BUN = sapData.BUN;
        eachRowCalculate.BookLUN = (itile.TotalQtyUM / itile.TotalQty) * eachRowCalculate.BookBUN;
        eachRowCalculate.LUN = itile.LUN;
        eachRowCalculate.Amount = sapData.Values;
        eachRowCalculate.ITileQtyLUN = isLeaveQtyAsIs?itile.TotalQtyUM:itile.TotalQtyUM > eachRowCalculate.LUN?eachRowCalculate.LUN:itile.TotalQtyUM;
        itile.TotalQtyUM = itile.TotalQtyUM > eachRowCalculate.LUN || !isLeaveQtyAsIs? itile.TotalQtyUM - eachRowCalculate.LUN:0;

        
        eachRowCalculate.SumReconcile = itile.TotalQtyUM; //TODO sum reconcile - ItileQtyLUN
        eachRowCalculate.diffQty = eachRowCalculate.BookLUN - eachRowCalculate.ITileQtyLUN;
        eachRowCalculate.diffAmount = (eachRowCalculate.BookLUN / eachRowCalculate.Amount) * eachRowCalculate.diffQty;
        return eachRowCalculate;
      }



      itile8110TotalOfEachMat.forEach((itile) => {
        var sap8110filterW = Sap8110List.filter((sap) => {
          return (sap.MaterialCode == itile.MaterialCode && sap.StockType == 'W')
        })
        var sap8110filterQ = Sap8110List.filter((sap) => {
          return (sap.MaterialCode == itile.MaterialCode && sap.StockType == 'Q')
        })
      
        sap8110filterQ.forEach((sapData) => {
          resultCalculate.push(calculate8110(sapData,itile,false));
        })
        
        sap8110filterW.forEach((sapData) => {
          resultCalculate.push(calculate8110(sapData,itile,true));
        })

      })

      //END 8110
      this.setState({
        resultCalculate : resultCalculate
      });
    },
    render: function() {
        var fullWidth = {
            width:"100%",
            height:"200px",
            borderWidth:"2px",
            borderColor:"#666",
            borderStyle:"dashed",
            borderRadius:"5px"
        }
        var fullWidthActive = {
            width:"100%",
            height:"200px",
            borderWidth:"2px",
            borderColor:"#rgb(102,204,102)",
            borderStyle:"solid",
            borderRadius:"5px",
            backgroundColor:"rgb(230,230,230)"
        }
        return (
            <Grid>
                <Tabs defaultActiveKey={0} id="uncontrolled-tab-example">
                  <Tab eventKey={0} title="JobID">
                  <Row>
                  <Col xs={12} md={4}>
                    <ButtonToolbar>
                    <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                      <ToggleButton value={1} onClick={this.changeJobId.bind(null,1,this.state.isUseNewJob)}>
                        WHD
                      </ToggleButton>
                      <ToggleButton value={2} onClick={this.changeJobId.bind(null,2,this.state.isUseNewJob)}>WHE</ToggleButton>
                    </ToggleButtonGroup>
                    </ButtonToolbar>
                  </Col>
                  <Col xs={12} md={4}>
                  
                  </Col>
                  </Row>
                  <Jumbotron style={{textAlign:"center"}}>
                  {this.state.isUseNewJob?<div><h1>Your last Job ID</h1>
    <h1 style={{color:"#96A36F"}}>{this.state.job.length > 0?this.state.job[0].JobName:""}</h1></div>:
    <select ref="previousJobSelected" value={this.state.completedJobSelected}>
                  {this.renderJobOption()}
                </select>}
    
    {this.state.job.length == 0?<p><Button bsStyle="primary" onClick={this.handleCreateJob}>Create New</Button></p>:""} 
    {this.state.isUseNewJob?<Button bsStyle="primary" onClick={this.setIsUseNewJob}>Select previous jobs</Button>:<div><Button bsStyle="primary" onClick={this.loadPreviousJob}>Load</Button> | <a onClick={this.setIsUseNewJob}>Back</a></div>}
  </Jumbotron>
                  </Tab>
                    {/* ITile */}
                    <Tab eventKey={1} title="Itile"><Row className="show-grid">
                    <Col xs={12} md={8} mdOffset={2}>
                            <div className="dropzone">
                        <Dropzone onDrop={this.onDrop.bind(null,"ITile")} 
                        style={fullWidth} activeStyle={fullWidthActive}
                        multiple="false" >
                        <Col xs={12} md={8} mdOffset={2}><h1>Drop ITile .xlsx file here</h1></Col>
                        </Dropzone>
                        </div>
                        <aside>
                        
                        <ul>
                            {
                            this.state.filesItile.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                            }
                        </ul>
                        </aside>
                        {this.state.filesItile.length > 0?<Button bsStyle="primary" bsSize="xsmall" 
                        onClick={this.handleUploadItile} block>Upload</Button>:""}
                                </Col>
                            </Row><Well>
                            {this.state.resultItile.length > 0? this.renderTableItile():<Col xs={12} md={2} mdOffset={5}> <BarLoader
          color={'#123abc'} 
          loading={this.state.isLoading} 
        /></Col>}</Well>
                    </Tab>
                    {/* SAP */}
                    <Tab eventKey={2} title="SAP">
                    <Row className="show-grid">
                            <Col xs={12} md={8} mdOffset={2}>
                            <div className="dropzone">
                        <Dropzone onDrop={this.onDrop.bind(null,"SAP")} 
                        style={fullWidth} activeStyle={fullWidthActive}
                        multiple="false" >
                        <Col xs={12} md={8} mdOffset={2}><h1>Drop SAP .xlsx file here</h1></Col>
                        </Dropzone>
                        </div>
                        <aside>
                        
                        <ul>
                            {
                            this.state.filesSap.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                            }
                        </ul>
                        </aside>
                        {this.state.filesSap.length > 0?<Button bsStyle="primary" bsSize="xsmall" 
                        onClick={this.handleUploadSAP} block>Upload</Button>:""}
                                </Col>
                            </Row><Well>
                            {this.state.resultSAP.length > 0? this.renderTableSAP():<Col xs={12} md={2} mdOffset={5}> <BarLoader
          color={'#123abc'} 
          loading={this.state.isLoading} 
        /></Col>}</Well>
                    </Tab>
                    {/* Reconcile */}
                    <Tab eventKey={3} title="Reconcile">
                        <Row className="show-grid">
                            <Col xs={12} md={8} mdOffset={2}>
                            <div className="dropzone">
                        <Dropzone onDrop={this.onDrop.bind(null,"Reconcile")} 
                        style={fullWidth} activeStyle={fullWidthActive}
                        multiple="false" >
                        <Col xs={12} md={8} mdOffset={2}><h1>Drop Reconcile .xlsx file here</h1></Col>
                        </Dropzone>
                        </div>
                        <aside>
                        
                        <ul>
                            {
                            this.state.filesReconcile.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                            }
                        </ul>
                        </aside>
                        {this.state.filesReconcile.length > 0?<Button bsStyle="primary" bsSize="xsmall" 
                        onClick={this.handleUploadReconcile} block>Upload</Button>:""}
                                </Col>
                            </Row><Well>
                            {this.state.resultReconcile.length > 0? this.renderTableReconcile():<Col xs={12} md={2} mdOffset={5}> <BarLoader
          color={'#123abc'} 
          loading={this.state.isLoading} 
        /></Col>}</Well>
                    </Tab>
                    {/* Result */}
                    <Tab eventKey={4} title="Result">
                    <Row className="show-grid">
                            <Col xs={12} md={8} mdOffset={2}>{this.state.resultItile.length > 0 && this.state.resultSAP.length > 0?
                            <Button bsStyle="primary" bsSize="small" 
                        onClick={this.handleCalculate} block>Calculate</Button>:""
                          }
                            </Col>
                            </Row><Well>
                            {/* {this.state.resultCalculate.length > 0? this.renderTableCalcuate():<Col xs={12} md={2} mdOffset={5}> <BarLoader
          color={'#123abc'} 
          loading={this.state.isLoading} 
        /></Col>} */}
        {this.renderTableCalcuate()}
        </Well>
                    
                    </Tab>
                </Tabs>
                <ToastContainer 
          position="top-center"
          type="default"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
            </Grid>
            
        )
        
    }
})

module.exports = Home;