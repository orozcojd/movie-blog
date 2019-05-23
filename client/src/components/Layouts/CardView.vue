<template>
  <v-container
    class="post-content"
    fluid
  >
    <v-layout justify-center>
      <v-flex
        xs12
        sm10
        xl6
        offset-md1
      >
        <v-card class="card-padding">
          <v-card-text>
            <v-layout justify-start>
              <v-flex
                xs12
                sm11
              >
                <div
                  align="left"
                >
                  <slot />
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>


export default {
	name: 'CardView',

}
</script>

<style scoped>
/* @import url('../../assets/style/poststyle.scss'); */
</style>
<style>
/* @import url('../../assets/style/tiptap.scss'); */

  .post-body img {
    width: 100%;
    height: auto;
  }
  .card-padding {
    padding: 1em 0 2em 4em;
  }
  .about {
		font-size: 1.7rem;
	}
  @media (max-width: 500px) {
    .card-padding {
    padding: 1em 0.5em 2em 0.5em;
  }
  .about {
		font-size: 14px;
	}
}
</style>
