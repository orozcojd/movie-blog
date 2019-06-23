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
        <h3>
          {{ article.title }}
        </h3>
        <div
          class="card-description color-light overflow-clamp"
        >
          {{ article.thumbnailDescription }}
        </div>
        <br>
        <div
          class="color-light card-author"
          align="left"
        >
          <small>{{ article.author.toUpperCase() }}</small>
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
  .card-author {
    font-size: 0.7em;
  }
  h3 {
    margin-top: 0px;
    margin-bottom:10px
  }
  .overflow-clamp {
    max-height: calc(18px + .2vw) * 3;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; 
    text-overflow: ellipsis;
}
  .color-light {
    color:gray;
  }
</style>
