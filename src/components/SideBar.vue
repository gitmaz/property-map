<template>
    <v-container grid-list-lg v-show="shouldShowDrawer">
        <v-navigation-drawer
                v-model="drawer"
                :color="color"
                :expand-on-hover="expandOnHover"
                :mini-variant="miniVariant"
                :right="right"
                :permanent="permanent"
                :src="bg"
                absolute
                dark
                class="side-bar"
        >
                <v-card
                        class="pa-3"
                        outlined
                        tile
                >
                    <v-select
                            :items="filterFields"
                            v-model="filterField"
                            label="Filter by">
                    </v-select>
                    <v-select
                            :items="filterOperators"
                            v-model="filterOperator"
                            label="Operator">
                    </v-select>

                    <v-flex  v-show="filterOperator && filterType !== 'lookup'">
                        <v-text-field
                                name="filterTerm"
                                :label="filterTermLabel"
                                :mask="filterTermMask"
                                :rules='filterTermRules'
                                return-masked-value
                                v-model="filterTerm"
                        ></v-text-field>
                    </v-flex>
                    <v-flex v-show="filterOperator === 'between'">
                        <v-text-field
                                name="filterTerm2"
                                :label="filterTermLabel"
                                :mask="filterTermMask"
                                :rules='filterTermRules'
                                return-masked-value
                                v-model="filterTerm2"
                        ></v-text-field>
                    </v-flex>
                    <v-flex  v-show="filterType === 'lookup'">
                        <v-autocomplete
                                :items="filterLookupItems"
                                :label="filterLookupLabel"
                                v-model="filterLookupValue"
                        ></v-autocomplete>
                    </v-flex>

                    <span xs2 v-if="crudMode=='create'">
                        <v-btn color="warning" @click="onAddFilter">Add</v-btn>
                    </span>
                    <span xs2 v-if="crudMode=='update'">
                        <v-btn color="warning" @click="onSaveFilter">Save</v-btn>
                    </span>
                    <span xs2>
                        <v-btn color="warning" @click="onClearAllFilters">Clear</v-btn>
                    </span>
                    <span xs2 v-if="$isMobile()">
                        <v-btn color="warning" @click="onOkClicked">OK</v-btn>
                    </span>


                </v-card>
            <v-card>
                <ConditionList @on-edit-clicked="onEditClicked"></ConditionList>
            </v-card>
        </v-navigation-drawer>

</v-container>
</template>
<style>
    .side-bar{
        margin-top: 50px!important;
    }

    .v-btn {
        min-width: 0;
    }
</style>
<script>
import moment from 'moment'
import ConditionList from "./ConditionList";

