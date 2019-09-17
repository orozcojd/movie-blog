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
    </v-card-title>
    <v-layout
      row
      fill-height
      justify-space-between
      align-end
    >
      <v-btn
        :ripple="false"
        @click="navigateTo(article._id)"
      >
        Edit
      </v-btn>
      <v-btn
        v-if="$can('delete', 'Post')"
        color="error"
        :ripple="false"
        align="left"
        @click="dialog = true"
      >
        Delete
      </v-btn>
    </v-layout>
    <v-layout
      row
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
		}
	},
	data () {
		return {
			dialog: false
		}
	},
	methods: {
		...mapActions('admin',[
			'deleteArticle'
		]),
		navigateTo (articleId) {
			this.$router.push({
				name: 'admin-edit-post',
				params: {
					id: articleId
				}
			})
		},
		deletePost (articleId) {
			this.deleteArticle(articleId)
		}
	}
}
</script>

<style scoped>

</style>
