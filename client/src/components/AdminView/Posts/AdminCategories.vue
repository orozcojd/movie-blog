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
import { mapState, mapGetters, mapActions } from 'vuex'
import * as types from '@/constants/types'
export default {
	name: 'AdminCategories',
	data () {
		return {
			categories: [
				{
					title: 'Create Post',
					to: {name: types.adminCreatePost.name},
					granted: () => { return true },
					onEnter: () => { this.clearArticle()}
				},
				{
					title: 'Edit Posts',
					to: {name: types.adminEditPosts.name},
					granted: () => { return true }
				},
				{
					title: 'Edit Drafts',
					to: {
						name: types.adminEditDrafts.name,
						params: {
							drafts: true
						}
					},
					granted: () => { return true }
				},
				{
					title: 'Edit Contributor Details',
					to: {
						name: types.adminAboutContributor.name,
						params: {
							drafts: true
						}
					},
					granted: () => { return true }
				},
				{
					title: 'Edit Admin Users',
					to: {name: types.editUsers.name},
					granted: () => {return this.permissionGranted}
				},
				{
					title: 'Add Admin User',
					to: {name: types.addUser.name},
					granted: () => {return this.permissionGranted}
				},

				{
					title: 'Edit Tags',
					to: {name: types.adminEditMain.name},
					granted: () => { return true }
				}
			]
		}
	},
	computed: {
		...mapState('auth',['user']),
		...mapGetters('posts', ['siteTitle']),
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
