<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex md4 xs12 v-for="article in articles"
        :key=article.id>
        <post-preview
        class="post-preview"
        :article="article"
        to='article-view'/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PostPreview from '@/components/AdminView/PostPreview'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Songs',
  data () {
    return {
    }
  },
  components: {
    PostPreview
  },
  methods: {
    ...mapActions([
      'getArticles'
    ])
  },
  computed: {
    ...mapState([
      'articles'
    ])
  },
  async mounted () {
    /*
      get articles from store
    */
    try {
      if (!this.articles.length) {
        await this.getArticles()
      }
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>
</style>
