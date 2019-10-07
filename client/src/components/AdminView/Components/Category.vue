<template>
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
</template>

<script>
import { mapActions } from 'vuex'
export default {
	name: 'Blank',
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