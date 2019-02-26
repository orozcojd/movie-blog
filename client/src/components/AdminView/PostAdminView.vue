<template>
  <div style="padding:5em">
    <h1>Admin View</h1>
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
        v-model="article.thumbnailDescription"/>
      <v-text-field
        label="Article Image"
        required
        v-model="article.img"/>
      <v-text-field
        label="Category"
        required
        v-model="article.category"/>
      <v-textarea
        label="Article Body"
        required
        autoGrow
        v-model="article.body"/>
        <v-btn
          @click.prevent="cancel"
          :disabled="validation.cancelDisabled"
        >Cancel</v-btn>
        <v-btn
          @click.prevent="submit"
          :color="validation.btnType"
        >Submit</v-btn>
        <br>
        <div style="color:red"> {{ validation.error }}</div>
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
  name: 'post-admin-view',
  mounted () {
    if (this.$route.params.id) {
      this.article = JSON.parse(JSON.stringify(this.getArticle(this.$route.params.id)))
    }
    // this.$validator.localize('en', this.dictionary)
  },
  data () {
    return {
      valid: true,
      article: {},
      validation: {
        btnType: 'undefined',
        error: '',
        cancelDisabled: false
      },
      requestRunning: false
    }
  },
  methods: {
    ...mapActions([
      'updateArticle',
      'postArticle'
    ]),
    cancel () {
      this.$router.push({
        name: 'root'
      })
    },
    async submit () {
      if (this.requestRunning) {
        return
      }
      // disable cancel button & prevent api from firing after multiple button clicks
      this.requestRunning = true
      this.validation.cancelDisabled = true
      let updated
      console.log(this.$route.params.id)
      if (this.$route.params.id) {
        updated = await this.updateArticle(new Article(this.article))
      } else {
        updated = await this.postArticle(new Article(this.article))
      }
      updated.then(res => {
        this.validation.error = ''
        this.validation.btnType = 'success'
        setTimeout(() => {
          this.$router.push({
            name: 'root'
          })
        }, 1000)
      }).catch(err => {
        this.validation.btnType = 'danger'
        this.validation.error = err
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
