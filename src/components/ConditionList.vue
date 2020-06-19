<template>
    <div class="py-0">
        <div><v-divider class="mx-1" vertical></v-divider>Conditions (And):</div>
        <v-divider class="mt-3" ></v-divider>

        <div
                v-for="item in items"
                :key="item.title"
        >
            <v-divider class="mx-2" vertical></v-divider>

            <v-icon @click.stop="onEditMenuOpened(item.index)">create</v-icon>

            <v-divider class="mx-1" vertical></v-divider>
            <span>
                {{ item.title }}
            </span>
            <v-divider></v-divider>
            <div v-if="editedItemIndex==item.index && showEditMenuClickedTimes==1">
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
        data () {
            return {
                editedItemIndex:null,
                showEditMenuClickedTimes:1,
                items: [
                    { index:0, title: 'condition 11'},
                    { index:1, title: 'condition 2' },
                    { index:2, title: 'condition 3' },
                ],
            }
        },
        methods:{
            onEditMenuOpened(index){
                if(this.editedItemIndex==index) {
                    this.showEditMenuClickedTimes++;
                    if(this.showEditMenuClickedTimes>2){
                        this.showEditMenuClickedTimes=1;
                    }
                }else{
                    this.showEditMenuClickedTime=1;
                }
                this.editedItemIndex=index;
                console.log("edit clicked on"+index)
            },
            onEditClicked(){
                let index= this.editedItemIndex;
                console.log("edit clicked on"+index)
                let item=this.getItemByIndex(index);
                this.$emit("on-edit-clicked", item);
            },
            onDeleteClicked(){
                let index= this.editedItemIndex;
                let item=this.getItemByIndex(index);
                console.log("delete clicked on"+index)
                this.$emit("on-edit-clicked", item);
            },
            getItemByIndex(index){
                var foundItem;
                for(var ind in this.items){
                    var item=this.items[ind];
                    if (item.index==index){
                        foundItem=item;
                        break;
                    }
                }

                return foundItem;
            }
        }
    }
</script>
