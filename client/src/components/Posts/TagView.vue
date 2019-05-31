<template>
  <v-container
    v-if="loaded"
    fluid
  >
    <vue-headful
      :title="headTitle"
      :description="tag.name"
    />
    <v-layout
      v-if="tag.img"
      class="img-placeholder"
    >
      <v-img 
        :lazy-src="tag.lazyImg"
        :src="tag.img"
        aspect-ratio="2"
        :alt="tag.name"
      >
        <v-container fill-height>
          <v-layout align-center>
            <v-flex
              row
              wrap
              class="realm-title"
            >
              <h1 align="center">
                {{ tag.name }}
              </h1>
            </v-flex>
          </v-layout>
        </v-container>
      </v-img>
    </v-layout>
    <display-articles 
      v-if="articles.length"
      :articles="articles.slice(6)"
    />
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
    <v-layout justify-center>
      <v-pagination
        v-model="pageNo"
      
        :length="pages"
      />
    </v-layout>
  </v-container>
</template>

<script>
import DisplayArticles from '@/components/Layouts/DisplayArticles'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  
	name: 'TagView',
	components: {
		DisplayArticles
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
		...mapGetters([
			'siteTitle'
		]),
		headTitle() {
			return `${this.tag.name} - ${this.siteTitle}`
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
	.realm-title {
		color: whitesmoke;
		font-size: 4rem;
	}
	/* .img-placeholder {
		height: 700px;
	} */
</style>
