<template>
  <v-container fluid>
    <latest-post
      v-if="filterArticles.length"
      class="mb-med"
      :article="filterArticles[0]"
    />
    <hr
      size="5"
      color="black"
    >
    <br>
    <div class="weekly-header">
      <h2>Weekly Updates</h2>
    </div>
    <br>
    <!-- <v-container fluid grid-list-md class="weekly-container">
      <v-layout row fill-height>
        <v-flex v-for="post in 10"
          :key=post>
          <weekly-post-view/>
        </v-flex>
      </v-layout>
    </v-container> -->
    <div class="weekly-header">
      <h2>All posts</h2>
    </div>
    <br>
    <v-container
      fluid
      grid-list-md
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="article in filterArticles.slice(1)"
          :key="article.id"
          md4
          xs12
        >
          <post-preview
            class="post-preview"
            :article="article"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
'use strict'
import PostPreview from '@/components/Posts/PostPreview'
import LatestPost from '@/components/Posts/LatestPost'
import { mapActions, mapState } from 'vuex'

// import WeeklyPostView from '@/components/Posts/WeeklyPostView'
export default {
	name: 'Posts',
	components: {
		PostPreview,
		LatestPost
	},
	data () {
		return {
		}
	},
	computed: {
		...mapState([
			'articles'
		]),
		filterArticles () {
			return this.articles.filter(article => !article.draft)
		}
	},
	async mounted () {
		try {
			if (!this.articles.length) {
				await this.getArticles()
			}
		} catch (e) {
			// console.log(e)
		}
	},
	methods: {
		...mapActions([
			'getArticles'
		])
	}
}
</script>

<style scoped>
  .mb-lg {
    margin-top: 120px;
  }
  .mb-med {
    margin-bottom: 80px;
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
</style>
