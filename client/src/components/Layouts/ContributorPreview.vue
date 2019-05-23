<template>
  <card-view>
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
          aspect-ratio="1"
          contain
          :src="contributor.img"
          max-width="400"
          max-height="400"
          position="left"
        />
        <div class="inline-social">
          <a
            v-if="twitter"
            :href="twitter"
            target="_"
          >
            <twitter 
              width="50"
              height="50"
            />
          </a>
          <a
            v-if="facebook"
            :href="facebook"
            target="_"
          >
            <facebook style="margin-right:10px" />
          </a>
          <a
            v-if="instagram"
            :href="instagram"
            target="_"
          >
            <instagram
              width="40"
              height="40"
            />
          </a>
        </div>
      </v-flex>
      <v-flex
        xs12
        md8
      >
        <p
          v-for="(p, i) in bio"
          :key="i"
          class="about"
          align="left"
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
        md4
        xs12
      >
        <post-preview
          class="margin-lg"
          :article="article"
          to="article-view"
        />
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-pagination
        v-model="pageNo"
        :length="pages"
      />
    </v-layout>
  </card-view>
</template>

<script>
import Facebook from '@/components/Icons/Facebook'
import Twitter from '@/components/Icons/Twitter'
import Instagram from '@/components/Icons/Instagram'
import { mapActions, mapState, mapGetters } from 'vuex'
import PostPreview from '@/components/Posts/PostPreview'
import CardView from '@/components/Layouts/CardView'
export default {
	name: 'ContributorView',
	components: {
		PostPreview,
		CardView,
		Twitter,
		Instagram,
		Facebook
	},
	data () {
		return {
		}
	},
	computed: {
		...mapState([
			'contributor',
			'articles',
			'pages',
			'page'
		]),
		bio() {
			return this.contributor.bio ? this.contributor.bio.split('\n') : ''
		},
		...mapGetters([
			'siteTitle'
		]),
		headTitle() {
			return `${this.contributor.name} - ${this.siteTitle}`
		},
		twitter() {
			return this.contributor.twitter ? `https://www.twitter.com/${this.contributor.twitter}` : null
		},
		facebook() {
			return this.contributor.facebook ? `https://www.facebook.com/${this.contributor.facebook}` : null
		},
		instagram() {
			return this.contributor.instagram ? `https://www.instagram.com/${this.contributor.instagram}` : null
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
					page: page
				}
			}
		}
		payload.query = this.contributor._id
		await this.getArticleByContributor(payload)
	},
	methods: {
		...mapActions([
			'getContributorBio',
			'getArticleByContributor'
		])
	}
}
</script>

<style scoped>
.inline-social {
	display: flex;
	justify-content: start;
	align-items: center;
}
.inline-social svg{
	margin: 1rem;
	display: inline
}
	.margin-lg {
		margin: 8px
	}
  h1 {
    font-size: 3rem;
    margin-bottom: 2.5rem;
  }
</style>
