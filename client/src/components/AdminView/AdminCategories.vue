<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
      justify-space-around
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
			categories: {
				create: {
					title: 'Create Post',
					to: {name: 'admin-create-post'}
				},
				edit: {
					title: 'Edit Posts',
					to: {name: 'admin-edit-posts'}
				},
				drafts: {
					title: 'Edit Drafts',
					to: {
						name: 'admin-edit-drafts',
						params: {
							drafts: true
						}
					}
				},
				addAdmin: {
					title: 'Add Admin User'
					// to:''
				},
				statistics: {
					title: 'Edit Admin Content',
					to: {name: 'admin-edit-main'}
				}
			}
		}
	}
}
</script>

<style scoped>

</style>