export default {
    name: 'home',
    props:[
        "shouldShowDrawer"
    ],
    components: {
        ConditionList
    },
    data () {
        return {
            crudMode: "create",
            headers: [
                { text: 'ID', align: 'left', sortable: false, value: 'id' },
                { text: 'First', value: 'firstName' },
                { text: 'Last', value: 'lastName' },
                { text: 'DOB', value: 'dob', dataType: 'Date' },
                { text: 'GPA', value: 'gpa' },
                { text: 'Address', value: 'address' },
                { text: 'City', value: 'city' },
                { text: 'County', value: 'county' },
                { text: 'State', value: 'state' },
                { text: 'Zip', value: 'zip' }
            ],
            filterFields: [
                {text: 'First Name', value: 'firstName', type: 'text'},
                {text: 'Last Name', value: 'lastName', type: 'text'},
                {text: 'DOB', value: 'dob', type: 'date'},
                {text: 'GPA', value: 'gpa', type: 'number'},
                {text: 'Address', value: 'address', type: 'text'},
                {text: 'City', value: 'city', type: 'text'},
                {text: 'County', value: 'county', type: 'text'},
                {text: 'Zip', value: 'zip', type: 'number'},
                {text: 'State', value: 'state', type: 'lookup'}
            ],
            filterDefs: {
                text: {contains: {display: 'Contains', function: this.filterByTextContains},
                    startsWith: {display: 'Starts with', function: this.filterByTextStartsWith}},
                number: {equal: {display: 'Equal', function: this.filterByNumberEqual, decimalPoint: 1},
                    greater: {display: 'Greater than', function: this.filterByNumberGreater, decimalPoint: 1},
                    less: {display: 'Less than', function: this.filterByNumberLess, decimalPoint: 1},
                    between: {display: 'Between', function: this.filterByNumberBetween, decimalPoint: 1}},
                date: {equal: {display: 'Equal', function: this.filterByDateEqual, format: 'MM/DD/YYYY'},
                    greater: {display: 'Greater than', function: this.filterByDateGreater, format: 'MM/DD/YYYY'},
                    less: {display: 'Less than', function: this.filterByDateLess, format: 'MM/DD/YYYY'},
                    between: {display: 'Between', function: this.filterByDateBetween, format: 'MM/DD/YYYY'}},
                lookup: {is: {display: 'Is', function: this.filterByLookupIs},
                    isNot: {display: 'Is not', function: this.filterByLookupIsNot}}
            },
            filterField: '',
            filterType: '',
            filterOperators: [],
            filterOperator: '',
            filterTerm: '',
            filterTerm2: '',
            filterTermMask: '',
            filterTermLabel: '',
            filterTermRules: [],
            dateFilterFormat: 'MM/DD/YYYY',
            filterLookupItems: [],
            filterLookupValue: '',
            filterLookupLabel: '',
            drawer: true,
            color: 'primary',
            colors: [
                'primary',
                'blue',
                'success',
                'red',
                'teal',
            ],
            right: false,
            permanent: true,
            miniVariant: false,
            expandOnHover: false,
            background: false,
            dtShouldShowDrawer: false
        }
    },
    computed: {
        bg() {
            return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
        }

    },
    watch: {
        filterField (newValue) {
            const filterType = this.filterFields.find(item => item.value === newValue).type
            if(filterType) {
                this.filterType = filterType
                this.filterOperators = this.getFilterOperators(this.filterDefs[filterType])
                this.filterOperator = this.filterOperators[0]['value']
                this.clearFilterTerms()
            } else {
                this.filterType = ''
                this.filterOperators = []
                this.filterOperator = ''
                this.clearFilterTerms()
            }
        },
        filterOperator () {
            this.clearFilterTerms()
            if (this.filterType === 'text') {
                this.filterTermMask = ''
                this.filterTermLabel = 'Filter'
            } else if (this.filterType === 'number') {
                if (this.filterField === 'gpa') {
                    this.filterTermMask = '#.#'
                    this.filterTermLabel = '#.#'
                } else if (this.filterField === 'zip') {
                    this.filterTermMask = '#####'
                    this.filterTermLabel = '#####'
                } else {
                    this.filterTermMask = '######'
                    this.filterTermLabel = '######'
                }
            } else if (this.filterType === 'date') {
                this.filterTermMask = '##/##/####'
                this.filterTermLabel = 'MM/DD/YYYY'
                this.filterTermRules = [this.rulesIsValidDate]
            } else if (this.filterType === 'lookup') {
                let lookupItems = []
                if (this.filterField === 'state') {
                    lookupItems = this.states
                    this.filterLookupLabel = 'State'
                }
                this.filterLookupItems = lookupItems
                this.filterLookupValue = ''
            }
        }
    },
    filters: {
        shortDate (value, format) {
            return moment(value).format(format)
        },
        gpaFloat (value) {
            return value.toFixed(1)
        }
    },
    methods: {
        getFilterOperators (filterDef) {
            let oprs = []
            if(filterDef) {
                for(let key in filterDef) {
                    oprs.push({text: filterDef[key]['display'], value: key})
                }
            }
            return oprs
        },
        clearFilterTerms () {
            this.filterTerm = ''
            this.filterTerm2 = ''
            this.filterTermMask = ''
            this.filterTermLabel = 'Filter'
            this.filterTermRules = []
            this.filterLookupValue = ''
            this.filterLookupItems = []
            this.filterLookupLabel = ''
        },
        rulesIsValidDate (value) {
            return moment(value, this.dateFilterFormat, true).isValid()
        },
        // ---------- field filter methods ----------
        filterByTextContains (list, fieldName, fieldValue) {
            const re = new RegExp(fieldValue, 'i')
            return this.filterByRegExp(list, fieldName, fieldValue, re)
        },
        filterByTextStartsWith (list, fieldName, fieldValue) {
            const re = new RegExp('^' + fieldValue, 'i')
            return this.filterByRegExp(list, fieldName, fieldValue, re)
        },
        filterByRegExp(list, fieldName, fieldValue, regExp) {
            return list.filter(item => {
                if(item[fieldName] !== undefined) {
                    return regExp.test(item[fieldName])
                } else {
                    return true
                }
            })
        },
        /*filterByLookupIs (list, fieldName, fieldValue) {
            return list.filter(item => {
                if(item[fieldName] !== undefined) {
                    return item[fieldName] === fieldValue
                } else {
                    return true
                }
            })
        },
        filterByLookupIsNot (list, fieldName, fieldValue) {
            return list.filter(item => {
                if(item[fieldName] !== undefined) {
                    return item[fieldName] !== fieldValue
                } else {
                    return true
                }
            })
        }*/
        // ---------- Events ------------------------
        onClearAllFilters () {
            this.filterField = 'firstName'
        },
        onAddFilter(){

        },
        onSaveFilter(){

            this.crudMode="create";
            this.$toastr.s("filter saved and applied");
        },
        onOkClicked(){
            this.$emit("update-should-show-drawer", false)
        },
        onEditClicked(event){
            console.log(event);
            this.filterTerm=event.title;
            this.crudMode="update"
        }
    },
    created () {
        this.filterField = 'firstName'
    },
    mounted(){
        this.$toastr.defaultPosition = "toast-bottom-left";
        this.$toastr.defaultStyle = { "background-color": "#1B5E20" };
        this.$toastr.defaultTimeout = 2000;
    }
}
</script>
