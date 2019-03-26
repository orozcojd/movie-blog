<template>
  <v-container fluid>
    <v-layout>
      <v-flex>
        
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {mapState} from 'vuex'
export default {
	name: 'AdminEditRealms',
	data () {
		return {
		}
	},
	computed: {
		...mapState([
			'realms'
		])
	},
	mounted() {
		
	},
	methods: {
	}
}
</script>

<style scoped>

</style>
