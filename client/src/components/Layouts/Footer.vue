<template>
  <v-footer
    id="footer"
    dark
    height="auto"
  >
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <v-card
          flat
          tile
          class="indigo lighten-1 white--text text-xs-center"
        >
          <v-card-text class="main-title">
            <!-- <v-btn
              v-for="icon in icons"
              :key="icon"
              class="mx-3 white--text"
              icon
            >
              <v-icon size="24px">
                {{ icon }}
              </v-icon>
            </v-btn> -->
            <h5>{{ siteTitle }}</h5>
          </v-card-text>
          <v-card-text class="footer-links">
            <v-btn
              v-for="(link, i) in footerLinks"
              :key="i"
              color="white"
              flat
              round
              @click="$router.push(
                link.to
              )"
            >
              {{ link.name }}
            </v-btn>
          </v-card-text>
          <v-divider />

          <v-card-text class="white--text">
            <div>
              &copy;2019
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
			{name: 'About Us', to: {name: 'about'}},
			// {name: 'Copyright Policy', to: {name: 'copy-right'}},
			{name: 'Contact Us', to: {name: 'contact'}},
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
@import url('https://fonts.googleapis.com/css?family=Permanent+Marker');

 .main-title {
    font-family: 'Permanent Marker', cursive;
    font-size: 2rem ;
    margin-right: 1rem; 
    color: inherit;
  }
  /* #footer {
    font-size: 1.6rem;
  } */
  .footer-links a {
    color: inherit; 
    text-decoration: none;
    margin: 0 2rem;
  }
  /* @media(min-width: 250px) {
  html {
    font-size: 12px;
  }
} */
</style>
