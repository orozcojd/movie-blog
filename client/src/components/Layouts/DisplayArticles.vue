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
        lg4
        sm6
        xs12
      >
        <post-preview
          class="post-preview"
          :article="article"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import PostPreview from '@/components/Posts/PostPreview'

export default {
	name: 'DisplayArticles',
	components: {
		PostPreview: () => import('@/components/Posts/PostPreview'),
	},
	props: {
		articles: {
			type: Array,
			required: true
		}
	},
}
</script>

<style scoped>

</style>
