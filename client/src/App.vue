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
  /* background-color: var(--v-accent-base); */
  /* color: var(--v-primary-base) */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
</style>
