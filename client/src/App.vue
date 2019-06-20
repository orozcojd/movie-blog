<template>
  <div id="app">
    <v-app>
      <v-content>
        <Header />
        <!-- <h1>My Header</h1> -->
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
import Header from '@/components/Layouts/Header.vue'
import Footer from '@/components/Layouts/Footer.vue'
export default {
	name: 'App',
	components: {
		Header,
		Footer
	},
	mounted () {
	},
	methods: {

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
  font-size: calc(14px + 0.35vw) !important;
  
  /* line-height: calc(12px + 1.05vw); */
  /* background-color: var(--v-accent-base); */
  /* color: var(--v-primary-base) */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
h1 {
  font-size: 1.912em;
  line-height: calc(18px + 1.8vw); /* Responsive Vertical Rhythm */
}

h2 {
  font-size: 1.616em;
  line-height: calc(18px + 1vw); /* Responsive Vertical Rhythm */
}

h3 {
  font-size: 1.471em;
  line-height: calc(18px + 0.7vw); /* Responsive Vertical Rhythm */
}

h4 { font-size: 1.3em; }
h5 { font-size: 1.243em; }
h6 { font-size: 1.132em; }

h4, h5, h6 { 
  line-height: calc(18px + .2vw); /* Responsive Vertical Rhythm */
}

h1, h2, h3, h4, h5, h6, blockquote {
  margin: calc(14px + 1.05vw) 0; /* Responsive margins */
}
</style>
