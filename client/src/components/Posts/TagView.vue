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
        width="100"
        max-height="100vh"
        :alt="tag.name"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.3)"
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
    <v-container
      v-else
      fluid
    >
      <v-layout>
        <v-flex>
          <h1>{{ tag.name }}</h1>
        </v-flex>
      </v-layout>
    </v-container>
    <display-articles 
      v-if="articles.length"
      :articles="articles"
    />
    <v-layout
      v-else
      justify-center
      align-center
      row
      fill-height
      class="mt-lg"
    >
      <v-flex>
        <h1>Articles will be coming soon!</h1>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-pagination
				v-if="articles.length"
        v-model="pageNo"
        :length="pages"
        color="#5c6bc0"
      />
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  
	name: 'TagView',
	components: {
		DisplayArticles: () => import('@/components/Layouts/DisplayArticles')
	},
	data () {
		return {
			loaded: false
		}
	},
	computed: {
		...mapState('posts', [
			'articles',
			'tag',
			'pages',
			'page'
		]),
		...mapGetters('posts', ['siteTitle']),
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
	async beforeRouteUpdate(to, from, next) {
		const page = this.$route.query.page
		const urlTag = to.params.urlTag
		let payload = {
			params: {
				params: {
					page: page
				}
			}
		}
		if(urlTag !== from.params.urlTag) {
			await this.fetchTag(urlTag)
				.catch(() => this.$router.push({name: 'not-found'}))
			payload.query = urlTag
			await this.getArticlesByTag(payload)
				.catch(() => {})
			this.loaded = true
		}
		next()
	},
	async created() {
		const urlTag = this.$route.params.urlTag
		const page = this.$route.query.page
		let payload = {
			params: {
				params: {
					page: page
				}
			}
		}
		await this.fetchTag(urlTag)
			.catch(() => this.$router.push({name: 'not-found'}))
		payload.query = urlTag
		await this.getArticlesByTag(payload)
			.catch(() => {})
		this.loaded = true
	},
	methods: {
		...mapActions('posts',[
			'getArticlesByTag',
			'setTag',
			'fetchTag'
		])
	}
}
</script>
<style scoped>
	.mt-lg {
		margin-top: 1em;
	}
	h1 {
		margin: 0;
	}
	.mb-lg {
		margin-bottom: 5em;
	}
	.realm-title {
		color: #f5f5f5;
	}
	@media (min-width:500px) {
		.realm-title {
			font-size: 3rem;
		}
	}
</style>
