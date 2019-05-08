<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
      justify-start
    >
      <v-flex
        v-for="(category,index) in viewableCategories"
        :key="index"
        d-flex
        xs12
        md6
      >
        <admin-category-tile
          :category="category"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AdminCategoryTile from './AdminCategoryTile'
import { mapState } from 'vuex'

export default {
	name: 'AdminCategories',
	components: {
		AdminCategoryTile
	},
	data () {
		return {
			categories: [
				{
					title: 'Create Post',
					to: {name: 'admin-create-post'},
					granted: () => { return true }
				},
				{
					title: 'Edit Posts',
					to: {name: 'admin-edit-posts'},
					granted: () => { return true }
				},
				{
					title: 'Edit Drafts',
					to: {
						name: 'admin-edit-drafts',
						params: {
							drafts: true
						}
					},
					granted: () => { return true }
				},
				{
					title: 'Add Admin User',
					to: {name: 'admin-add-user'},
					granted: () => {return this.permissionGranted}
				},
				{
					title: 'Edit Tags',
					to: {name: 'admin-edit-main'},
					granted: () => { return true }
				}
			]
		}
	},
	computed: {
		...mapState([
			'user'
		]),
		viewableCategories () {
			return this.categories.filter((category) => {
				return category.granted && category.granted()
			})
		},
		permissionGranted() {
			return !!this.user && this.user.permission === 1
		}
	},
	mounted (){
		console.log(this.user)
	}
}
</script>

<style scoped>

</style>
