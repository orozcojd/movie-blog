<template>
  <div v-resize="onResize">
    <v-navigation-drawer
      v-model="drawerLeft"
      left
      clipped
      :disable-resize-watcher="true"
      app
    >
      <v-list>
        <div v-if="showClose">
          <v-list-tile
            @click="drawerLeft = !drawerLeft"
          >
            <v-list-tile-action align="right">
              <v-icon>clear</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider />
        </div>
        <v-list-tile
          v-for="(realm, i) in sideNavRealms"
          :key="i"
          @click="navigateTo('tag-view', { 
            id: realm.ref_id,
            tagName: realm.name,
          })"
        >
          <v-list-tile-title
            class="nav-tile"
            v-text="titleCase(realm.name)"
          />
        </v-list-tile>

        <v-list-group
          v-if="viewedArticles.length"
          value="true"
          class="contain-group"
          prepend-icon="history"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Recently Visited</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-tile
            v-for="viewed in viewedArticles"
            :key="viewed.id"
            @click="navigateTo('article-view', { 
              id: viewed.id,
            })"
          >
            <v-list-tile-action>
              <v-img
                style="margin-right: 5px;"
                :src="viewed.img"
              />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ viewed.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      fixed
      app
      :scroll-off-screen="!drawerLeft"
      clipped-left
    >
      <v-toolbar-side-icon @click.stop="drawerLeft = !drawerLeft" />
      <div
        class="main-title"
        @click="$router.push('/')"
      >
        {{ siteTitle }}
      </div>
      <v-toolbar-items v-if="!toggleDown">
        <v-btn
          v-for="(realm, i) in realms.slice(tagShow.start,tagShow.end)"
          :key="i"
          depressed
          @click="navigateTo('tag-view', { 
            id: realm.ref_id,
            tagName: realm.name,
          })"
        >
          {{ realm.name }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
	name: 'Header',
	data() {
		return {
			drawerLeft: false,
			windowSize: {
				x: 0,
				y: 0
			},
			tagShow: {
				start: 0,
				end: 8,
				max: 8
			},

			toggleDown: false,
			showClose: false
		}
	},
	computed: {
		...mapState('posts', [
			'viewedArticles',
			'tags',
		]),
		...mapGetters('posts', ['siteTitle']),

		realms () {
			return this.tags.filter(tag => tag.realm === true)
		},
		sideNavRealms() {
			if(this.toggleDown) {
				return this.realms
			}
			else {
				return this.realms.slice(this.tagShow.end, this.realms.length)
			}
		}
	},
	async mounted () {
		if(!this.tags.length)
			await this.getTags()
		this.onResize()
	},
	methods: {
		...mapActions('posts',['getTags']),

		onResize () {
			this.windowSize = { x: window.innerWidth, y: window.innerHeight }
			if(this.windowSize.x <= 845) {
				this.toggleDown = true
				if(this.windowSize.x <= 400) {
					this.showClose = true
				}
				else {
					this.showClose = false
				}
			}
			else if(this.windowSize.x <=1215) {
				this.tagShow.end = 5
				this.toggleDown = false
			}
			else {
				this.tagShow.end = 8
				this.toggleDown = false		
			}
		},
		titleCase(word) {
			let title = word.toLowerCase().split(' ')
			for(let i = 0; i < title.length; i++) {
				title[i] = title[i].charAt(0).toUpperCase() + title[i].slice(1)
			}
			return title.join(' ')
		},

		goTo(route) {
			this.$router.push(route)
		},
		navigateTo (name, params) {
			this.$router.push({
				name: name,
				params: params,
			})
		}
	}
}
</script>
<style>
  @media(max-width: 280px) {
    * {
      font-size: 12px !important;
    }
  }
</style>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Baloo&display=swap');
 .main-title {
    font-family: 'Baloo', cursive;
    font-size: 2.2rem;
    margin-right: .5em; 
    cursor: pointer;
    color: black;
    min-width: 244px;
  }
  @media(max-width: 280px) {
    .main-title {
      font-size: 1em;
    }
  }

.contain-group {
  max-height: 432px;
  overflow: scroll;
}
.nav-tile {
  font-size: 1.4em;
}

</style>

