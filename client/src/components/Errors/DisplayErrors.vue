<template>
  <v-container fluid>
    <v-layout justify-start>
      <v-flex
        row
        wrap
      >
        <transition-group
          name="fade"
          tag="div"
        >
          <v-alert
            v-for="(error, index) in errors"
            :key="`key-${index}`"
            type="error"
            :value="true"
          >
            {{ error }}
          </v-alert>
        </transition-group>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'DisplayErrors',
	data () {
		return {
		}
	},
	computed: {
		...mapState('errors', ['errors'])
	},
	mounted() {
		
	},
	methods: {
	}
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>
