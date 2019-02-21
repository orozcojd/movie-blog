<template>
  <div style="padding:5em">
    <h1>admin view</h1>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation>
      <v-text-field
        label="Article Title"
        required
        v-model="article.title"/>
      <v-text-field
        label="Author"
        required
        v-model="article.author"/>
      <v-text-field
        label="Thumbnail Description"
        required
        v-model="article.thumbNailDescription"/>
      <v-text-field
        label="Category"
        required
        v-model="article.category"/>
      <v-textarea
        label="Article Body"
        required
        autoGrow
        v-model="article.body"/>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn @click="submit">Submit</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// const Article = require('@/Model/Article')
import Article from '@/Model/Article.js'

// import { validationMixin } from 'vuelidate'
// import { required, maxLength, email } from 'vuelidate/lib/validators'
export default {
  // mixins: [validationMixin],
  // validations: {
  //   name: { required, maxLength: maxLength(10) },
  //   email: { required, email },
  //   select: { required },
  //   checkbox: {
  //     checked (val) {
  //       return val
  //     }
  //   }
  // },
  name: 'Songs',
  mounted () {
    this.article = JSON.parse(JSON.stringify(this.getArticle(this.$route.params.id)))
    // this.$validator.localize('en', this.dictionary)
  },
  data () {
    return {
      valid: true,
      article: {}
    }
  },
  methods: {
    ...mapActions([
      'updateArticle'
    ]),
    cancel () {
      this.$router.push({
        name: 'root'
      })
    },
    async submit () {
      let action = await this.updateArticle(new Article(this.article)).then(res => {
        this.$router.push({
          name: 'root'
        })
      }).catch(err => {
        alert(err)
      })
    }
  },
  computed: {
    ...mapGetters([
      'getArticle'
    ])
    // titleErrors () {
    //   const errors = []
    //   if (!this.$v.article.title.$dirty) return errors
    //   !this.$v.article.title.maxLength && errors.push('Article Title must be at most 10 characters long')
    //   !this.$v.article.title.required && errors.push('Article Title is required.')
    //   return errors
    // },
  }
}
</script>

<style scoped>

</style>
