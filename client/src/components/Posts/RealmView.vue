<template>
  <v-container
    v-if="loaded"
    fluid
    grid-list-md
  >
    <v-layout
      row
      wrap
    >
      <v-flex md12>
        <h1>{{ realm }}</h1>
      </v-flex>
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
import PostPreview from '@/components/Posts/PostPreview'

import { mapActions, mapState } from 'vuex'

export default {
  
	name: 'RealmView',
	components: {
		PostPreview
	},
	data () {
		return {
			realm: '',
			loaded: false
		}
	},
	computed: {
		...mapState([
			'articles'
		]),
	},
	async mounted() {
		let realm = this.$route.params.realmName
		this.realm = realm.split('-').join(" ")
		await this.getArticlesByRealm(realm)
		this.loaded = true
	},
	methods: {
		...mapActions([
			'getArticlesByRealm'
		])
	},
}
</script>

<style scoped>

</style>
