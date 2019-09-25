<template>
  <div 
    v-if="loaded"
    v-resize="onResize"
  >
    <v-navigation-drawer
      v-model="drawerLeft"
      left
      clipped
      :disable-resize-watcher="true"
      app
      width="280"
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
        <div v-if="tagShow.end < 9">
          <div
            class="sidenav-title"
          >
            {{ realmTitle }}
          </div>
          <div class="mt-title flex-col">
            <div
              v-for="(realm, i) in sideNavRealms"
              :key="i"
              class="sidenav-realm"
              @click="navigateTo('tag-view', { 
                tagName: realm.name,
                urlTag: realm.urlTag
              })"
            >
              {{ realm.name }}
            </div>
          </div>
        </div>
        <div
          v-if="viewedArticles.length"
          value="true"
        >
          <div class="sidenav-title">
            recently visited
          </div>
          <div class="mt-title">
            <div 
              v-for="viewed in viewedArticles"
              :key="viewed.id"
              class="flex-row recent-container"
              @click="navigateTo('article-view', { 
                id: viewed.id,
              })"
            >
              <v-img
                style="margin-right: 5px;"
                :src="viewed.img"
                max-width="70"
              />
              <div class="recents-overflow">
                {{ viewed.title }}
              </div>
            </div>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      fixed
      app
      :scroll-off-screen="!drawerLeft"
      clipped-left
      class="nav-items"
    >
      <v-toolbar-side-icon 
        v-if="tagShow.end <= 9"
        @click.stop="drawerLeft = !drawerLeft" 
      />
      <div
        class="main-title"
        @click="$router.push('/')"
      >
        {{ siteTitle }}
      </div>
      <v-toolbar-items
        v-if="!toggleDown"
        class="nav-realms flex-row"
      >
        <div
          v-for="(realm, i) in realms.slice(tagShow.start,tagShow.end)"
          :key="i"
          class="nav-realm"
          @click="navigateTo('tag-view', { 
            tagName: realm.name,
            urlTag: realm.urlTag
          })"
        >
          {{ realm.name }}
        </div>
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
			loaded: false,
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
			'realms',
		]),
		...mapGetters('posts', ['siteTitle']),
		realmTitle () {
			return this.toggleDown ? 'Realms' : 'more realms'
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
		// if(!this.realms.length) {
		await this.getTags({params: {realm: true}})
		// await this.getTags({params: {realm: false}})
		// }
		this.loaded = true
		this.onResize()
	},
	methods: {
		...mapActions('posts',['getTags']),

		onResize () {
			this.windowSize = { x: window.innerWidth, y: window.innerHeight }
			if(this.windowSize.x <= 710) {
				this.toggleDown = true
				if(this.windowSize.x <= 400) {
					this.showClose = true
				}
				else {
					this.showClose = false
				}
			}
			else if(this.windowSize.x <=1080) {
				this.tagShow.end = 4
				this.toggleDown = false
			}
			else if(this.windowSize.x <=1360) {
				this.tagShow.end = 7
				this.toggleDown = false
			}

			else {
				this.tagShow.end = 9
				this.toggleDown = false		
			}
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
    font-family: 'Baloo', sans-serif;
    font-size: 2.8rem;
    margin-right: .5em; 
    margin-left: .5em;
    cursor: pointer;
    // min-width: 244px;
  }
  .main-title:hover, .nav-realm:hover, .sidenav-realm:hover {
    color: #5c6bc0;
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
.nav-realm {
  cursor: pointer;
  text-transform: uppercase;
  margin: 0 .95em;
}
.nav-realms {
  justify-content: start;
  font-size: .8em;
 }
 .mt-title {
   margin-top: 1em;
 }
 .sidenav-realm {
   text-transform: uppercase;
   font-size: .8em;
   height: 48px;
   cursor: pointer;
 }
 .sidenav-title {
   font-size: 1em;
   font-weight: 900;
   border-bottom: .1px solid #767676;
   padding: 16px 16px;
 }
 .flex-col {
   display: flex;
   padding: 0 16px;
   flex-direction: column;
 }
 .v-toolbar__content, .flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
.recent-container {
  padding: 8px 8px 8px 16px;
  font-size: 14px;
  height: 60x;
  cursor: pointer;
}
.recent-container:hover {
  color: #5c6bc0;
}
.recents-overflow {
  overflow: hidden;
  width: 80%;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical; 
  text-overflow: ellipsis;
}
</style>

