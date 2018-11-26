<template>
  <div class="TableOfContents"  style="bottom: 0px; top: 100px;">
    <div v-if="items[0]" class="TableOfContents-item is-level1">{{items[0].title}}</div>
    <TableOfContentsGroup
      v-if="items[0].type === 'group'"
      :items="items[0].children"
    />
  </div>
</template>

<script>
export default {
  props: ['items'],
  components: {
    TableOfContentsLink: () => import('./TableOfContentsLink.vue'),
    TableOfContentsGroup: () => import('./TableOfContentsGroup.vue')
  },
  data () {
    return {

    }
  }

}


</script>
