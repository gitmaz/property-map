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
    import * as propertyFilter from './services/PropertyFilter'

    export default {
        name: 'App',
        components: {
            SideBar,
            PropMapBox
        },
        data() {
            return {
                countFound: 0,
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
                let geoProjects=propertyFilter.defaultPropertyFilter.applyFilters(this.geos, conditionsObject)
                let features = propertyFilter.defaultPropertyFilter.getMapReadyFeatures(geoProjects)
                this.countFound = features.length
                this.$refs.propMapbox.geoJsonSource.data.features = features
            }
        },
        mounted() {

        },
    }
</script>
