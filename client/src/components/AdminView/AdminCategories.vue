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
        v-for="(category,index) in categories"
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
export default {
	name: 'AdminIndex',
	components: {
		AdminCategoryTile
	},
	data () {
		return {
			categories: [
				{
					title: 'Create Post',
					to: {name: 'admin-create-post'}
				},
				{
					title: 'Edit Posts',
					to: {name: 'admin-edit-posts'}
				},
				{
					title: 'Edit Drafts',
					to: {
						name: 'admin-edit-drafts',
						params: {
							drafts: true
						}
					}
				},
				{
					title: 'Add Admin User'
					// to:''
				},
				{
					title: 'Edit Tags',
					to: {name: 'admin-edit-main'}
				}
			]
		}
	}
}
</script>

<style scoped>

</style>
