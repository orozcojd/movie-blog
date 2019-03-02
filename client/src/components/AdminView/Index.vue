<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap justify-space-around>
      <v-flex d-flex xs12 md6
        v-for="(category,index) in categories"
        :key="index"
      >
      <admin-category-tile
        :category="category">
      </admin-category-tile>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AdminCategoryTile from './AdminCategoryTile'
export default {
  name: 'admin-index',
  data () {
    return {
      categories: {
        create: {
          title: 'Create Post',
          to: {name: 'admin-create-post'}
        },
        edit: {
          title: 'Edit Posts',
          to: {name: 'admin-edit-posts'}
        },
        drafts: {
          title: 'Edit Drafts',
          to: {
            name: 'admin-edit-drafts',
            params: {
              drafts: true
            }
          }
        },
        addAdmin: {
          title: 'Add Admin User'
          // to:''
        },
        statistics: {
          title: 'View Stats'
        }
      }
    }
  },
  components: {
    AdminCategoryTile
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
