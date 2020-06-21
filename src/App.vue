<template>
    <v-app>
        <SideBar :shouldShowDrawer="shouldShowDrawer" @update-should-show-drawer="onUpdateShouldShowDrawerTriggered"
                 @on-filter-changed="onFilterChanged"></SideBar>
        <v-toolbar app color="green accent-4" height="48px">
            <v-icon @click.stop="shouldShowDrawer = !shouldShowDrawer">menu</v-icon>
            <v-divider class="mx-2" vertical></v-divider>
            <v-icon>place</v-icon>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>

        <PropMapBox ref="propMapbox" @map-is-ready="onMapReady"></PropMapBox>

        <!--v-content>
            <router-view/>
        </v-content-->


        <v-footer :fixed="fixed" app color="green accent-4">
            <v-divider class="mx-1" vertical></v-divider>
            <span>&copy; 2020
                    <v-divider class="mx-2" vertical></v-divider> Author: Maziar Navabi
                    <v-divider class="mx-2" vertical></v-divider>
                    <v-divider class="mx-2" vertical></v-divider>
                    <span>number of properties found: <b>{{countFound}}</b></span>
                </span>
            <v-spacer></v-spacer>

            <span class="pr-3 caption">Powered by <a href="https://vuetifyjs.com/" target="_blank">Vuetify</a></span>
        </v-footer>
    </v-app>
</template>

<script>

    import PropMapBox from "./components/PropMapBox"
    import SideBar from "./components/SideBar"
    import geos from './json/testBlob.json'

    export default {
        name: 'App',
        components: {
            SideBar,
            PropMapBox
        },
        data() {
            return {
                countFound: 0,
                geoKeyTranslation: {
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
                },
                geos: geos,
                fixed: false,
                title: 'Property Map',
                shouldShowDrawer: (this.$isMobile() ? false : true)
            }
        },
        methods: {
            onUpdateShouldShowDrawerTriggered: function (event) {
                this.shouldShowDrawer = event
            },

            applyFilters(geos, conditionsObject) {

                //if no filter applied, only extract project data from geos
                if (conditionsObject == null) {
                    let results = geos.features.map(function (feature) {
                        return feature.properties.project
                    })
                    return results
                }

                //todo: move this filtering functionality to a class
                let vueThis = this
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
                        let columnValue = feature.properties.project[vueThis.geoKeyTranslation[columnName]]
                        let conditionObj = conditions[i]
                        let conditionType = conditionObj.type
                        let condition = conditionObj.value
                        let conditionTerm = conditionObj.term
                        let opTranslated = conditionObj.opTranslated

                        switch (conditionType) {
                            case "date":

                                //this block is for comparison on fields of type date using special preparation to make dates comparative
                                columnValue = vueThis.getPreparedtDate(columnValue)
                                if (opTranslated == "><") {

                                    condition1 = ">" + vueThis.getPreparedtDate(conditionTerm)
                                    conditionTerm2 = conditionObj.term2
                                    condition2 = "<=" + vueThis.getPreparedtDate(conditionTerm2)
                                    fullConditionPhrase += (i == 0 ? "" : " && ") + "(" + columnValue + condition1 + ") && (" + columnValue + condition2 + ")"
                                } else {
                                    condition = opTranslated + vueThis.getPreparedtDate(conditionTerm)
                                    fullConditionPhrase += (i == 0 ? "" : " && ") + "(" + columnValue + condition + ")"
                                }
                                break
                            case "text":
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
                        //return feature.properties.id
                    } else {
                        return null
                    }
                })

                let filteredResults = rawResults.filter(function (result) {
                    return result != null
                })

                return filteredResults
            },
            getMapReadyFeatures(geoProjects) {

                //let xCoord=-122.414
                //let yCoord=37.776
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
                    //yCoord+=0.004
                    //xCoord+=0.004
                    //feature.geometry.coordinates[0]=xCoord
                    //feature.geometry.coordinates[1]=yCoord

                    //console.log(ind+': '+'('+geoProject.Lat+','+geoProject.Long+')')
                    feature.geometry.coordinates[0] = geoProject.Long//yCoord//
                    feature.geometry.coordinates[1] = geoProject.Lat//
                    feature.properties.title = geoProject.Address
                    //this.geoJsonSource.data.features.push(feature)
                    features.push(feature)
                }
                //console.log(features)
                return features
            },
            /* prepares date for comparison by swapping the year portion with the day to form an incremental numberic value ready foe evel() comparison */
            getPreparedtDate(dateStr) {
                dateStr = dateStr.replace("\\", "")
                let regexp = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-](\d{2})/g
                let match = regexp.exec(dateStr)
                if (match == null) {
                    return null
                }
                let prepared = match[3] + match[2] + match[1]
                return prepared
            },
            onMapReady() {
                this.renderGeos(null)
            },
            onFilterChanged(event) {
                console.log(event)
                let conditionsObject = event

                /*  sample conditionObject for manual testing
                    let conditionsObject={
                    "Suburb": {type:"text", opTranslated:"==", term: 'SYDNEY', value: "=='SYDNEY'"},
                    "Last Updated": {type:"date", opTranslated:"<", term: "29/03/17", value: "<29/03/17"}
                    }*/
                
                this.renderGeos(conditionsObject)
            },
            renderGeos(conditionsObject) {
                let geoProjects = this.applyFilters(this.geos, conditionsObject)
                let features = this.getMapReadyFeatures(geoProjects)
                this.countFound = features.length
                this.$refs.propMapbox.geoJsonSource.data.features = features
                //console.log(features)
            }
        },
        mounted() {

        },
    }
</script>
