<template>
  <v-card>
    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
      aspect-ratio="2.75">
      </v-img>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ article.title }}</h3>
        <div align="left">{{ article.description }} </div>
        <br>
        <div align="right">{{ article.author }} </div>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'post-preview',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
