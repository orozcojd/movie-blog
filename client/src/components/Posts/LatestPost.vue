<template>
  <v-card>
    <v-layout row wrap>
      <v-flex xs12 md8>
        <v-img
        src="https://video-images.vice.com/articles/5c671c5922b38000079d73fe/lede/1550273165254-GettyImages-1019038092.jpeg?crop=1xw%3A0.84375xh%3Bcenter%2Ccenter&resize=2000%3A*"
        contain
        alt="latest-post-img" />
      </v-flex>
      <v-flex class="layout" xs12 md4>
          <v-layout align-space-around justify-space-between column fill-height class="header">
            <div class="title-preview"
              @click="$router.push({name: 'login'})">
              <v-card-title primary-title>
                <div>
                  <h3 class="headline" align="left">What We Know About a Portland Cop's Friendly Texts with a Far-Right Leader</h3>
                <br>
                <p align="left">
                  Activists are pissed.
                </p>
              </div>
              </v-card-title>
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
.header-text {
  font-size: 150%;
}
.title-preview {
  cursor: pointer;
}

@media screen and (max-width: 375px) {

}
</style>
