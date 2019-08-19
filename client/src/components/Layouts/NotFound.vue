<template>
  <v-container
    fluid
  >
    <vue-headful
      :title="headTitle"
    />
    <v-layout>
      <v-flex>
        <h1>
          Page Not Found
        </h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: 'NotFound',
	data () {
		return {
		}
	},
	computed: {
		...mapGetters('posts', ['siteTitle']),
		headTitle() {
			return `Page Not Found - ${this.siteTitle}`
		}
	},
	mounted() {
		
	},
	methods: {
	}
}
</script>

<style scoped>

</style>
