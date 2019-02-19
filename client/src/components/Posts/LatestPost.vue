<template>
  <v-card>
    <v-layout>
      <v-flex xs8 sm8>
        <v-img
        src="https://video-images.vice.com/articles/5c671c5922b38000079d73fe/lede/1550273165254-GettyImages-1019038092.jpeg?crop=1xw%3A0.84375xh%3Bcenter%2Ccenter&resize=2000%3A*"
        height="550"
        alt="latest-post-img" />
      </v-flex>
      <v-flex class="layout" xs4 sm4>
          <v-layout align-space-around justify-space-between column fill-height class="header">
            <div class="title-preview"
              @click="$router.push({name: 'login'})">
              <h1 align="left">
                What We Know About a Portland Cop's Friendly Texts with a Far-Right Leader</h1>
              <br>
              <p align="left">
                Activists are pissed.
              </p>
            </div>
            <p align="right">Camille Tsalik</p>
          </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'latest-post',
  data () {
    return {
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.header {
  margin: 10px;
  }
.title-preview {
  cursor: pointer;
}

@media screen and (max-width: 375px) {

}
</style>
