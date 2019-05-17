<template>
  <v-container
    v-if="loaded"
    fluid
    grid-list-md
  >
    <vue-headful
      :title="headTitle"
      :description="tag.name"
    />
    <!-- <v-parallax 
      v-if="tag.img"
      :src="tag.img"
      class="mb-lg"
    >
      <v-layout
        align-center
      >
        <v-flex md12>
          <h1>{{ tagName }}</h1>
        </v-flex>
      </v-layout>
    </v-parallax> -->
    <v-layout
      v-if="tag.img"
    >
      <v-img 
        :src="tag.img"
        aspect-ratio="2"
      />
    </v-layout>
    <v-layout
      row
      wrap
    />
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
    <v-pagination
      v-model="pageNo"
      :length="pages"
    />
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
			'tag',
			'pages',
			'page'
		]),
		headTitle() {
			return `${this.tag.name} - Unsolicited.mp3`
		},
		tagName() {
			return this.tag.name.split('-').join(' ')
		},
		pageNo: {
			get() {
				return this.page
			},
			set(val) {
				this.$router.push({name: 'tag-view', query: {page: val}})
			}
		}
	},
	async mounted() {
		const urlTag = this.$route.params.tagName
		const page = this.$route.query.page
		let payload = {
			params: {
				params: {
					page: page
				}
			}
		}
		this.loaded = true
		if(this.tag.name !== urlTag) {
			let newTag = this.tags.find(tag => tag.name === urlTag)
			if(!newTag) {
				// if tag does not exist, go back to previous route
				this.$router.go(-1)
			}
			else {
				this.setTag(newTag)
				payload.query = newTag._id
				await this.getArticlesByTag(payload)
			}
		}
		payload.query = this.tag._id
		await this.getArticlesByTag(payload)
	},
	methods: {
		...mapActions([
			'getArticlesByTag',
			'setTag'
		])
	}
}
</script>

<style scoped>
	.h1 {
		font-size: 4em !important;
	}
	.mb-lg {
		margin-bottom: 5em;
	}
</style>
