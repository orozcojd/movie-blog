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
		this.$store.registerModule('admin', admin)
		this.loaded = true
	},
	beforeDestroy() {
		this.$store.unregisterModule('admin', admin)
	}
}
</script>

<style scoped>

</style>
