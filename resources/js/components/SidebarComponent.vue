<template>
  <div class="list-group list-group-flush sidebar-list-group">
    <router-link
      v-for="(link, i) in links"
      :key="i"
      :to="link.link"
      class="list-group-item list-group-item-action p-2"
      active-class="active-list-item"
      exact
    >
      <span v-if="link.icon"><i :class="`fa ${link.icon}`"></i></span>
      <span>{{ link.title ? link.title : 'Link' }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['links']
};
</script>

<style></style>
