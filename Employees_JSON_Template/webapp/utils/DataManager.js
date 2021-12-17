//En este se usa para tratar datos, modificacion datos...
sap.ui.define([
     "com/accenture/misempleados/utils/Constants"
], function(Constants) {
	"use strict";
	return {

		add_LocationsName_CategoriesName: function(aEmployees, aLocations, aCategories) {

			aEmployees.forEach(oEmployee => {
                let oFindLocation = aLocations.find(oLocation => {
                                        return oLocation.ID === oEmployee.location_ID
                                    } );

                let oFindCategory = aCategories.find(oCategory => {
                    return oCategory.ID === oEmployee.category_ID
                } );

                oEmployee.Locations_name_Added_in_DataManager =  !!oFindLocation ? oFindLocation.city : "Locations.ID for this \n Employee.location_ID";
                oEmployee.Categories_name_Added_in_DataManager =  !!oFindCategory ? oFindCategory.name : "Categories.ID for this \n Employee.location_ID";
            });

            return aEmployees;
        }
	};
});
