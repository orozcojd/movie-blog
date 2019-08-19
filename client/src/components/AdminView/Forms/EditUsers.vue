<template>
  <div>
    <vue-headful
      :title="headTitle"
    />
    hello
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: 'EditUsers',
	data () {
		return {
		}
	},
	computed: {
		...mapGetters('posts', ['siteTitle']),
		headTitle() {
			return `Admin Edit Users - ${this.siteTitle}}`
		},
	},
	mounted() {
		
	},
	methods: {
	}
}
</script>

<style scoped>

</style>
