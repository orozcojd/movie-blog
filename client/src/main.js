// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import store from '@/store/index'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import { sync } from 'vuex-router-sync'
// import colors from 'vuetify/es5/util/colors'

Vue.config.productionTip = false


Vue.use(Vuetify, {
	options:{
		customProperties: true,
	},
	iconfont: 'md',
	theme:  {
		primary: '#ffffff',
		secondary: '#b0e0e6',
		accent: '#c4ced4',
		error: '#f44336',
		warning: '#ff5722',
		info: '#009688',
		success: '#8bc34a'
	}
})


sync(store, router)

new Vue({ // eslint-disable-line no-new
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
