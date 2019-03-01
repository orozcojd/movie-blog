<template>
  <v-card>
    <v-img
      lazy
      :src="article.img"
      aspect-ratio="2.75">
    </v-img>
    <v-card-title primary-title>
      <div style="width:100%">
        <h3 class="headline mb-0">{{ article.title }}</h3>
        <div align="left">{{ article.thumbnailDescription }} </div>
        <br>
        <div align="right">{{ article.author }} </div>
      </div>
    </v-card-title>
    <v-layout row fill-height justify-space-between align-end>
      <v-btn
        @click="navigateTo(article._id)"
        :ripple="false"
      >Edit</v-btn>
      <v-btn
      @click="deletePost(article._id)"
      color="error"
      :ripple="false"
      align="left"
      >Delete</v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'post-preview',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions([
      'deleteArticle'
    ]),
    navigateTo (articleId) {
      this.$router.push({
        name: 'admin-edit-post',
        params: {
          id: articleId
        }
      })
    },
    deletePost (articleId) {
      this.deleteArticle(articleId)
    }
  }
}
</script>

<style scoped>

</style>
