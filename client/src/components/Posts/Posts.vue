<template>
  <v-container
    fluid
    class="content"
  >
    <div class="slider-container">
      <div class="ib">
        West Coast
      </div>
      <div class="slide-wrapper">
        <v-slider
          v-model="slider"
        />
      </div>
      <div class="ib">
        East Coast
      </div>
    </div>
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
      most recent
    </h2>
    <timeline
      :articles="timelineArticles"
    />
    <br><br>
    <div v-if="weeklyArticles.length">
      <h2
        class="mb-sm"
        align="left"
      >
        weekly updates
      </h2>

      <display-articles 
        :articles="weeklyArticles"
      />
    </div>
    <div v-else>
      <h2>
        more articles are on the way!
      </h2>
    </div>
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
			slider: 50
		}
	},
	computed: {
		...mapState('posts', ['articles']),
		...mapGetters('posts', ['siteTitle']),
		timelineArticles() {
			return this.articles.slice(1,5)
		},
		weeklyArticles() {
			return this.articles.slice(6)
		}
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
	methods: {
		...mapActions('posts',['fetchArticles'])
	}
}
</script>

<style lang="scss" scoped>
  .content {
    max-width: 1400px;
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
  h2 {
    font-size: 3rem;
  }
  .slider-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    width: 100%;
    margin-top: 1em;
  }
  .slider-container h6 {
    margin: 0;
  }
  .slide-wrapper {
    margin: 0 10px;
    width: 70%;
  }
  .ib {
    display: flex;
    align-items: center;
  }

</style>
