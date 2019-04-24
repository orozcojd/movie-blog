<template>
  <v-card>
    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
      aspect-ratio="2.75"
    />
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
        :to="category.to"
      >
        View
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
	name: 'AdminCategoryTile',
	props: {
		category: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
		}
	},

}
</script>

<style scoped>

</style>
