<template>
  <div id="app">
    <v-app>
      <v-content>
        <admin-header v-if="isUserLoggedin" />
        <Header v-else />
        <div v-if="errors && errors.length">
          <display-errors 
            :errors="errors"
          />
        </div>
        <router-view
          id="route-content"
          :key="$route.fullPath"
        />
        <vue-progress-bar />
        <Footer />
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Header from '@/components/Layouts/Header.vue'
import Footer from '@/components/Layouts/Footer.vue'
import DisplayErrors from '@/components/Errors/DisplayErrors'
export default {
	name: 'App',
	components: {
		Header,
		Footer,
		DisplayErrors,
		AdminHeader: () => import('@/components/AdminView/Layouts/Header')
	},
	data () {
		return {
			loaded: false
		}
	},
	computed: {
		...mapState('auth', ['token']),
		...mapState('errors', ['errors']),
		...mapGetters('auth', [
			'isUserLoggedin'
		]),
    
	},
	async mounted () {
		this.$Progress.start()
		if(!this.token.token) {
			await this.getSetToken()
		}
		this.$Progress.finish()
	},
	created () {
		//  [App.vue specific] When App.vue is first loaded start the progress bar
		this.$Progress.start()
		//  hook the progress bar to start before we move router-view
		this.$router.beforeEach((to, from, next) => {
			//  does the page we want to go to have a meta.progress object
			// if (to.meta.progress !== undefined) {
			// 	let meta = to.meta.progress
			// 	// parse meta tags
			// 	console.log(meta)
			// 	this.$Progress.parseMeta(meta)
			// }
			//  start the progress bar
			this.$Progress.start()
			//  continue to next page
			next()
		})
		//  hook the progress bar to finish after we've finished moving router-view
		this.$router.afterEach((to, from) => {
			//  finish the progress bar
			this.$Progress.finish()
		})
	},
	methods: {
		...mapActions('auth', ['getSetToken'])
	}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Mitr|Roboto&display=swap');
@import url('https://fonts.googleapis.com/css?family=Manjari:700&display=swap');
#route-content {
  min-height: 100vh;
}
#app {
  font-family: 'Manjari', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  font-size: calc(16px + 0.35vw);
  line-height: 1.25em;
  /* line-height: calc(12px + 1.05vw); */
  /* background-color: var(--v-accent-base); */
  /* color: var(--v-primary-base) */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}

h1 {
  font-size: 1.912em;
  line-height: 1.2em; 
}

h2 {
  font-size: 1.616em;
  line-height: 1.2em; 
}

h3 {
  font-size: 1.471em;
  line-height: 1.1em; 
}

h4 { font-size: 1.3em; }
h5 { font-size: 1.243em; }
h6 { font-size: 1.132em; }

h4, h5, h6 { 
  line-height: 1.1em; 
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Manjari', sans-serif;
  margin: calc(14px + 1.05vw) 0; 
}
blockquote {
  margin: calc(14px + 1.05vw) 0; 
}

</style>
