<template>
  <v-container fluid>
    <latest-post class="mb-med"/>
    <hr size="5" color="black">
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
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex md4 xs12 v-for="post in 10"
          :key=post>
          <post-preview :article="article"/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import ArticleService from '@/services/ArticleService'

import PostPreview from '@/components/Posts/PostPreview'
import LatestPost from '@/components/Posts/LatestPost'
// import WeeklyPostView from '@/components/Posts/WeeklyPostView'
export default {
  name: 'posts',
  data () {
    return {
      article: {
        title: "How the UK's Last Mass Shooting Still Hurts Locals 20 Years Later",
        description: "In Dunblane, the town that saw the last mass shooting in British history, survivors and the victims' families grapple with its legacy.",
        author: 'Jonathan Orozco'
      }
    }
  },
  components: {
    PostPreview,
    LatestPost
  },
  methods: {
  },
  async mounted () {
    console.log('MOUNTED')
    try {
      const response = await ArticleService.showArticles()
      console.log(response.data)
    } catch (e) {
      console.log(e)
    }
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
</style>
