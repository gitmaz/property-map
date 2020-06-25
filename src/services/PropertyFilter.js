let PropertyFilter= function(name) {

    function init(){

    }

    // eslint-disable-next-line no-unused-vars
    let geoKeyTranslation= {
        projectId: "Project ID",
            title: "Title",
            type: "Type",
            address: "Address",
            suburb: "Suburb",
            state: "State",
            stage: "Stage",
            category: "Category",
            subCategory: "SubCategory",
            status: "Status",
            council: "Council",
            devType: "Dev. Type",
            floorArea: "Floor Area",
            siteArea: "Site Area",
            storeys: "Storeys",
            units: "Units",
            commenceDate: "Commence Date",
            completionDate: "Completion Date",
            lastUpdate: "Last Updated",
            value: "Value",
            ownership: "Ownership",
            description: "Description",
            notes: "Notes",
            additionalDetails: "Additional Details",
            lat: "Lat",
            long: "Long"
    }

    let applyFilters=function(geos, conditionsObject) {

        //if no filter applied, only extract project data from geos
        if (conditionsObject == null) {
            let results = geos.features.map(function (feature) {
                return feature.properties.project
            })
            return results
        }
        
        let me = this
        let rawResults = geos.features.map(function (feature) {

            let columnNames = Object.keys(conditionsObject)
            let conditions = Object.values(conditionsObject)
            let condition1
            let conditionTerm2
            let condition2

            //todo, bring eval inside te loop to break early as soon as a condition fails
            let fullConditionPhrase = ""
            for (let i in columnNames) {

                let columnName = columnNames[i]
                let columnValue = feature.properties.project[me.geoKeyTranslation[columnName]]
                let conditionObj = conditions[i]
                let conditionType = conditionObj.type
                // eslint-disable-next-line no-unused-vars
                let condition = conditionObj.value
                let conditionTerm = conditionObj.term
                let opTranslated = conditionObj.opTranslated

                switch (conditionType) {
                    case "date":

                        //this block is for comparison on fields of type date using special preparation to make dates comparative
                        columnValue = me.getPreparedtDate(columnValue)
                        if (opTranslated == "><") {

                            condition1 = ">" + me.getPreparedtDate(conditionTerm)
                            conditionTerm2 = conditionObj.term2
                            condition2 = "<=" + me.getPreparedtDate(conditionTerm2)
                            fullConditionPhrase += (i == 0 ? "" : " && ") + "(" + columnValue + condition1 + ") && (" + columnValue + condition2 + ")"
                        } else {
                            condition = opTranslated + me.getPreparedtDate(conditionTerm)
                            fullConditionPhrase += (i == 0 ? "" : " && ") + "(" + columnValue + condition + ")"
                        }
                        break
                    case "lookup":
                    case "text":

                        // this is a temporary bypass to remove the crash happening if textual data contains single quote
                        //todo: do the same replace on filterTerm input for filter to also work for a those cases
                        columnValue=columnValue.replace("'", "__single_qoute__");
                        //console.log(columnValue)

                        if (condition.startsWith("startsWith")) {

                            //this block is for string comparisons using startsWith
                            const startsWithRegex = new RegExp('^' + conditionTerm, 'i')
                            let startsWitOk = startsWithRegex.test(columnValue)
                            if (!startsWitOk) {
                                fullConditionPhrase = "false"
                                break
                            }
                            if (i == 0) {
                                fullConditionPhrase = "true"
                            }
                        } else if (condition.startsWith("contains")) {

                            //this block is for string comparisons using contains
                            const containsRegex = new RegExp(conditionTerm, 'i')
                            let containsOk = containsRegex.test(columnValue)
                            if (!containsOk) {
                                fullConditionPhrase = "false"
                                break
                            }
                            if (i == 0) {
                                fullConditionPhrase = "true"
                            }
                        } else {


                            //this block is for string comparisons using <, > and == operators
                            fullConditionPhrase += (i == 0 ? "" : " && ") + "('" + columnValue + "'" + condition + ")"
                        }
                        break
                    case "number":
                    case "number3":
                    case "number6":
                    case "numeric":
                        if (opTranslated == "><") {

                            condition1 = ">" + conditionTerm
                            conditionTerm2 = conditionObj.term2
                            condition2 = "<=" + conditionTerm2
                            fullConditionPhrase += (i == 0 ? "" : " && ") + "(" + columnValue + condition1 + ") && (" + columnValue + condition2 + ")"
                        } else {
                            //this block is for numeric comparisons using <, > and == operators
                            fullConditionPhrase += (i == 0 ? "" : " && ") + "(" + columnValue + "" + condition + ")"
                        }
                        break
                }
            }

            let conditionsApply = eval(fullConditionPhrase)
            if (conditionsApply) {
                return feature.properties.project
            } else {
                return null
            }
        })

        let filteredResults = rawResults.filter(function (result) {
            return result != null
        })

        return filteredResults
    }

    let getMapReadyFeatures=function(geoProjects) {

        let features = []
        for (let ind in geoProjects) {
            let feature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': []
                },
                'properties': {
                    'title': 'Mapbox SF',
                    'icon': 'harbor'
                }
            }

            let geoProject = geoProjects[ind]
            feature.geometry.coordinates[0] = geoProject.Long
            feature.geometry.coordinates[1] = geoProject.Lat
            feature.properties.title = geoProject.Address

            features.push(feature)
        }
        //console.log(features)
        return features
    }

    /* prepares date for comparison by swapping the year portion with the day to form an incremental numberic value ready foe evel() comparison */
    // eslint-disable-next-line no-unused-vars
    let getPreparedtDate=function(dateStr) {
        dateStr = dateStr.replace("\\", "")
        let regexp = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-](\d{2})/g
        let match = regexp.exec(dateStr)
        if (match == null) {
            return null
        }
        let prepared = match[3] + match[2] + match[1]
        return prepared
    }

    // eslint-disable-next-line no-unused-vars
    let getDataVariety=function(geos, fieldName){

        // eslint-disable-next-line no-unused-vars
        let fieldValues = geos.features.map(function (feature) {
            return feature.properties.project[fieldName];
        })

        var distinctFieldValues = fieldValues.filter( function(value, index, self) {
            return self.indexOf(value) === index;
        });

        return distinctFieldValues;

    }

    return {
        name: name,
        init: init,
        printName(){
            console.log(this.name)
        },
        applyFilters: applyFilters,
        getMapReadyFeatures: getMapReadyFeatures,
        getPreparedtDate:getPreparedtDate,
        getDataVariety: getDataVariety,
        geoKeyTranslation: geoKeyTranslation


    }

}
export var defaultPropertyFilter=new PropertyFilter('default')
defaultPropertyFilter.init()
