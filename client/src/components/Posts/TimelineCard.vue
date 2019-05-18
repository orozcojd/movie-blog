<template>
  <v-card
    :hover="true"
    raised
    @click="navigateTo(article._id)"
  >
    <v-card-title
      primary-title
    >
      <div
        align="left"
        style="width:100%;"
      >
        <h2
          style="margin-bottom:10px"
        >
          {{ article.title }}
        </h2>
        <div
          class="card-description"
        >
          {{ article.thumbnailDescription }}
        </div>
        <br>
        <div align="left">
          {{ article.author }}
        </div>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
	name: 'TimelineCard',
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
  .card-description {
    font-size: 1.2rem;
  }
</style>
