<template>
  <div>
    <router-view 
      v-if="aclUser"
    />
  </div>
</template>

<script>
import admin from '@/store/admin'
import {mapState} from 'vuex'
export default {
	name: 'AdminIndex',
	data(){
		return {
			loaded: false
		}
	},
	computed: {
		...mapState('auth', ['aclUser']),
	},
	created: function () {
		const store = this.$store;		
		if (!(store && store.state && store.state['admin'])) {
			store.registerModule('admin', admin);
		}
	}
}
</script>