<template>
  <v-container
    class="post-content"
    fluid
  >
    <v-layout justify-center>
      <v-flex
        xs12
      >
        <v-card
          class="card-padding"
          min-height="300"
        >
          <v-layout justify-start>
            <v-flex
              xs12
            >
              <div
                align="left"
              >
                <slot />
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>


export default {
	name: 'CardView'
}
</script>

<style>
  .post-content {
    max-width: 850px !important;
  }
  @media (max-width: 960px) {
    .post-content {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
  .card-padding {
    padding: 1em 0.5em 2em 0.5em;
  }
  .about {
		/* font-size: 1.7em; */
  }
  @media (max-width: 960px) {
    .card-padding {
      padding-left: 1em;
    }
  }
  @media (max-width: 640px) {
    .card-padding {
      padding: 1em 0 2em 0;
    }
    .about {
		/* font-size: 14px; */
	}
}
</style>
