<template>
  <v-card
    @click="navigateTo(article._id)"
  >
    <v-img
      lazy
      :src="article.img"
      aspect-ratio="2.75"
    />
    <v-card-title primary-title>
      <div style="width:100%">
        <h3 class="headline mb-0">
          {{ article.title }}
        </h3>
        <div align="left">
          {{ article.thumbnailDescription }}
        </div>
        <br>
        <div align="right">
          {{ article.author }}
        </div>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
	name: 'PostPreview',
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

</style>
