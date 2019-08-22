<template>
  <div
    v-if="loaded"
    v-resize="onResize"
  >
    <v-navigation-drawer
      v-model="drawerLeft"
      left
      clipped
      dark
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
        <v-list-group
          v-if="isUserLoggedin"
          prepend-icon="account_circle"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title v-text="contributorName" />
            </v-list-tile>
          </template>
          <v-list-tile
            to="/admin"
          >
            <v-list-tile-title>Admin</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>supervisor_account</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile
            @click="logout"
          >
            <v-list-tile-title>Logout</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>meeting_room</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
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
          v-if="viewedArticles && viewedArticles.length"
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
      dark
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
    <v-snackbar
      v-model="snackVal"
      :timeout="snackbar.timeout"
      :top="true"
      :multi-line="true"
    >
      {{ snackbar.text }}
      <v-btn
        color="pink"
        flat
        @click="snackClose"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import admin from '@/store/admin'
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
		]),
		...mapState('admin', [
			'snackbar',
			'tags'
		]),
		...mapState('auth', [
			'user',
			'token',
			'adminContributor'
		]),
		...mapGetters('auth', [
			'isUserLoggedin',
			'getUser',
		]),
		...mapGetters('posts', ['siteTitle']),
		contributorName() {
			return this.adminContributor ? this.adminContributor.name : ''
		},
		snackVal: {
			get() {
				return this.snackbar.value
			},
			set(val) {
				this.setSnackbar({
					type: 'value',
					value: val
				})
			},
		},
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
		if(!this.token.token) {
			await this.getSetToken()		
		}
		await this.getTags()
		
		if(this.tags && !this.tags.length)
			await this.fetchTags()
		this.onResize()
		this.loaded = true
	},
	beforeDestroy() {
		this.$store.unregisterModule('admin')
	},
	methods: {
		...mapActions('admin',['fetchTags']),
		...mapActions('posts',['getTags']),
		...mapActions('auth', [
			'getSetToken',
			'setUser',
			'logOut'
		]),
		...mapActions('admin', ['setSnackbar']),
		onResize () {
			this.windowSize = { x: window.innerWidth, y: window.innerHeight }
			if(this.windowSize.x <= 835) {
				this.toggleDown = true
				if(this.windowSize.x <= 400) {
					this.showClose = true
				}
				else {
					this.showClose = false
				}
			}
			else if(this.windowSize.x <=1135) {
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
		logout () {
			this.logOut().then(() => {
				this.$router.push({
					name: 'root'
				})
			})
		},
		goTo(route) {
			this.$router.push(route)
		},
		navigateTo (name, params) {
			this.$router.push({
				name: name,
				params: params,
				// query: {page: 1}
			})
		},
		snackClose() {
			this.setSnackbar({
				type: 'value',
				value: false
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
@import url('https://fonts.googleapis.com/css?family=Permanent+Marker');
 .main-title {
    font-family: 'Permanent Marker', cursive;
    font-size: 2rem !important;
    margin-right: 1em; 
    cursor:pointer;
    color: white;
  }
  @media(max-width: 280px) {
    .main-title {
      font-size: 1em !important;
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

