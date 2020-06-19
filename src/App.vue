<template>
    <v-app>
        <!--v-app-bar
                app
                color="indigo accent-4"
                dark
        -->
        <SideBar :shouldShowDrawer="shouldShowDrawer" @update-should-show-drawer="onUpdateShouldShowDrawerTriggered"></SideBar>
        <v-toolbar app color="green accent-4">
            <v-icon  @click.stop="shouldShowDrawer = !shouldShowDrawer">menu</v-icon>
            <v-divider class="mx-2" vertical></v-divider>
            <v-icon>place</v-icon>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>

        <!--/v-app-bar-->

        <!--PropMapBox></PropMapBox-->

        <!--v-content>
            <router-view/>
        </v-content-->


        <v-footer :fixed="fixed" app color="green accent-4">
            <v-divider class="mx-1" vertical></v-divider><span>&copy; 2020 <v-divider class="mx-2" vertical></v-divider> Author: Maziar Navabi</span>
            <v-spacer></v-spacer>
            <span class="pr-3 caption">Powered by <a href="https://vuetifyjs.com/" target="_blank">Vuetify</a></span>
        </v-footer>
    </v-app>
</template>

<script>

    import PropMapBox from "./components/PropMapBox";
    import SideBar from "./components/SideBar";

    export default {
      name: 'App',
      components: {
          SideBar,
          PropMapBox
      },
      data () {
        return {
          fixed: false,
          title: 'Property Map',
            shouldShowDrawer: (this.$isMobile()? false: true)
        }
      },
      methods:{
          onUpdateShouldShowDrawerTriggered:function(event){
              this.shouldShowDrawer=event;
          }
      }
    }
</script>
