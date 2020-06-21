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

                <v-flex v-show="filterOperator && filterType !== 'lookup'">
                    <v-text-field
                            name="filterTerm"
                            :label="filterTermLabel"
                            :mask="filterTermMask"
                            :rules='filterTermRules'
                            return-masked-value
                            v-model="filterTerm"
                    ></v-text-field>
                </v-flex>
                <v-flex v-show="filterOperator === 'isBetween'">
                    <v-text-field
                            name="filterTerm2"
                            :label="filterTermLabel"
                            :mask="filterTermMask"
                            :rules='filterTermRules'
                            return-masked-value
                            v-model="filterTerm2"
                    ></v-text-field>
                </v-flex>
                <v-flex v-show="filterType === 'lookup'">
                    <v-autocomplete
                            :items="filterLookupItems"
                            :label="filterLookupLabel"
                            v-model="filterLookupValue"
                    ></v-autocomplete>
                </v-flex>

                <span xs2 v-if="crudMode=='create'">
                        <v-btn color="warning" v-if="filterField && filterOperator && filterTerm" @click="onAddFilter">Add</v-btn>
                    </span>
                <span xs2 v-if="crudMode=='update'">
                        <v-btn color="warning" @click="onSaveFilter">Save</v-btn>
                    </span>
                <span xs2>
                        <v-btn color="warning" v-if="countConditions" @click="onClearAllFilters">Clear all</v-btn>
                    </span>
                <span xs2 v-if="$isMobile()">
                        <v-btn color="warning" @click="onOkClicked">Close</v-btn>
                    </span>


            </v-card>
            <v-card>
                <ConditionList @on-edit-clicked="onEditClicked" @on-delete-clicked="onDeleteClicked"
                               @on-delete-all-applied="onDeleteAllApplied" ref="conditionList"></ConditionList>
            </v-card>
            <OverwriteWarningDialog ref="overwriteWarningDialog" @on-overwrite-confirmed="onOverwriteConfirmed"
                                    @0n-overwrite-denied="onOverwriteDenied"></OverwriteWarningDialog>
        </v-navigation-drawer>

    </v-container>
</template>
<style>
    .side-bar {
        margin-top: 50px !important;
    }

    .v-btn {
        min-width: 0;
    }
