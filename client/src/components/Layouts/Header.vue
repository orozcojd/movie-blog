<template>
  <div>
    <v-navigation-drawer
      v-model="drawerRight"
      fixed
      right
      clipped
      app
    >
      <v-list>
        <v-list-group
          v-if="isUserLoggedin"
          prepend-icon="account_circle"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title v-text="user" />
            </v-list-tile>
          </template>
          <v-list-tile
            to="/admin"
          >
            <v-list-tile-title>Admin</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile
            @click="logout"
          >
            <v-list-tile-title>Logout</v-list-tile-title>
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
        <v-list-group
          prepend-icon="account_circle"
          value="true"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Realms</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-tile
            v-for="(realm, i) in realms"
            :key="i"
            @click="navigateTo('tag-view', { 
              id: realm.ref_id,
              tagName: realm.name,
            })"
          >
            <v-list-tile-title v-text="realm.name.split('-').join(' ')" />
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
        <v-list-group
          v-if="viewedArticles.length"
          prepend-icon="account_circle"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Recently Viewed</v-list-tile-title>
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
      dense
      :scroll-off-screen="!drawerRight"
      clipped-right
    >
      <v-toolbar-side-icon to="/">
        <v-icon>home</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>Movie Reviewer</v-toolbar-title>
      <v-spacer />
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


      <v-toolbar-side-icon @click.stop="drawerRight = !drawerRight" />
    </v-toolbar>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
	name: 'Header',
	data() {
		return {
			drawerRight: false,
			right: null,
			account: [['Admin', 'goTo("/admin")'], ['Logout', 'logout']]
		}
	},
	computed: {
		...mapState([
			'viewedArticles',
			'user',
			'token',
			'tags'
		]),
		...mapGetters([
			'getToken',
			'isUserLoggedin',
			'getUser'
		]),
		realms () {
			return this.tags.filter(tag => tag.realm === true)
		}
	},
	async mounted () {
		if(!this.token) {
			this.getSetToken()		
		}
		this.getTags()
		// else {
		// 	await this.getTags({
		// 		params: {
		// 			realm: true
		// 		}
		// 	})
		// }
	},
	methods: {
		...mapActions([
			'getTags',
			'getSetToken',
			'setToken',
			'setUser',
			'logOut'
		]),
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
				query: {page: 1}
			})
		}
	}
}
</script>
