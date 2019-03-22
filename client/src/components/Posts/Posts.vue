<template>
  <v-container fluid>
    <v-layout
      class="main-title"
      justify-center
    >
      <v-flex
        xs12
        md12
      >
        <h1>Unsolicited.mp3</h1>
      </v-flex>
    </v-layout>
    <v-layout
      justify-center
    >
      <v-flex
        xs12
      >
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
            <display-articles 
              :articles="filterArticles.slice(1)"
            />
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
'use strict'
import LatestPost from '@/components/Posts/LatestPost'
import DisplayArticles from '@/components/Layouts/DisplayArticles'

import { mapActions, mapState } from 'vuex'

// import WeeklyPostView from '@/components/Posts/WeeklyPostView'
export default {
	name: 'Posts',
	components: {
		LatestPost,
		DisplayArticles
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

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Permanent+Marker');
// @import url('../../assets/style/tiptap.scss');

@media only screen and (max-width: 420px) {
    h1 {
      font-size: 3.5rem !important;
    }
  }
  // h1 {
  //     font-size: 6.75rem !important;
  //   }
  .container {
    padding-top: 0 !important;
  }
  .main-title {
    font-family: 'Permanent Marker', cursive;
    font-size: 5em;
    /* margin-bottom: 1em; */
    color: black;
  }
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
