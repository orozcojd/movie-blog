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
            class="title-container"
          >
            <div id="latest-title">
              <h4>
                <b>
                  {{ article.title }}
                </b>
              </h4>
            </div>
            <div id="latest-description">
              <p 
                class="card-description"
                align="left"
              >
                {{ article.thumbnailDescription }}
              </p>
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
.title-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
  .title-container {
    padding-top: 24px;
  }
  .card-description {
    font-size: 16px;
  }
@media (min-width: 960px) and (max-width: 1100px){
    .title-container {
      padding-top: 0;
    }
    .card-description {
      font-size: 14px;
    }
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
  color: #767676;
}
</style>
