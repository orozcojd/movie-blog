<template>
  <v-container fluid>
    <latest-post class="mb-med"/>
    <hr size="5" color="black">
    <br>
    <div class="weekly-header">
      <h2>Weekly Updates</h2>
    </div>
    <br>
    <!-- <div class="weekly-posts"> -->
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs4 v-for="post in 10" :key=post>
            <post-preview/>
          </v-flex>
        </v-layout>
      </v-container>
    <!-- </div> -->
  </v-container>
</template>

<script>
import PostPreview from '@/components/Posts/PostPreview'
import LatestPost from '@/components/Posts/LatestPost'

export default {
  name: 'posts',
  data () {
    return {
    }
  },
  components: {
    PostPreview,
    LatestPost
  },
  methods: {

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
  .weekly-header {
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
