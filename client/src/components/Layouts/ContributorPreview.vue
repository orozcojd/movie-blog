<template>
  <v-container
    grid-list-xl
  >
    <v-layout
      row
      wrap
      justify-center
      class="wrapper"
    > 
      <v-flex
        xs12
      >
        <vue-headful
          :title="headTitle"
        />
        <h1 align="left">
          {{ contributor.name }}
        </h1>
        <v-layout
          row
          wrap
        >
          <v-flex
            xs12
            md4
          >
            <v-img
              :src="contributor.img"
              max-width="400"
              max-height="400"
              position="left"
            />
        
            <div
              class="inline-social"
            >
              <font-awesome-icon
                v-if="contributor && contributor.facebook"
                class="iconHover"
                :icon="['fab', 'facebook-square']"
                color="gray"
                @click="openLink(contributor.facebook)"
              />
              <font-awesome-icon
                v-if="contributor && contributor.twitter" 
                class="iconHover"
                :icon="['fab', 'twitter-square']"
                color="gray"
                @click="openLink(contributor.twitter)"
              />
              <font-awesome-icon
                v-if="contributor && contributor.instagram" 
                class="iconHover"
                :icon="['fab', 'instagram']"
                color="gray"
                @click="openLink(contributor.instagram)"
              />
            </div>
          </v-flex>
          <v-flex
            xs12
            md7
            offset-md1
          >
            <p
              v-for="(p, i) in bio"
              :key="i"
              class="about"
            >
              {{ p }}
            </p>
          </v-flex>
        </v-layout>
        <br><br><br>
        <h1>Contributed Articles</h1>
        <v-layout
          v-if="articles.length"
          row
          wrap
          justify-start
          align-start
        >
          <v-flex
            v-for="article in articles"
            :key="article.id"
            xs12
            sm6
            lg4
          >
            <post-preview
              :article="article"
              to="article-view"
            />
          </v-flex>
        </v-layout>
        <v-layout
          justify-center
          class="mt-lg"
        >
          <v-pagination
            v-model="pageNo"
            :length="pages"
            :total-visible="pagesVisibile"
          />
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
	name: 'ContributorView',
	components: {
		PostPreview: () => import('@/components/Posts/PostPreview'),
	},
	data () {
		return {
		}
	},
	computed: {
		...mapState('posts',[
			'contributor',
			'articles',
			'pages',
			'page',
			'pagesVisibile'
		]),
		bio() {
			return this.contributor.bio ? this.contributor.bio.split('\n') : ''
		},
		...mapGetters('posts', ['siteTitle']),
		headTitle() {
			return `${this.contributor.name} - ${this.siteTitle}`
		},
		pageNo: {
			get() {
				return this.page
			},
			set(val) {
				this.$router.push({name: 'about-contributor',
					params: {
						id: this.contributor._id,
						contributor: this.contributor.name.toLowerCase().split(' ').join('-')
					}, 
					query: {
						page: val
					}
				})
			}
		}
	},
	async mounted() {
		await this.getContributorBio(this.$route.params.id)
		const page = this.$route.query.page
		let payload = {
			params: {
				params: {
					page: page,
					postPreview: true
				}
			}
		}
		payload.query = this.contributor._id
		await this.fetchArticleByContributor(payload)
	},
	methods: {
		...mapActions('posts',[
			'getContributorBio',
			'fetchArticleByContributor'
		]),
		openLink(site) {
			window.open(site);
		}
	}
}
</script>

<style scoped>

.inline-social {
  display: flex;
  justify-content: start;
  align-items: center;
}
.inline-social svg {
  width: auto;
  height: 1em;
  /* You would have to include the following two lines to make this work in Safari */
  max-width: 100%;
  max-height: 100%;
  margin: 1rem;
  display: inline-block;
  cursor: pointer;
}
.inline-social a {
  display:inline-block;
  line-height:0;
  font-size: 0;
}
 .iconHover:hover{
   color: indigo;
 }
.margin-xs {
  margin: 8px
}
h1 {
  font-size: 2.5em;
  margin-bottom: 2.5rem;
}

@media (max-width: 600px){
  .wrapper {
    padding: 1em;
  }
}


</style>
