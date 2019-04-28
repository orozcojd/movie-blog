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
        <h2
          align="left"
        >
          Most Recent
        </h2>
      </v-flex>
    </v-layout>
    <timeline
      :articles="filterArticles.slice(1)"
    />
    <br><br>
    <h2
      class="mb-sm"
      align="left"
    >
      Weekly Updates
    </h2>
    <v-container
      fluid
      grid-list-md
    >
      <display-articles 
        :articles="filterArticles.slice(1)"
      />
    </v-container>
  </v-container>
</template>

<script>
'use strict'
import LatestPost from '@/components/Posts/LatestPost'
import DisplayArticles from '@/components/Layouts/DisplayArticles'
import Timeline from '@/components/Layouts/Timeline'

import { mapActions, mapState } from 'vuex'

// import WeeklyPostView from '@/components/Posts/WeeklyPostView'
export default {
	name: 'Posts',
	components: {
		LatestPost,
		DisplayArticles,
		Timeline
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
		await this.getArticles()
		// try {
		// 	if (!this.articles.length) {
		// 		await this.getArticles()
		// 	}
		// } catch (e) {
		// 	// console.log(e)
		// }
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
      font-size: 3rem !important;
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
    font-size: 3rem !important;
    /* margin-bottom: 1em; */
    color: black;
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
