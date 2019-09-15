<template>
  <v-container>
    <v-layout
      row
      wrap
      justify-center
    >
      <v-flex
        xs12
        sm8
      >
        <h1>Contact Us </h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tortor id aliquet lectus proin nibh nisl condimentum. Augue eget arcu dictum varius. Risus in hendrerit gravida rutrum quisque non. Nullam ac tortor vitae purus. Magna sit amet purus gravida quis blandit turpis cursus. Sodales neque sodales ut etiam. Dolor magna eget est lorem ipsum dolor sit. Sagittis eu volutpat odio facilisis. Quis blandit turpis cursus in hac habitasse platea dictumst. Consectetur adipiscing elit ut aliquam.
        </p>
        <p>
          Our Info: 
          <a href="mailto:hello@threepointo.com">hello@threepointo.com
          </a>
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: 'Contact',
	computed: {
		...mapGetters('posts', ['siteTitle']),
	}
}
</script>