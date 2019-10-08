<template>
  <v-card>
    <v-img
      lazy
      :src="article.img"
      aspect-ratio="2.75"
    />
    <v-card-title primary-title>
      <div style="width:100%">
        <h3 class="headline mb-0">
          {{ article.title }}
        </h3>
        <div align="left">
          {{ article.thumbnailDescription }}
        </div>
        <br>
        <div align="right">
          {{ article.author }}
        </div>
        <br>
        <div align="left">
          {{ article.updatedAt }}
        </div>
      </div>
      <hr>
      <v-layout
        v-if="review"
        row
        wrap
        fill-height
        justify-space-between
        align-end
      >
        <v-btn
          @click="claim(article)"
        >
          Claim
        </v-btn>
      </v-layout>
      <v-layout
        v-else-if="reviewer"
        row
        wrap
        fill-height
        justify-space-between
        align-end
      >
        <!-- <v-btn
        color="error"
        @click="unclaim(article)"
      >
        unclaim
      </v-btn> -->
        <v-btn
          @click="reviewArticle(article)"
        >
          review
        </v-btn>
      </v-layout>
      <v-layout
        v-else
        row
        wrap
        fill-height
        justify-space-between
        align-end
      >
        <v-btn
          v-if="$can('delete', 'Post')"
          color="error"
          :ripple="false"
          align="left"
          @click="dialog = true"
        >
          Delete
        </v-btn>
        <v-btn
          :ripple="false"
          @click="navigateTo('admin-edit-post', article._id)"
        >
          Edit
        </v-btn>
      </v-layout>
    </v-card-title>
    <v-layout
      row
      wrap
      justify-center
    >
      <v-dialog
        v-model="dialog"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">
            Are you sure you want to delete this article?
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="red darken-1"
              flat
              @click="dialog = false"
            >
              No
            </v-btn>
            <v-btn
              color="green darken-1"
              flat
              @click="deletePost(article._id)"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
	name: 'PostPreview',
	props: {
		article: {
			type: Object,
			required: true
		},
		review: {
			type: Boolean
		},
		reviewer: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			dialog: false
		}
	},
	mounted() {
		console.log(this.article)
	},
	methods: {
		...mapActions('admin',[
			'deleteArticle',
			'claimArticle'
		]),
		...mapActions('error',['handleConnectionError']),
		navigateTo (name, articleId) {
			this.$router.push({
				name: name,
				params: {
					id: articleId
				}
			})
		},
		async deletePost (articleId) {
			await this.deleteArticle(articleId)
			this.dialog = false
		},
		async claim(article) {
			await this.claimArticle(article.review._id)
				.then(() => this.navigateTo('review-articles', article.review._id))
				.catch((err) => {
					this.handleConnectionError(err)
					this.$router.push('/admin')
				})
		},
		reviewArticle(article) {
			this.$router.push({
				name: 'review-articles',
				params: {
					id: article.review._id
				}
			})
		}
	}
}
</script>

<style scoped>

</style>
