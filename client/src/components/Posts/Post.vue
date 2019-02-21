<template>
  <div style="padding: 4em">
    <h1>{{ article.title}} </h1>
    <br>
    <div align="">{{ article.author }} </div>
    <v-img
      :src="article.img"
      max-height="400"
      contain/>
      <br>
      <p>
        {{ article.body }}
      </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'posts',
  props: {
  },
  mounted () {
    this.article = this.getArticle(this.$route.params.id)
  },
  data () {
    return {
      article: {}
    }
  },
  methods: {
  },
  computed: {
    ...mapGetters([
      'getArticle'
    ])
  }
}
</script>

<style scoped>

</style>