</style>
<script>
    import ConditionList from "./ConditionList"
    import OverwriteWarningDialog from "./OverwriteWarningDialog"

    export default {
        name: 'home',
        props: [
            "shouldShowDrawer"
        ],
        components: {
            ConditionList,
            OverwriteWarningDialog
        },
        data() {
            return {
                crudMode: "create",
                focusConditionIndex: null,
                countConditions: 0,

                filterFields: [
//lookup
                    {text: "Project ID", value: 'projectId', type: 'text'},
                    {text: "Title", value: 'title', type: 'text'},
                    {text: "Type", value: 'type', type: 'text'},
                    {text: "Address", value: 'address', type: 'text'},
                    {text: "Suburb", value: 'suburb', type: 'text'},
                    {text: "State", value: 'state', type: 'text'},
                    {text: "Stage", value: 'stage', type: 'text'},
                    {text: "Category", value: 'category', type: 'text'},
                    {text: "SubCategory", value: 'subCategory', type: 'text'},
                    {text: "Status", value: 'status', type: 'text'},
                    {text: "Council", value: 'council', type: 'text'},
                    {text: "Dev. Type", value: 'devType', type: 'text'},
                    {text: "Floor Area", value: 'floorArea', type: 'number3'},
                    {text: "Site Area", value: 'siteArea', type: 'number3'},
                    {text: "Storeys", value: 'storeys', type: 'number'},
                    {text: "Units", value: 'units', type: 'number3'},
                    {text: "Commence Date", value: 'commenceDate', type: 'date'},
                    {text: "Completion Date", value: 'completionDate', type: 'date'},
                    {text: "Last Updated", value: 'lastUpdate', type: 'date'},
                    {text: "Value", value: 'value', type: 'number3'},
                    {text: "Ownership", value: 'ownership', type: 'text'},
                    {text: "Description", value: 'description', type: 'text'},
                    {text: "Notes", value: 'notes', type: 'text'},
                    {text: "Additional Details", value: 'additionalDetails', type: 'text'},
                    {text: "Lat", value: 'lat', type: 'number6'},
                    {text: "Long", value: 'long', type: 'number6'}
                ],
                filterDefs: {
                    text: {
                        equals: {display: 'Equals'},
                        startsWith: {display: 'Starts with'},
                        contains: {display: 'Contains'},
                    },
                    number: {
                        equals: {display: 'Equals', floatingPoint: 0},
                        isGreaterThan: {display: 'Is Greater than', floatingPoint: 0},
                        isLessThan: {display: 'Is Less than', floatingPoint: 0},
                        isBetween: {display: 'Is Between', floatingPoint: 0}
                    },
                    number3: {
                        equals: {display: 'Equals', floatingPoint: 3},
                        isGreaterThan: {display: 'Is Greater than', floatingPoint: 3},
                        isLessThan: {display: 'Is Less than', floatingPoint: 3},
                        isBetween: {display: 'Is Between', floatingPoint: 3}
                    },
                    number6: {
                        equals: {display: 'Equals', floatingPoint: 6},
                        isGreaterThan: {display: 'Is Greater than', floatingPoint: 6},
                        isLessThan: {display: 'Is Less than', floatingPoint: 6},
                        isBetween: {display: 'Is Between', floatingPoint: 6}
                    },
                    date: {
                        equals: {display: 'Equals', format: 'MM/DD/YYYY'},
                        isGreaterThan: {display: 'Is Greater than', format: 'MM/DD/YYYY'},
                        isLessThan: {display: 'Is Less than', format: 'MM/DD/YYYY'},
                        isBetween: {display: 'Is Between', format: 'MM/DD/YYYY'}
                    },
                    lookup: {
                        is: {display: 'Is'},
                        isNot: {display: 'Is not'}
                    }
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
            }
        },
        computed: {
            bg() {
                return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
            }

        },
        watch: {
            filterField(newValue) {
                if (newValue == null) {
                    return
                }

                const filterType = this.filterFields.find(item => item.value === newValue).type

                if (filterType) {
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
            filterOperator() {
                if (this.filterType == null) {
                    return
                }
                this.clearFilterTerms()
                if (this.filterType === 'text') {
                    this.filterTermMask = ''
                    this.filterTermLabel = 'Filter'
                } else if (this.filterType === 'number') {
                    this.filterTermMask = '###'
                    this.filterTermLabel = '###'
                } else if (this.filterType === 'number3') {
                    this.filterTermMask = '####.###'
                    this.filterTermLabel = '####.###'
                } else if (this.filterType === 'number6') {
                    this.filterTermMask = ''//todo: '##.######' does not work for minus values! replace these masks with better masking mechanism
                    this.filterTermLabel = '+-##.######'
                } else if (this.filterType === 'date') {
                    this.filterTermMask = '##/##/##'
                    this.filterTermLabel = 'DD/MM/YY'
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
        filters: {},
        methods: {
            getFilterOperators(filterDef) {
                let oprs = []
                if (filterDef) {
                    for (let key in filterDef) {
                        oprs.push({text: filterDef[key]['display'], value: key})
                    }
                }
                return oprs
            },
            clearFilterTerms() {
                this.filterTerm = ''
                this.filterTerm2 = ''
                this.filterTermMask = ''
                this.filterTermLabel = 'Filter'
                this.filterTermRules = []
                this.filterLookupValue = ''
                this.filterLookupItems = []
                this.filterLookupLabel = ''
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
            onClearAllFilters() {
                this.filterField = null
                this.filterType = null
                this.filterOperator = null
                this.$refs.conditionList.deleteAll()

            },
            onAddFilter() {
                var fieldConditionIndex = this.$refs.conditionList.getFieldConditionIndex(this.filterField)
                if (fieldConditionIndex != -1) {
                    this.focusConditionIndex = fieldConditionIndex
                    //decide on adding by user confirmation on onOverwriteConfirmed instead
                    this.$refs.overwriteWarningDialog.showDialog = true
                } else {
                    this.addFilter()
                }

            },
            onOverwriteConfirmed() {
                this.saveFilter()
            },
            onOverwriteDenied() {

            },
            addFilter() {

                var conditionObj = this.getConditionObject()
                this.$refs.conditionList.addToList(conditionObj)
                this.countConditions = this.$refs.conditionList.items.length
                this.$emit("on-filter-changed", this.$refs.conditionList.getConditionsObject())
            },
            onSaveFilter() {

                this.crudMode = "create"
                this.saveFilter()
            },
            saveFilter() {

                let conditionObj = this.getConditionObject()
                this.$refs.conditionList.updateInList(this.focusConditionIndex, conditionObj)
                this.countConditions = this.$refs.conditionList.items.length
                this.$emit("on-filter-changed", this.$refs.conditionList.getConditionsObject())
                this.$toastr.s("filter saved and applied.")
            },
            getConditionObject() {
                let conditionObj = {
                    field: this.filterField,
                    type: this.filterType,
                    operator: this.filterOperator,
                    term: this.filterTerm,
                    term2: null
                }
                if (this.filterOperator === 'isBetween') {
                    conditionObj.term2 = this.filterTerm2
                }

                return conditionObj
            },
            onOkClicked() {

                this.$emit("update-should-show-drawer", false)
            },
            onEditClicked(event) {

                this.filterField = event.item.field
                this.filterOperator = event.item.operator
                this.filterTerm = event.item.term
                this.focusConditionIndex = event.index
                this.crudMode = "update"
                this.$forceUpdate()
            },
            onDeleteClicked() {
                this.countConditions = this.$refs.conditionList.items.length
                this.$emit("on-filter-changed", this.$refs.conditionList.getConditionsObject())
                this.$toastr.s("filter condition deleted.")
            },
            onDeleteAllApplied() {
                this.countConditions = this.$refs.conditionList.items.length
                this.$emit("on-filter-changed", null)
                this.$toastr.s("all filters cleared.")
            },
            created() {
                this.filterField = 'firstName'
            },
            mounted() {
                this.$toastr.defaultPosition = "toast-bottom-left"
                this.$toastr.defaultStyle = {"background-color": "#1B5E20"}
                this.$toastr.defaultTimeout = 2000
            }
        }
    }
</script>
