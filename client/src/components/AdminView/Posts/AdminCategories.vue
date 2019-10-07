<template>
  <v-container
    fluid
    grid-list-lg
  >
    <vue-headful
      :title="headTitle"
    />
    <h4>Admin Actions</h4>
    <v-layout
      row
      wrap
      justify-start
    >
      <v-flex
        v-for="(category,index) in viewableCategories"
        :key="index"
        d-flex
        xs6
        sm4
        lg3
      >
        <category
          :category="category"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import * as types from '@/constants/types'
import Category from '@/components/AdminView/Components/Category'
export default {
	name: 'AdminCategories',
	components: {
		Category
	},
	computed: {
		...mapState('auth',['user', 'aclUser', 'permission']),
		...mapGetters('posts', ['siteTitle']),
		headTitle() {
			return `Admin Main - ${this.siteTitle}`
		},
		viewableCategories () {
			return this.categories.filter(category => {
				return category.show()
			})
		},
		categories() {
			return [
				{
					title: 'Create Post',
					to: {name: types.adminCreatePost.name},
					onEnter: () => { this.clearArticle()},
					show: () => {return this.$can('view', 'Post')}
				},
				{
					title: 'Edit Live Posts',
					to: {name: types.adminEditPosts.name},
					show: () => {return this.$can('view', 'Post')}
				},
				{
					title: 'Edit Drafts',
					to: {
						name: types.adminEditDrafts.name,
						params: {
							drafts: true,
						}
					},
					show: () => {return this.$can('view', 'Post')},
				},
				{
					title: 'Review Articles',
					to: {name: types.reviewArticles.name},
					show: () => {return true}
				},
				{
					title: 'Edit Contributor Details',
					to: {name: types.adminAboutContributor.name},
					show: () => {return this.$can('view', 'Contributor')}
				},
				{
					title: 'Edit Admin Users',
					to: {name: types.editUsers.name},
					show: () => {return this.$can('view', 'Users')}
				},
				{
					title: 'Add Admin User',
					to: {name: types.addUser.name},
					show: () => {return this.$can('view', 'User')}
				},
				{
					title: 'Edit Tags',
					to: {name: types.adminEditMain.name},
					show: () => {return this.$can('view', 'Tag')}
				}
			]
		}
	},

	methods: {
		...mapActions('admin',['clearArticle']),
		navigateTo(category) {
			if(category.onEnter) {
				category.onEnter()
			}
			this.$router.push(category.to)
		}
	}
}
</script>

<style scoped>

</style>
