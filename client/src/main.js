// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import store from '@/store/index'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import infiniteScroll from 'vue-infinite-scroll'
import InterceptorService from '@/services/InterceptorService'
import { sync } from 'vuex-router-sync'
import vueHeadful from 'vue-headful';
import { abilitiesPlugin } from '@casl/vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { dom } from '@fortawesome/fontawesome-svg-core'
import { faFacebookSquare, faTwitterSquare, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueProgressBar from 'vue-progressbar'
import ability from './Authentication/ability'

Vue.component('vue-headful', vueHeadful);
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueProgressBar, {
	color: '#9982c0',
	failedColor: 'red',
	height: '6px'
})
dom.watch()
library.add(faFacebookSquare,faTwitterSquare, faInstagram)

InterceptorService()

Vue.config.productionTip = false
 
Vue.use(infiniteScroll)
Vue.use(Vuetify, {
	options:{
		customProperties: true,
	},
	iconfont: 'md',
	theme:  {
		// primary: '#ffffff',
		// secondary: '#b0e0e6',
		// accent: '#c4ced4',
		// error: '#f44336',
		// warning: '#ff5722',
		// info: '#009688',
		// success: '#8bc34a'
	}
})
sync(store, router)

export default new Vue({ // eslint-disable-line no-new
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})
