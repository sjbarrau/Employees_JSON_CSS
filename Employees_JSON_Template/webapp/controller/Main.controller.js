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

		return Router.extend("com.accenture.misempleados.controller.Main", {
			onInit: function () {

                this.getRouter().getRoute(Constants.MAIN_VIEW).attachMatched(this.onMatchedRoute, this);

            },

            onMatchedRoute: function () {
                
                this.callServiceEmployee();

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

            /* Funcion para llamar al Fragment de New Employee */
            _getDialogNewEmp: function () {
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment("com.accenture.misempleados.fragments.NewEmployee", this);
                    this.getView().addDependent(this._oDialog);
                    
                }

                return this._oDialog;
            },


            /* Abre el fragmento New Employee */
            onTableNewEmployee: function () {
                this._oDialog = sap.ui.xmlfragment("com.accenture.misempleados.fragments.NewEmployee", this);
                this.getView().addDependent(this._oDialog);

                let newEmployeeModel = new sap.ui.model.json.JSONModel({});
                this._oDialog.setModel(newEmployeeModel);
                
                this._oDialog.open();
                
            },


            /* Cierra el fragmento New Employee */
            onCloseDialog: function () {
                this._oDialog.close();
                this._oDialog.destroy();
                this._oDialog = undefined

            },

            onTableRefresh: function() {
                let oTable = this.getView().byId("tabla01");
                let oBinding = oTable.getBinding("items");
                oBinding.filter([]);

                this.getView().getModel(Constants.DATAMODEL).setProperty("/selected_location", "");
                this.getView().getModel(Constants.DATAMODEL).setProperty("/selected_category", "");
            },

            onSelectFilter: function() {
                let oTable = this.getView().byId("tabla01");
                let oBinding = oTable.getBinding("items");
                let sSeletedKey_location = this.getView().getModel(Constants.DATAMODEL).getProperty("/selected_location");
                let sSeletedKey_category = this.getView().getModel(Constants.DATAMODEL).getProperty("/selected_category");
                let aFilters = [];

                if (sSeletedKey_location) {
                    aFilters.push(
                        new Filter({
                        path: "location_ID", 
                        variable: "location", 
                        operator: FilterOperator.EQ,
                        value1: sSeletedKey_location
                        })
                    )
                }
                if (sSeletedKey_category) {
                    aFilters.push(
                        new Filter({
                        path: "category_ID",
                        variable: "Category",
                        operator: FilterOperator.EQ,
                        value1: sSeletedKey_category 
                        })
                    )
                }
                
                let allFilter = new Filter(aFilters, true);
                oBinding.filter(allFilter);
            },

            onAddNewEmployee: function() {

                let newEmployeeModel = this._oDialog.getModel().getData();

                const oEmployeeData = {
                    
                    employee_name:newEmployeeModel.employee_name,
                    location_ID:newEmployeeModel.location_ID,
                    category_ID:newEmployeeModel.category_ID,
                    profile_image:newEmployeeModel.profile_image,
                    employee_age:newEmployeeModel.employee_age,
                    employee_salary:newEmployeeModel.employee_salary
                };

                let oView = this.getView().getModel(Constants.EMPLOYEE_MODEL);
                oView.create("/Employees", oEmployeeData, {
                    success: function (data) {

                        this._oDialog.close();
                        const oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                        MessageToast.show(oBundle.getText("EmployeeCreated"));
                        this._oDialog.destroy();
                        this._oDialog = undefined
                        
                        this.callServiceEmployee();
                        
                        
                    }.bind(this)
                    , error: function (error) {

                        console.log(error)

                        let oErrorMessage = JSON.parse(error.messageText)

                        sap.m.MessageBox.error(oErrorMessage.content, {
                            title: "{i18n>Error}",
                            initialFocus: null
                        });
                    }
                })
                
            },

            onPressNavigation: function (oEvent) {

                let sPath = oEvent.getSource().getBindingContext(Constants.DATAMODEL).getPath();

                let oModifiedEmployee = this.getView().getModel(Constants.DATAMODEL).getProperty(sPath);

                this.getView().getModel(Constants.DATAMODEL).setProperty("/DetailEmployee", oModifiedEmployee);

                let aNewEntity = this.getView().getModel(Constants.DATAMODEL).getProperty("/DetailEmployee");

                this.getRouter().navTo("EmployeeProfile", {
                    employeeId: aNewEntity.ID
                });

            },

		});
	});
