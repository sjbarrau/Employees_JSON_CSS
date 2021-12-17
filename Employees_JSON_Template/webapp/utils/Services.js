//Este fichero lo usamos para llamar a los servicios y obtener los datos o mandarselos
sap.ui.define("com.accenture.misempleados.utils.Services", [
],
    function () {
        'use strict';

        return {

            //Setear el modelo de datos, es traerse al contexto del core de la aplicación el metadata del sevicio raiz llamado con el dataSources en el manifest.
            setModel: function (oModel) {
                this.oModel = oModel;
            },

            getModel: function () {
                return this.oModel;
            },

            getEmployees: function () {
                return new Promise((resolve, reject) => {
                    let oServiceInfo = {
                        success: (oData) => {
                            resolve(oData);
                        },
                        error: (oError) => {
                            reject(oError);
                        }
                    };
                    this.getModel().read("/Employees", oServiceInfo);
                });
            },


            getLocations: function (fnSuccess, fnError) {
                let oServiceInfo = {
                    success: (oData) => {
                        if (fnSuccess) {
                            fnSuccess(oData);
                        }
                    },
                    error: (oError) => {
                        if (fnError) {
                            fnError(oError);
                        }
                    }
                };
                this.getModel().read("/Locations", oServiceInfo);
            },

            
            getCategories: function (fnSuccess, fnError) {
                let oServiceInfo = {
                    success: (oData) => {
                        if (fnSuccess) {
                            fnSuccess(oData);
                        }
                    },
                    error: (oError) => {
                        if (fnError) {
                            fnError(oError);
                        }
                    }
                };
                this.getModel().read("/Categories", oServiceInfo);
            }

        };
    }, true);
