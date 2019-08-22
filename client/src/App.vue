<template>
  <div id="app">
    <v-app>
      <v-content v-if="loaded">
        <admin-header v-if="isUserLoggedin" />
        <Header v-else />
        <display-errors />
        <router-view
          id="route-content"
          :key="$route.fullPath"
        />
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
import admin from '@/store/admin'

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
		...mapGetters('auth', [
			'isUserLoggedin'
		]),
	},
	watch: {
		isUserLoggedin(val) {
			if(val) {
				this.$store.registerModule('admin', admin)
			}
		}
	},
	async mounted () {
		if(!this.token.token) {
			await this.getSetToken()
		}
		if(this.isUserLoggedin) {
			this.$store.registerModule('admin', admin)
		}
		this.loaded = true
	},
	methods: {
		...mapActions('auth', ['getSetToken'])
	}
}
</script>

<style>
#route-content {
  min-height: 100vh;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  font-size: calc(16px + 0.35vw) !important;
  line-height: 1.25em;
  /* line-height: calc(12px + 1.05vw); */
  /* background-color: var(--v-accent-base); */
  /* color: var(--v-primary-base) */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
h1 {
  font-size: 1.912em;
  line-height: 1.2em; /* Responsive Vertical Rhythm */
}

h2 {
  font-size: 1.616em;
  line-height: 1.2em; /* Responsive Vertical Rhythm */
}

h3 {
  font-size: 1.471em;
  line-height: 1.1em; /* Responsive Vertical Rhythm */
}

h4 { font-size: 1.3em; }
h5 { font-size: 1.243em; }
h6 { font-size: 1.132em; }

h4, h5, h6 { 
  line-height: 1.1em; /* Responsive Vertical Rhythm */
}

h1, h2, h3, h4, h5, h6, blockquote {
  margin: calc(14px + 1.05vw) 0; /* Responsive margins */
}
</style>
