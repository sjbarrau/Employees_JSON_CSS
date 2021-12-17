sap.ui.define([
    "com/accenture/misempleados/Router",
    "com/accenture/misempleados/utils/Constants",
    "com/accenture/misempleados/utils/Services",
    "com/accenture/misempleados/utils/DataManager",
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/DialogType",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/m/MessageToast',
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Router, Constants, Services, DataManager, Controller, Dialog, DialogType, Filter, FilterOperator, MessageToast) {
		"use strict";

		return Router.extend("com.accenture.misempleados.controller.EmployeeProfile", {
			onInit: function () {

                this.getRouter().getRoute("EmployeeProfile").attachMatched(this.onMatchedRoute, this);

            },

            onMatchedRoute: function (oEvent) {
                
                let oModel = this.getView().getModel(Constants.DATAMODEL)

                let aEmployees = oModel.getProperty("/DetailEmployee")
                let aLocations = oModel.getProperty("/EntityLocations")
                let currentLocation = aLocations.filter(x => x.ID === aEmployees.location_ID)
                oModel.setProperty("/currentLocation", currentLocation[0])

                let aCategories = oModel.getProperty("/EntityCategories")
                let currentCategory = aCategories.filter(x => x.ID === aEmployees.location_ID)
                oModel.setProperty("/currentCategory", currentCategory[0])
                

                this.getView().bindElement({
                    path: "jsonModel>/DetailEmployee"
                });

            },

            callServiceEmployee: function () {

                //recuperamos del dataModel las entidades Locations y Categories que guardamos en el App.Controller
                let aLocations = this.getView().getModel(Constants.DATAMODEL).getProperty("/EntityLocations");
                let aCategories = this.getView().getModel(Constants.DATAMODEL).getProperty("/EntityCategories");

                Services.getEmployees().then((oData) => {
                    let aEmployees = oData.results;

                    aEmployees = DataManager.add_LocationsName_CategoriesName(aEmployees, aLocations, aCategories);

                    this.getView().getModel(Constants.DATAMODEL).setProperty("/EntityEmployees", aEmployees);


                }).catch((oError) => {
                    console.log(oError);
                });
            },

            onCancelProfile: function (oEvent) {

                this.getRouter().navTo("Main");

            },
            

		});
	});
