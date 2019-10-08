<template>
  <v-card
    class="card-category"
    @click="navigateTo(category)"
  >
    <v-card-title primary-title>
      <div>
        <h3 class="headline">
          {{ category.title }}
        </h3>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
	name: 'Category',
	props: {
		category: {
			type: Object,
			required: true
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
  .card-category {
    cursor: pointer;
  }
  .card-category:hover {
    background-color: #bdc3e5;
  }
</style>