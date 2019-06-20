<template>
  <v-container
    fluid
    class="content"
  >
    <vue-headful
      :title="siteTitle"
      description="Description from vue-headful"
    />
    <!-- <v-layout
      class="main-title"
      justify-center
    >
      <v-flex
        xs12
      >
        <h1>{{ siteTitle }}</h1>
      </v-flex>
    </v-layout> -->
    <v-layout
      justify-center
    >
      <v-flex
        xs12
      >
        <latest-post
          v-if="articles.length"
          class="mb-med"
          :article="articles[0]"
        />
      </v-flex>
    </v-layout>
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
import LatestPost from '@/components/Posts/LatestPost'
import DisplayArticles from '@/components/Layouts/DisplayArticles'
import Timeline from '@/components/Layouts/Timeline'
import { mapActions, mapState, mapGetters } from 'vuex'
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
		...mapGetters([
			'siteTitle'
		])
	},
	async mounted () {
		let options = {
			params: {
				params: {
					// skip: 0,
					limit: 15
				},
				extend: false
			}
		}
		await this.getArticles(options)
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
// Large devices (desktops, less than 1200px)
  // @media (min-width: 10em) {
  //   h1 {
  //     font-size: 0.5em !important;
  //   }
  // }
  // @media (min-width: 25em) {
  //   h1 {
  //     font-size: 1em !important;
  //   }
  // }
  // @media (min-width: 40em) {
  //   h1 {
  //     font-size: 1.7em !important;
  //   }
  // }
  // @media (min-width: 50em) {
  //   h1 {
  //     font-size: 2em !important;
  //   }
  // }
  // @media (min-width: 75em) {
  //   h1 {
  //     font-size: 2.5em !important;
  //   }
  // }
  // @media (min-width: 100em) {
  //   h1 {
  //     font-size: 3em !important;
  //   }
  // }
  // @media (min-width: 115em) {
  //   h1 {
  //     font-size: 4em !important;
  //   }
  // }
  // @media (min-width: 145em) {
  //   // * {font-size: 1.4em;}
  //   h1 {
  //     font-size: 4.6em !important;
  //   }
  // }
  // h1 {
  //     font-size: 6.75rem !important;
  //   }
  .content {
    max-width: 1920px
  }
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
