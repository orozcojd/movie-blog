<template>
  <v-footer
    dark
    height="auto"
  >
    <v-card
      flat
      tile
      class="indigo lighten-1 white--text text-xs-center"
      style="padding: 4em"
    >
      <v-card-text class="white--text">
        Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
      </v-card-text>

      <!-- <v-divider /> -->

      <v-card-text class="white--text">
        &copy;2019 — <strong>{{ siteTitle }}</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data: () => ({
		icons: [
			'fab fa-facebook',
			'fab fa-twitter',
			'fab fa-google-plus',
			'fab fa-linkedin',
			'fab fa-instagram'
		],
		footerLinks: [
			'About Us',
			'',
      
		]
	}),
	computed: {
		...mapGetters([
			'siteTitle'
		])
	}
}
</script>

<style scoped>

</style>
