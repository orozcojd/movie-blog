<template>
  <v-container
    fluid
    grid-list-xl
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        v-for="article in articles"
        :key="article.id"
        md4
        xs12
      >
        <admin-post-preview
          v-if="admin"
          class="post-preview"
          :article="article"
          to="article-view" 
        />
        <post-preview
          v-else
          class="post-preview"
          :article="article"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AdminPostPreview from '@/components/AdminView/PostPreview'
import PostPreview from '@/components/Posts/PostPreview'

export default {
	name: 'DisplayArticles',
	components: {
		AdminPostPreview,
		PostPreview,
	},
	props: {
		articles: {
			type: Array,
			required: true
		},
		admin: {
			type: Boolean,
			default: false
		}
	},
}
</script>

<style scoped>

</style>
