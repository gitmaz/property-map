//for future integration
import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'underscore'
import cosmicStore from './modules/cosmic'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isDataReady: false
    },
    getters: {

    },
    mutations: {

    },
    actions: {
    },
    modules: {
        cosmicStore
    }
})
