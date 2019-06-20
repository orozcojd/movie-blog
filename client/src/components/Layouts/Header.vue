<template>
  <div v-resize.quiet="onResize">
    <v-navigation-drawer
      v-model="drawerLeft"
      left
      clipped
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
          class="nav-tile"
          @click="navigateTo('tag-view', { 
            id: realm.ref_id,
            tagName: realm.name,
          })"
        >
          <v-list-tile-title
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
          v-for="(realm, i) in realms.slice(0,5)"
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
      <!-- <v-spacer /> -->
      <!--
        <v-btn
          flat
          :to="{name:'admin-login'}"
        >
          Log In
        </v-btn>
        <v-btn
          flat
          :to="{name:'admin-register'}"
        >
          Sign Up
        </v-btn>
    </v-toolbar-items> -->
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
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
	name: 'Header',
	data() {
		return {
			drawerLeft: false,
			right: false,
			account: [['Admin', 'goTo("/admin")'], ['Logout', 'logout']],
			realmToggle: true,
			windowSize: {
				x: 0,
				y: 0
			},
			toggleDown: false,
			showClose: false
		}
	},
	computed: {
		...mapState([
			'viewedArticles',
			'user',
			'token',
			'tags',
			'snackbar',
			'contributor'
		]),
		...mapGetters([
			'isUserLoggedin',
			'getUser',
			'siteTitle'
		]),
		contributorName() {
			return this.contributor ? this.contributor.name : ''
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
				return this.realms.slice(5)
			}
		}
	},
	async mounted () {
		if(!this.token.token) {
			await this.getSetToken()		
		}
		await this.getTags()
		this.onResize()
	},
	methods: {
		...mapActions([
			'getTags',
			'getSetToken',
			'setUser',
			'logOut',
			'setSnackbar',
			
		]),
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
			else {
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

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Permanent+Marker');
 .main-title {
    font-family: 'Permanent Marker', cursive;
    font-size: 2rem !important;
    margin-right: 1em; 
    cursor:pointer;
    color: black;
  }
  @media(max-width: 300px) {
    .main-title {
      font-size: 1.3rem !important;
    }
  }

.contain-group {
  max-height: 432px;
  overflow: scroll;
}
.realm-title {
  font-size: 1.6rem !important;
}
// .nav-tile {
//   font-size: 1.8rem;
// }
.nav-tile:hover {
  // background-color: 
}
</style>

<style>
/* @media all and (min-width: 960px) {
    html, body{
        font-size: 18px !important;
    }
}
 
@media all and (max-width: 959px) and (min-width: 600px) {
    html, body{
        font-size: 16px !important;
    }
}
 
@media all and (max-width: 599px) and (min-width: 320px) {
    html, body{
        font-size: 12px !important;
    }
 
}
@media all and (max-width: 320px) {
    html, body{
        font-size: 8px !important;
    }
} */
</style>

