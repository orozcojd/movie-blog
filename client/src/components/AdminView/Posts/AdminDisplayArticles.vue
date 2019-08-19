<template>
  <v-container
    fluid
    grid-list-md
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
        <tile-preview
          class="post-preview"
          :article="article"
          to="article-view" 
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
	name: 'DisplayArticles',
	components: {
		TilePreview: () => import('@/components/AdminView/Posts/TilePreview')
	},
	props: {
		articles: {
			type: Array,
			required: true
		}
	}
}
</script>

<style scoped>

</style>
