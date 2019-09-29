<template>
  <v-container fluid>
    <admin-display-articles 
      :articles="articles"
      :review="true"
    />
  </v-container>
</template>

<script>
import { mapActions, mapState} from 'vuex'
import AdminDisplayArticles from '@/components/AdminView/Posts/AdminDisplayArticles'
export default {
	name: 'ReviewPosts',
	components: {
		AdminDisplayArticles
	},
	data () {
		return {
		}
	},
	computed: {
		...mapState('admin', ['articles'])
	},
	async created() {
		await this.reviewArticles()
	},
	mounted () {
		console.log(this.articles)
	},
	methods: {
		...mapActions('admin', ['reviewArticles'])
	}
}
</script>

<style scoped>

</style>
