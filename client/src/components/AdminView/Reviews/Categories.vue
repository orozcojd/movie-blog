<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout>
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
import * as types from '@/constants/types'
import { mapActions } from 'vuex'
export default {
	name: 'Reviews',
	data () {
		return {
		}
	},
	computed: {
		categories() {
			return [
				{
					title: 'Your Articles',
					// to: {name: types.revAvail.name},
					// onEnter: () => { this.clearArticle()},
					show: () => {return this.$can('view', 'Post')}
				},
				{
					title: 'Articles You Claimed',
					// to: {name: types.adminCreatePost.name},
					// onEnter: () => { this.clearArticle()},
					show: () => {return this.$can('view', 'Post')}
				},
				{
					title: 'Articles to Review',
					to: {name: types.revAvail.name},
					// onEnter: () => { this.clearArticle()},
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
