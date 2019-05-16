<template>
  <v-container>
    <h1 align="left">
      {{ contributor.name }}
    </h1>
    <v-img
      :src="contributor.img"
      max-width="400px"
    />
    <br>
    <p align="left">
      {{ contributor.bio }}
    </p>
    <br>
    <p>
      <a
        :href="twitter"
        target="_"
      >
        twitter
      </a>
      <br>
      <a
        :href="instagram"
        target="_"
      >Instagram</a>
      <v-layout>
        <v-flex
          xs12
          md4
        />
      </v-layout>
    </p>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
	name: 'ContributorView',
	// props: {
	// 	id: {
	// 		type: String,
	// 		required: true
	// 	}
	// },
	data () {
		return {
		}
	},
	computed: {
		...mapState([
			'contributor'
		]),
		twitter() {
			return `https://www.twitter.com/${this.contributor.twitter}`
		},
		instagram() {
			return `https://www.twitter.com/${this.contributor.twitter}`
		}
	},
	async mounted() {
		await this.getContributorBio(this.$route.params.id)
		console.log(this.contributor)
	},
	methods: {
		...mapActions([
			'getContributorBio'
		])
	}
}
</script>

<style scoped>
  h1 {
    font-size: 4rem;
    margin-bottom: 2.5rem;
  }
</style>
