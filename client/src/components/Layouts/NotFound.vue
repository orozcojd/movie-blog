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
export default {
	name: 'NotFound',
	data () {
		return {
		}
	},
	computed: {
		headTitle() {
			return 'Page Not Found - Unsolicited.mp3'
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
