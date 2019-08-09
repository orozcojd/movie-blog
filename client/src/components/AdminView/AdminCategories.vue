<template>
  <v-container
    fluid
    grid-list-lg
  >
    <vue-headful
      :title="headTitle"
    />
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
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">
                {{ category.title }}
              </h3>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn
              flat
              color="orange"
              :ripple="false"
              @click="navigateTo(category)"
            >
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import AdminCategoryTile from './AdminCategoryTile'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	name: 'AdminCategories',
	// components: {
	// 	AdminCategoryTile
	// },
	data () {
		return {
			categories: [
				{
					title: 'Create Post',
					to: {name: 'admin-create-post'},
					granted: () => { return true },
					onEnter: () => { this.setSingleArticle({})}
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
					title: 'Edit Contributor Details',
					to: {
						name: 'admin-about-contributor',
						params: {
							drafts: true
						}
					},
					granted: () => { return true }
				},
				{
					title: 'Edit Admin Users',
					to: {name: 'admin-edit-users'},
					granted: () => {return this.permissionGranted}
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
		...mapGetters([
			'siteTitle'
		]),
		headTitle() {
			return `Admin Main - ${this.siteTitle}`
		},
		viewableCategories () {
			return this.categories.filter((category) => {
				return category.granted && category.granted()
			})
		},
		permissionGranted() {
			return !!this.user && this.user.permission === 1
		}
	},
	methods: {
		...mapActions(['setSingleArticle']),
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
