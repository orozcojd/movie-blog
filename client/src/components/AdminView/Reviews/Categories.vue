<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
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
import * as types from '@/constants/types'
import Category from '@/components/AdminView/Components/Category'
import { mapActions } from 'vuex'
export default {
	name: 'Reviews',
	components: {
		Category
	},
	computed: {
		categories() {
			return [
				{
					title: 'Articles to fix',
					to: {name: 'edit-review'},
					onEnter: () => { this.clearArticles()},
					show: () => {return this.$can('view', 'Post')}
				},
				{
					title: 'Articles awaiting review',
					to: {name: 'await-review'},
					onEnter: () => { this.clearArticles()},
					show: () => {return this.$can('view', 'Post')}
				},
				{
					title: 'Articles in review',
					to: {name: 'in-review'},
					onEnter: () => { this.clearArticles()},
					show: () => {return this.$can('view', 'Post')}
				},
				{
					title: 'Articles you claimed',
					to: {name: 'claimed'},
					onEnter: () => { this.clearArticles()},
					show: () => {return this.$can('view', 'Post')}
				},
				{
					title: 'Articles to review',
					to: {name: types.revAvail.name},
					onEnter: () => { this.clearArticles()},
					show: () => {return this.$can('view', 'Post')}
				},
			]
		},
		viewableCategories () {
			return this.categories.filter(category => {
				return category.show()
			})
		},

	},
	mounted() {
		
	},
	methods: {
		...mapActions('admin',['clearArticles']),		
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
