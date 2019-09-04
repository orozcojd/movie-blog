<template>
  <v-card
    class="gradient"
    :hover="true"
    raised
    @click="navigateTo(article._id)"
  >
    <v-card-title
      primary-title
    >
      <div
        class="timeline-title"
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
    color: whitesmoke;
    font-weight: bold;
  }
  .gradient {
    background-image: linear-gradient(to bottom right, #9982c0, #5c6bc0, #bbc3d6);
  }
  /*background-image: linear-gradient(to bottom right, #5c6bc0, #9982c0, #bbc3d6); */
  .timeline-title {
    color: #ffff;
  }
  .v-timeline-item__inner-dot{
    display: none;
  }
</style>
