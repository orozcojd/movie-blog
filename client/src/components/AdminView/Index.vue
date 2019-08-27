<template>
  <div>
    <router-view />
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
	created: function () {
		const store = this.$store;		
		if (!(store && store.state && store.state['admin'])) {
			store.registerModule('admin', admin);
		}
	}
}
</script>

<style scoped>

</style>
