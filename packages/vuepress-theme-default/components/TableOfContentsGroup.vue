<template>
  <div>
    <div v-for="(item, index) in items" :key="index">
      <TableOfContentsLink :item="item" />
      <TableOfContentsGroup v-if="item.type === 'group'" :items="item.children" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['items'],
  components: {
    TableOfContentsLink: () => import('./TableOfContentsLink.vue'),
    TableOfContentsGroup: () => import('./TableOfContentsGroup.vue')
  }
}
</script>

<style scoped>
  .TableOfContents .is-active {
    border-left: 1px solid #007dc1;
  }
</style>
