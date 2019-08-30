<template>
  <v-card
    class="theme-gradient"
    :hover="true"
    raised
    :flat="flat"
    @click="navigateTo(article._id)"
  >
    <v-img
      lazy
      :src="article.img"
      aspect-ratio="2.75"
    />
    <v-card-title
      primary-title
    >
      <div
        class="card-wrapper"
        align="left"
        style="width:100%;"
      >
        <div
          class="card-title"
        >
          <h5>
            {{ article.title }}
          </h5>
        </div>
        <div
          class="card-info overflow-clamp color-light"
        >
          {{ article.thumbnailDescription }}
        </div>
        <br>
      </div>
      <div class="card-author">
        <small><strong>{{ article.author.toUpperCase() }}</strong></small>
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
		},
		flat: {
			type: Boolean,
			required: false,
			default: false
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
  h5 {
  margin: 0 !important;
}
.card-wrapper {
  height: 230px
}
.overflow-clamp {
  /* max-height: calc(18px + .2vw) * 3; */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; 
  text-overflow: ellipsis;
}
.card-author {
  font-size: 0.7em;
}
.card-title {
  /* color: #ffff; */
  max-height: 5.3em;
  overflow: hidden;
  margin-bottom: 1em;
}
.color-light {
  color: #2b2b2a
}
.card-info {
  font-family: 'Mitr Roboto', sans-serif;
  font-size: 0.9em;
  line-height: 1.1em;
  max-height: 4.3em;
  position: relative;
}
.theme-gradient {
  background-image: linear-gradient(to bottom right, #d6cde5, #bdc3e5, #e3e7ee);
}
@media (max-width: 1264px) {
  .card-wrapper {
    height: 200px;
  }
}
@media (max-width: 600px) {
  .card-wrapper {
    height: 180px;
  }
}
@media (max-width: 320px) {
  .card-wrapper {
    height: auto;
  }
  .card-title {
    height: auto;
    max-height: none;
  }
  .card-info {
    display: none;
  }
}

</style>
