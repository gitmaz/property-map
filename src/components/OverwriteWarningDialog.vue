<template>
    <v-dialog
            v-model="showDialog"
            max-width="290"
    >
        <v-card>
            <v-card-title class="headline">Overwrite?</v-card-title>

            <v-card-text>
                An existing condition on this field is found. Your new condition wil be overwritten on this. Do you want
                to proceed?
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                        color="green darken-1"
                        text
                        @click="onYesClicked"
                >
                    Yes
                </v-btn>

                <v-btn
                        color="green darken-1"
                        text
                        @click="onNoClicked"
                >
                    No
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'OverwriteWarningDialog',
        data() {
            return {
                showDialog: false
            }
        },
        methods: {
            onYesClicked() {
                this.showDialog = false
                this.$emit("on-overwrite-confirmed")
            },
            onNoClicked() {
                this.showDialog = false
                this.$emit("on-overwrite-denied")
            }
        }
    }
</script>
