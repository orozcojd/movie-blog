<template>
  <v-card
    :hover="true"
    raised
    @click="navigateTo(article._id)"
  >
    <v-img
      lazy
      :src="article.img"
      aspect-ratio="2.75"
    />
    <v-card-title
      primary-title
      class="title-wrapper"
    >
      <div
        class="card-wrapper"
        align="left"
        style="width:100%;"
      >
        <div
          class="card-title"
        >
          <h3>
            {{ article.title }}
          </h3>
        </div>
        <div
          class="card-info"
        >
          {{ article.thumbnailDescription }}
        </div>
        <br>
        <!-- <div align="right">
          {{ article.author }}
        </div> -->
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
.card-wrapper {
  height: 180px
}
.card-title {
  height: 72px;
  overflow:hidden;
  text-overflow: ellipsis;
  margin-bottom: 2em;
}
.card-info {
    max-height: 60px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; 
  text-overflow: ellipsis;
}

</style>
