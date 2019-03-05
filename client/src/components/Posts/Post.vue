<template>
  <div style="padding: 4em">
    <h1>{{ article.title }} </h1>
    <br>
    <div align="">
      {{ article.author }}
    </div>
    <v-img
      :src="article.img"
      max-height="400"
      contain
    />
    <br>
    <p>
      {{ article.body }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'Posts',
	props: {
	},
	data () {
		return {
			article: {}
		}
	},
	computed: {
		...mapGetters([
			'getArticle'
		])
	},
	mounted () {
		this.article = this.getArticle(this.$route.params.id)
	},
	methods: {
	}
}
</script>

<style scoped>

</style>
