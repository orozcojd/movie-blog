<template>
  <div>
    <!-- <h1>Admin View</h1> -->
    <router-view />
  </div>
</template>

<script>
import admin from '@/store/admin'
export default {
	name: 'AdminIndex',
	mounted () {
		this.$store.registerModule('admin', admin)
	},
	beforeDestroy() {
		this.$store.unregisterModule('admin', admin)
	}
}
</script>

<style scoped>

</style>
