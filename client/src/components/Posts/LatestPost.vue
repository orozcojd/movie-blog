<template>
  <v-card class="point-cursor"
    @click="navigateTo(article._id)">
    <v-layout row wrap>
      <v-flex xs12 md8>
        <v-img
        :src="article.img"
        contain
        alt="latest-post-img"/>
      </v-flex>
      <v-flex class="layout" xs12 md4>
        <v-layout align-space-around justify-space-between column fill-height class="header">
          <v-card-title primary-title>
            <div>
              <h3 class="headline" align="left">{{ article.title }}</h3>
            <br>
            <p align="left">
              {{ article.thumbnailDescription }}
            </p>
          </div>
          </v-card-title>
          <p align="right">{{ article.author }}</p>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'latest-post',
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
    navigateTo (articleId) {
      this.$router.push({
        name: 'article-view',
        params: {
          id: articleId
        }
      })
    }
  }
}
</script>

<style scoped>
.header {
  margin: 10px;
}
.header-text {
  font-size: 150%;
}
.point-cursor {
  cursor: pointer;
}

@media screen and (max-width: 375px) {

}
</style>
