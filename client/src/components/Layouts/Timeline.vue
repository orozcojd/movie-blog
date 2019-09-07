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
          size="100px"
          @click="navigateTo(article._id)"
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
        <div
          class="date-text"
        >
          {{ convertDate(article.updatedAt) }}
        </div>
      </template>
      <template>
        <timeline-card
          class="post-preview timeline-info"
          :article="article"
          @click="navigateTo(article._id)"
        />
      </template>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import Helpers from '@/components/Tools/Helper'
export default {
	name: 'Timeline',
	components: {
		TimelineCard: () => import('@/components/Posts/TimelineCard')
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
		navigateTo (articleId) {
			this.$router.push({
				name: 'article-view',
				params: { 
					id: articleId
				}
			})
		},
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
		font-size: 2.5rem;
		line-height: 1.2em;
	}
	.hover-grow{
		cursor: pointer;
	}
	.timeline-info:hover ~ .date-text{
		font-weight: bold;
	}
	@media (max-width: 600px) {
			.hover-grow {
				height: 70px !important;
				width: 70px !important;
		}
	}
</style>