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
    <v-layout
      v-if="articles.length"
      row
      wrap
    >
      <v-flex
        v-for="article in articles"
        :key="article.id"
        md4
        xs12
      >
        <post-preview
          class="post-preview"
          :article="article"
          to="article-view" 
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import PostPreview from '@/components/Posts/PostPreview'

export default {
	name: 'ContributorView',
	components: {
		PostPreview
	},
	data () {
		return {
		}
	},
	computed: {
		...mapState([
			'contributor',
			'articles'
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
		await this.getArticleByContributor(this.contributor._id)
	},
	methods: {
		...mapActions([
			'getContributorBio',
			'getArticleByContributor'
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
