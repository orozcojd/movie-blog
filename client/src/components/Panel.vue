<template>
  <div class="white elevation-2">
    <v-toolbar flat dense class="teal" light>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <slot name="action"/>
    </v-toolbar>
    <div class="pl-4 pr-4 pt-2 pb-2">
      <slot>
        No slot content
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Panel',
  props: {
    title: {
      type: String
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
