sap.ui.define([
    "com/accenture/misempleados/Router",
    "com/accenture/misempleados/utils/Constants",
    "com/accenture/misempleados/utils/Services",
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Router, Constants, Services, Controller) {
		"use strict";

		return Router.extend("com.accenture.misempleados.controller.App", {
            
			onInit: function () {
                
                sap.ui.getCore().getEventBus().subscribe(Constants.BUS, "init", this.handleInitRequest, this);
                
            },
            

            handleInitRequest: function (oChannel, oEvent, oData) {
                
                this.createModels();
                this.callLoadData();
                
            },


            createModels: function () {
                Services.setModel(this.getOwnerComponent().getModel(Constants.EMPLOYEE_MODEL));
            },


            callLoadData: function () {
                
                let aPromises = this.getPromises();
                Promise.all(aPromises).then((aData) => {
                    
                    this.setData(aData);
                    
                    this.initApp();
                }).catch((oError) => {
                    sap.ui.core.BusyIndicator.hide();
                });
            },
            

            initApp: function () {
                this.getRouter().initialize();
            },


            callServiceLocations: function (resolve, reject) {
                let fnSuccess = (oData) => {
                    
                    oData.results.unshift({ID: "",city: ""});

                    resolve(oData);
                };
                let fnError = (oError) => {
                    reject(oError);
                };
                
                Services.getLocations(fnSuccess, fnError);
            },


            callServiceCategories: function (resolve, reject) {
                let fnSuccess = (oData) => {
                    
                    oData.results.unshift({descr: "", ID: "", name: ""});
                    resolve(oData);
                };
                let fnError = (oError) => {
                    reject(oError);
                };
                
                Services.getCategories(fnSuccess, fnError);
            },


            getPromises: function () {

                let aPromises = [];
                aPromises.push(new Promise((resolve, reject) => {
                    
                    this.callServiceLocations(resolve, reject);
                }));

                aPromises.push(new Promise((resolve, reject) => {
                    
                    this.callServiceCategories(resolve, reject);
                }));

                return aPromises;
            },


            setData: function (aData) {
                this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/EntityLocations", aData[0].results);
                this.getOwnerComponent().getModel(Constants.DATAMODEL).setProperty("/EntityCategories", aData[1].results);
            },


		});
	});
