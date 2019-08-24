<template>
  <v-card
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
          class="header"
        >
          <v-card-title 
            primary-title
            class="flex-between"
          >
            <div id="latest-title">
              <h2>
                <b>
                  {{ article.title }}
                </b>
              </h2>
              <!-- <br>
              <p 
                class="card-description"
                align="left"
              >
                {{ article.thumbnailDescription }}
              </p> -->
              <!-- </p> -->
            </div>
            <div
              class="color-light"
              align="left"
            >
              <small>{{ article.author.toUpperCase() }}</small>
            </div>
          </v-card-title>
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
.flex-between {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

/* remove margins from latest post*/
h2 {
  margin-top: 0 !important;
}

.card-header {
  font-size: 2rem;
}
.point-cursor {
  cursor: pointer;
}
.color-light {
  color: #2b2b2a;
}
</style>
