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
        <h1>{{ tagName }}</h1>
      </v-flex>
    </v-layout>
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
    <v-layout
      v-else
      justify-center
      align-center
      row
      fill-height
    >
      <v-flex>
        <h1>Articles will be coming soon!</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PostPreview from '@/components/Posts/PostPreview'

import { mapActions, mapState } from 'vuex'

export default {
  
	name: 'TagView',
	components: {
		PostPreview
	},
	data () {
		return {
			// tagName: '',
			loaded: false
		}
	},
	computed: {
		...mapState([
			'articles',
			'tags',
			'tag'
		]),
		tagName() {
			return this.tag.name.split('-').join(' ')
		}
	},
	async mounted() {
		// this.tagName = this.tag.name.split('-').join(" ")
		this.loaded = true
		let urlTag = this.$route.params.tagName
		if(this.tag.name !== urlTag) {
			let newTag = this.tags.find(tag => tag.name === urlTag)
			if(!newTag) {
				// if tag does not exist, go back to previous route
				this.$router.go(-1)
			}
			else {
				console.log(newTag)
				this.setTag(newTag)
				this.getArticlesByTag(newTag._id)
			}
      
		}
		this.getArticlesByTag(this.tag._id)
	},
	methods: {
		...mapActions([
			'getArticlesByTag',
			'getTags',
			'setTag'
		])
	}
}
</script>

<style scoped>

</style>
