<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex md4 xs12 v-for="article in articles.slice(1)"
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
import PostPreview from '@/components/Posts/PostPreview'

export default {
  name: 'Songs',
  props: {
    articles: {
      type: Array,
      required: true
    }
  },
  components: {
    PostPreview
  },
  data () {
    return {
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .post-preview {
    cursor: pointer;
  }
</style>
