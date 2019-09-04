<template>
  <v-container
    fluid
    class="content"
  >
    <vue-headful
      :title="siteTitle"
      description="Description from vue-headful"
    />
    <v-layout
      justify-center
    >
      <v-flex
        xs12
      >
        <latest-post
          v-if="articles && articles.length"
          class="mb-med"
          :article="articles[0]"
        />
      </v-flex>
    </v-layout>
    <hr
      size="5"
      color="#bdc3e5"
    >
    <br>
    <h2
      align="left"
    >
      Most Recent
    </h2>
    <timeline
      :articles="articles.slice(1)"
    />
    <br><br>
    <h2
      class="mb-sm"
      align="left"
    >
      Weekly Updates
    </h2>

    <display-articles 
      :articles="articles.slice(6)"
    />
  </v-container>
</template>

<script>
'use strict'
import { mapActions, mapState, mapGetters } from 'vuex'
import store from '@/store'
export default {
	name: 'Posts',
	components: {
		LatestPost: () => import('@/components/Posts/LatestPost'),
		DisplayArticles: () => import('@/components/Layouts/DisplayArticles'),
		Timeline: () => import('@/components/Layouts/Timeline')
	},
	data () {
		return {
		}
	},
	computed: {
		...mapState('posts', ['articles']),
		...mapGetters('posts', ['siteTitle']),
	},
	beforeRouteEnter (to, from, next) {
		let options = {
			params: {
				params: {
					limit: 15,
				},
				extend: false
			}
		}
		store.dispatch('posts/fetchArticles', options)
		next()
	},
	async mounted () {
		// let options = {
		// 	params: {
		// 		params: {
		// 			limit: 15,
		// 		},
		// 		extend: false
		// 	}
		// }
		// await this.fetchArticles(options)
		// .catch(err => console.log(err))
	},
	methods: {
		...mapActions('posts',['fetchArticles'])
	}
}
</script>

<style lang="scss" scoped>
  .content {
    max-width: 1920px
  }
  .container {
    padding-top: 0 !important;
  }
  .mb-lg {
    margin-top: 120px;
  }
  .mb-med {
    margin-bottom: 80px;
  }
  .mb-sm {
    margin-bottom: 40px;
  }
  .weekly-container {
    overflow: scroll;
  }
  .weekly-header {
    margin-top: 40px;
    display: flex;
    align-content: flex-start;
  }
  .weekly-posts {
    display: flex;
    /* flex-direction: row; */
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .post-preview {
    cursor: pointer;
  }
  h2{
    font-size: 3rem;
  }
</style>
