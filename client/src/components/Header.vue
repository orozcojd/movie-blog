<template>
  <div>
    <v-navigation-drawer
      v-model="drawerRight"
      fixed
      right
      clipped
      app
    >
      <v-list dense>
        <v-list-tile
          v-for="viewed in viewedArticles"
          :key="viewed.id"
          @click="navigateTo(viewed.id)"
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
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      fixed
      light
      app
      dense
      scroll-off-screen
      clipped-right
    >
      <v-toolbar-side-icon to="/">
        <v-icon>home</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>Movie Reviewer</v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="!!getUser"
        disabled
      >
        {{ getUser }}
      </v-btn>
      <!-- <v-toolbar-items
      v-if="!isUserLoggedin"
    >
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
      <v-toolbar-items v-if="isUserLoggedin">
        <v-btn
          flat
          to="/admin"
        >
          Admin
        </v-btn>
        <v-btn
          flat
          @click="logout"
        >
          Log Out
        </v-btn>
      </v-toolbar-items>
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
			drawerRight: true,
			right: null,
		}
	},
	computed: {
		...mapState([
			'viewedArticles'
		]),
		...mapGetters([
			'getToken',
			'isUserLoggedin',
			'getUser'
		]),
	},
	mounted () {
		if (!this.getToken) {
			this.getSetToken()
		}
	},
	methods: {
		...mapActions([
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
		navigateTo (articleId) {
			this.$router.push({
				name: 'article-view',
				params: { 
					id: articleId
				}
			})
		}
	}
}
</script>
