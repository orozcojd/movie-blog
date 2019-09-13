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
              <v-list-tile-title v-text="contributor.name" />
            </v-list-tile>
          </template>
          <v-list-tile
            to="/admin"
          >
            <v-list-tile-title>{{ permission.name }}</v-list-tile-title>
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
        <v-list-tile v-if="tagShow.end < 9">
          <v-list-tile-title class="sidenav-title">
            {{ realmTitle }}
          </v-list-tile-title>
        </v-list-tile>
        <div class="sidenav-realms flex-col">
          <div
            v-for="(realm, i) in sideNavRealms"
            :key="i"
            class="sidenav-realm"
            @click="navigateTo('tag-view', { 
              id: realm.ref_id,
              tagName: realm.name,
            })"
          >
            {{ realm.name }}
          </div>
        </div>
        <v-list-group
          v-if="viewedArticles.length"
          value="true"
          class="contain-group"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title class="sidenav-title">
                recently visited
              </v-list-tile-title>
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
      class="nav-items"
    >
      <v-toolbar-side-icon @click.stop="drawerLeft = !drawerLeft" />
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
            id: realm.ref_id,
            tagName: realm.name,
          })"
        >
          {{ realm.name }}
        </div>
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
				max: 9
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
			'tags',
		]),
		...mapState('auth', [
			'user',
			'token',
			'contributor',
			'permission',
			'permissions'
		]),
		...mapGetters('auth', [
			'isUserLoggedin',
			'getUser',
			'getPermissionName'
		]),
		...mapGetters('posts', ['siteTitle']),
		realmTitle () {
			return this.toggleDown ? 'Realms' : 'more realms'
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
	created: function () {
		const store = this.$store;
		if (!(store && store.state && store.state['admin'])) {
			store.registerModule('admin', admin);
		}
	},
	async mounted () {
		await this.fetchPermissions()
		if(!this.token.token) await this.getSetToken()
		await this.setPermission()
		await this.getTags()
		if(!this.tags.length) await this.fetchTags()
		this.onResize()
		this.loaded = true
		console.log(this.contributor)
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
			'fetchPermissions',
			'setPermission',
			'logOut'
		]),
		...mapActions('admin', ['setSnackbar']),
		onResize () {
			this.windowSize = { x: window.innerWidth, y: window.innerHeight }
			if(this.windowSize.x <= 635) {
				this.toggleDown = true
				if(this.windowSize.x <= 400) {
					this.showClose = true
				}
				else {
					this.showClose = false
				}
			}
			else if(this.windowSize.x <=900) {
				this.tagShow.end = 4
				this.toggleDown = false
			}
			else if(this.windowSize.x <=1170) {
				this.tagShow.end = 7
				this.toggleDown = false
			}

			else {
				this.tagShow.end = 9
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
.v-toolbar__content, .flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
.nav-tile {
  font-size: 1em;
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
 .sidenav-realms {
   margin-top: .5em;
 }
 .sidenav-realm {
   text-transform: uppercase;
   font-size: 1em;
   height: 48px;
   cursor: pointer;
 }
 .sidenav-title {
   font-size: 1.5em;
 }
 .flex-col {
   display: flex;
   padding: 0 16px;
   flex-direction: column;

 }
</style>

