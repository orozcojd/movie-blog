<template>
  <v-card
    dark
    class="point-cursor"
    @click="navigateTo(article._id)"
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        md8
      >
        <v-img
          :src="article.img"
          :lazy-src="article.lazyImg"
          alt="latest-post-img" 
          max-height="600px"
        />
      </v-flex>
      <v-flex
        class="layout"
        xs12
        md4
      >
        <v-layout
          align-space-around
          justify-space-between
          column
          fill-height
          class="header"
        >
          <v-card-title primary-title>
            <div>
              <h3
                class="card-header"
                align="left"
              >
                {{ article.title }}
              </h3>
              <br>
              <p 
                class="card-description"
                align="left"
              >
                {{ article.thumbnailDescription }}
              </p>
            </div>
          </v-card-title>
          <v-card-text>
            <div align="left">
              {{ article.author }}
            </div>
          </v-card-text>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
	name: 'LatestPost',
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
.card-description {
  font-size: 16px;
}
/* .card-header {
  font-size: 2em;
} */
.point-cursor {
  cursor: pointer;
}

@media screen and (max-width: 375px) {

}
</style>
