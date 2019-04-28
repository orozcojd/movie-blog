<template>
  <v-timeline
    v-if="loaded"
    align-top
    :dense="dense"
  >
    <v-timeline-item
      v-for="article in articles.slice(1,5)"
      :key="article.id"
      small
      :left="left"
    >
      <template
        v-slot:icon
      >
        <v-avatar
          class="hover-grow"
          size="60px"
        >
          <img
            :src="
              article.img"
          >
        </v-avatar>
      </template>
      <template
        v-slot:opposite
      >
        <div class="date-text">
          <span>{{ convertDate(article.created_at) }}</span>
        </div>
      </template>
      <template>
        <timeline-card
          class="post-preview"
          :article="article"
        />
      </template>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import TimelineCard from '@/components/Posts/TimelineCard'
import Helpers from '@/components/Tools/Helper'
export default {
	name: 'Timeline',
	components: {
		TimelineCard
	},
	props: {
		articles: {
			type: Array,
			required: true
		},
	},
	data () {
		return {
			dense: false,
			left:false,
			loaded: false
		}
	},
	computed: {

	},
  
	created() {
		this.resizeTimeline()
		window.addEventListener("resize", this.debounce(() => {
			this.resizeTimeline()
		}, 100))
	},
	mounted() {
		this.loaded = true
	},
	methods: {
		convertDate(date) {
			return Helpers.convertDate(date)
		},
		resizeTimeline() {
			if(window.innerWidth <= 600) {
				this.dense = true
				this.left = true
			}
			else {
				this.dense = false
				this.left = false
			}
		},
		debounce(fn, wait, immediate) {
			let timeout;
			return function() {
				let context = this, args = arguments;
				let later = function() {
					timeout = null;
					if (!immediate) fn.apply(context, args);
				};
				let callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) fn.apply(context, args);
			};
		}
	}
}
</script>

<style scoped>
.date-text{
	font-size: 2rem;
}
	.hover-grow{
		transition: all .3s ease-in-out;
	}
	.hover-grow:hover{
		margin: 50px !important;
		transform: scale(2) translateY(-20px);;
		
		
	}
</style>