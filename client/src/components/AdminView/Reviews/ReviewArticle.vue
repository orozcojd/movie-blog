<template>
  <div>
    <admin-preview
      v-if="article._id"
      :article="article"
    />
    <v-container
      fluid
      class="post-content"
    >
      <div class="margin-content">
        <h6>Comments for contributor</h6>
        <v-textarea 
          v-model="comments"
        />
      </div>
      <div class="flex-row">
        <v-btn
          color="error"
          @click="submit(false)"
        >
          Reject Article
        </v-btn>
        <v-btn
          @click="submit(true)"
        >
          Accept Article
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AdminPreview from '@/components/AdminView/Posts/AdminPreview'
export default {
	name: 'ReviewPosts',
	components: {
		AdminPreview
	},
	data () {
		return {
			comments: ''
		}
	},
	computed: {
		...mapState('admin', ['article'])
	},
	async created () {
		await this.reviewArticlesId(this.$route.params.id)
			.then(() => {
				this.comments = this.article.review.comments
			})
			.catch(err => {
				console.log(err)
			})
		console.log(this.article)
		
	},
	methods: {
		...mapActions('admin', ['reviewArticlesId', 'updateArticleStatus']),
		...mapActions('error',['handleConnectionError']),
		submit(status) {
			console.log()
			this.updateArticleStatus({
				id: this.article.review._id,
				accept: status,
				comments: this.comments
			})
				.then(() => {this.$router.push({name: 'review'})})
				.catch((err) => {
					this.handleConnectionError(err)
					this.$router.push({name: 'review'})
				})
		}
	}
}
</script>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
  .margin-content {
    margin: 0 1em;
  }
</style>
