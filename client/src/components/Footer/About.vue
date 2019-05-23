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
        <h1>About Us</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et malesuada fames ac turpis egestas integer eget. Tempus urna et pharetra pharetra massa. Est ante in nibh mauris cursus mattis molestie. Feugiat in ante metus dictum at tempor commodo ullamcorper a. Interdum posuere lorem ipsum dolor sit. Sit amet purus gravida quis blandit. Ut diam quam nulla porttitor. Magna fermentum iaculis eu non. Lacus vestibulum sed arcu non. Penatibus et magnis dis parturient montes nascetur. A diam sollicitudin tempor id. Donec massa sapien faucibus et molestie ac feugiat. Erat pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Tristique sollicitudin nibh sit amet. Blandit aliquam etiam erat velit scelerisque. Enim neque volutpat ac tincidunt vitae semper quis lectus nulla.
        </p>
        <p>
          Odio euismod lacinia at quis risus. Porttitor eget dolor morbi non arcu risus quis varius quam. Curabitur gravida arcu ac tortor. Libero volutpat sed cras ornare arcu. Adipiscing at in tellus integer feugiat scelerisque. Justo nec ultrices dui sapien eget mi proin sed libero. Eget nunc lobortis mattis aliquam faucibus purus in massa. Urna condimentum mattis pellentesque id nibh tortor id aliquet. Eu ultrices vitae auctor eu augue ut. Ut consequat semper viverra nam libero justo laoreet. Vitae ultricies leo integer malesuada nunc vel risus commodo. Purus gravida quis blandit turpis cursus in hac. Non curabitur gravida arcu ac tortor dignissim. Varius duis at consectetur lorem donec. Ut aliquam purus sit amet luctus venenatis lectus.
        </p>
        <p> 
          Ultricies mi eget mauris pharetra et ultrices neque. Pretium nibh ipsum consequat nisl vel. Donec et odio pellentesque diam volutpat commodo. Dui faucibus in ornare quam viverra orci sagittis eu volutpat. Odio eu feugiat pretium nibh ipsum consequat. Justo donec enim diam vulputate ut pharetra sit amet. Eu sem integer vitae justo. Gravida neque convallis a cras semper. Facilisis mauris sit amet massa vitae tortor. Est pellentesque elit ullamcorper dignissim. Massa sapien faucibus et molestie ac. Vitae tempus quam pellentesque nec nam aliquam sem et. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue eget. Id leo in vitae turpis massa sed elementum tempus egestas. Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Sagittis nisl rhoncus mattis rhoncus urna. Quis vel eros donec ac odio tempor. Sed enim ut sem viverra aliquet eget sit.
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: 'Blank',
	components: {

	},
	data () {
		return {
		}
	},
	computed: {
		...mapGetters([
			'siteTitle'
		])
	},
	mounted() {
		
	},
	methods: {
	}
}
</script>

<style scoped>
  /* @media(min-width: 250px) {
  html {
    font-size: 12px !important;
  }
} */
  body {
    font-size: 12px;
  }
  h1 {
    font-size: 2rem;
  }
h1 {
  margin-bottom: 2rem;
}
p {
  font-size: 1.4rem;
}
</style>
