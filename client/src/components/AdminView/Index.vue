<template>
  <div>
    <!-- <h1>Admin View</h1> -->
    <router-view
      v-if="loaded"
    />
  </div>
</template>

<script>
import admin from '@/store/admin'
export default {
	name: 'AdminIndex',
	data(){
		return {
			loaded: false
		}
	},
	mounted () {
		// if(!admin.registered) {
		// 	console.log('hereee')
		// 	this.$store.registerModule('admin', admin)
		// 	admin.registered = true
		// }
		this.loaded = true
	}
}
</script>

<style scoped>

</style>
