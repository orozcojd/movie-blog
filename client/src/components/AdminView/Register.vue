<template>
  <v-container fluid>
    <v-layout
      align-center
      justify-center
    >
      <v-flex xs12 md9>
        <v-card class="card-padding">
          <v-form>
            <v-text-field
              label="Username"
              required
              v-model="credentials.username"/>
            <v-text-field
              label="Password"
              type="password"
              required
              v-model="credentials.password"/>
              <br>
              <v-btn @click="submit">Submit</v-btn>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'register',
  data () {
    return {
      credentials: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    submit () {
      console.log('clicked')
    }
  }
}
</script>

<style scoped>
  .card-padding{
    padding: 30px;
  }
</style>
