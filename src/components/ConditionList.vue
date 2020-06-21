<template>
    <div class="py-0">
        <div>
            <v-divider class="mx-1" vertical></v-divider>
            Conditions (And):
        </div>
        <v-divider class="mt-3"></v-divider>

        <div
                v-for="(item, index) in items"
                :key="index"
        >
            <v-divider class="mx-2" vertical></v-divider>

            <span>
                 <v-icon @click.stop="onEditMenuOpened(index)">create</v-icon>
                {{ item.field+" "+item.operator+" "+item.term +(item.term2!=null?" and "+item.term2:"") }}
            </span>
            <v-divider></v-divider>
            <div v-if="editedItemIndex==index && showEditMenuClickedTimes==1">
                <v-divider class="mx-2" vertical></v-divider>
                <v-btn dense color="green darken-2" @click="onEditClicked">edit</v-btn>
                <v-btn dense color="deep-orange lighten-1" @click="onDeleteClicked">delete</v-btn>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        name: 'ConditionList',
        data() {
            return {
                editedItemIndex: null,
                showEditMenuClickedTimes: 1,
                items: [
                    /* samples kept for manual tests
                    { field:'projectId', type:'text', operator: 'contains', term: '7426971'},
                    { field:'floorArea', type:'numeric', operator: 'equals', term: '2042.000' },
                    { field: 'siteArea', type:'numeric', operator: 'equals', term: '567.690' }
                     */
                ],
            }
        },
        methods: {
            onEditMenuOpened(index) {
                if (this.editedItemIndex == index) {
                    this.showEditMenuClickedTimes++
                    if (this.showEditMenuClickedTimes > 2) {
                        this.showEditMenuClickedTimes = 1
                    }
                } else {
                    this.showEditMenuClickedTime = 1
                }
                this.editedItemIndex = index
                console.log("edit clicked on" + index)
            },
            onEditClicked() {
                let index = this.editedItemIndex
                console.log("edit clicked on" + index)
                let item = this.items[index]
                this.$emit("on-edit-clicked", {index: index, item: item})
            },
            onDeleteClicked() {
                let index = this.editedItemIndex
                this.deleteInList(index)
                this.$emit("on-delete-clicked")
            },
            addToList(conditionObj) {
                this.items.push(conditionObj)
            },
            updateInList(index, conditionObj) {
                this.items[index] = conditionObj
                this.$forceUpdate()
                this.showEditMenuClickedTimes = 1
                this.editedItemIndex = null
            },
            deleteInList(index) {
                this.items.splice(index, 1)
                this.showEditMenuClickedTimes = 1
                this.editedItemIndex = null
            },
            deleteAll() {
                this.items = []
                this.$emit("on-delete-all-applied")
            },
            getConditionsObject() {

                let opTranslations = {
                    equals: "==",
                    isGreaterThan: ">",
                    isLessThan: "<",
                    isBetween: "><",
                    is: "==",
                    isNot: "!=",
                    contains: "contains",
                    startsWith: "startsWith"
                }
                let conditionsObject = {}
                for (let ind in this.items) {
                    let item = this.items[ind]
                    let conditionKey = item.field
                    let condition = item
                    condition.opTranslated = opTranslations[item.operator]
                    let envelope = (condition.type == "text" ? "'" : "")
                    condition.value = item.opTranslated + " " + envelope + item.term + envelope
                    conditionsObject[conditionKey] = condition
                }
                return conditionsObject
            },
            getFieldConditionIndex(field) {
                return this.items.findIndex(item => item.field == field)
            }
        }
    }
</script>
