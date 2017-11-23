var axios = require('axios');
const request = require('superagent');
var cookie = require('react-cookies'); 
const API_URL = 'http://localhost:51797/';

//find?q=Bangkok&
module.exports = {
    getAPIURL:function() {
        return API_URL;
    },
    getUser: function() {
        var url = API_URL + "api/User";
        return axios.get(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    getAttribute: function() {
        var url = API_URL + "api/Attribute";
        return axios.get(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    getReconcileGroups: function() {
        var url = API_URL + "api/ReconcileGroup";
        return axios.get(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    getReconcileDistinctGroup: function() {
        var url = API_URL + "api/ReconcileGroup/getgroup/1";
        return axios.post(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    getStatuses: function() {
        var url = API_URL + "api/Status";
        return axios.get(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    getStandardPrices: function() {
        var url = API_URL + "api/StandardPrice";
        return axios.get(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    getIncompletedJobs: function() {
        var url = API_URL + "api/Job/GetIncompleted/" + cookie.load("loginId");
        return axios.get(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    getCompletedJobs: function() {
        var url = API_URL + "api/Job/GetCompleted/" + cookie.load("loginId");
        return axios.get(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    getSAPInput: function(data) {
        var url = API_URL + "api/SAPSave/" + data;
        return axios.get(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    getReconcileInput: function(data) {
        var url = API_URL + "api/ReconcileSave/" + data;
        return axios.get(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    getItileInput: function(data) {
        var url = API_URL + "api/ItileSave/" + data;
        return axios.get(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    saveUser: function(user) {
        var url = API_URL + "api/User";
        return axios.post(url,user).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    saveAttribute: function(user) {
        var url = API_URL + "api/Attribute";
        return axios.post(url,user).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    saveReconcileGroup: function(user) {
        var url = API_URL + "api/ReconcileGroup";
        return axios.post(url,user).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    saveStatus: function(user) {
        var url = API_URL + "api/Status";
        return axios.post(url,user).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    saveStandardPrice: function(user) {
        var url = API_URL + "api/StandardPrice";
        return axios.post(url,user).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    saveJob: function(data) {
        var url = API_URL + "api/Job";
        data.RequesterUserId = cookie.load('loginId');
        return axios.post(url,data).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    saveSAPInput: function(data) {
        var url = API_URL + "api/SAPSave";
        return axios.post(url,data).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    saveItileInput: function(data) {
        var url = API_URL + "api/ItileSave";
        return axios.post(url,data).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    saveReconcileInput: function(data) {
        var url = API_URL + "api/ReconcileSave";
        return axios.post(url,data).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    deleteAttribute: function(data) {
        
        var url = API_URL + "api/Attribute/delete/" + data.Id;
        return axios.post(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    deleteReconcileGroup: function(data) {
        
        var url = API_URL + "api/ReconcileGroup/delete/" + data.Id;
        return axios.post(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    deleteStatus: function(data) {
        
        var url = API_URL + "api/Status/delete/" + data.Id;
        return axios.post(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    deleteStandardPrice: function(data) {
        var url = API_URL + "api/StandardPrice/delete/" + data.Id;
        return axios.post(url).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    CheckLogin: function(user) {
        var url = API_URL + "api/Login";
        return axios.post(url,user).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },
    UploadReconcileExcel: function(data,callBack) {
        var url = API_URL + "api/ReconcileFile";
        return request.post(url)
        .attach("TEST", data[0])
        .end(callBack)
    },
    UploadSAPExcel: function(data,callBack) {
        var url = API_URL + "api/SAPFile";
        return request.post(url)
        .attach("TEST", data[0])
        .end(callBack)
    },
    UploadItileExcel: function(data,callBack) {
        var url = API_URL + "api/ItileFile";
        return request.post(url)
        .attach("TEST", data[0])
        .end(callBack)
    },
    changePassword:function(userName,oldPass,newPass) {
        var url = API_URL + "api/ChangePassword";
        return axios.post(url,{"userName":userName,"oldPass":oldPass,"newPass":newPass}).then(function(res) {
            return res;
        },function(res) {
            throw new Error(res.data.message);
        });
    },

}