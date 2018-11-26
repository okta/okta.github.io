<template>
  <a
    :href="href"
    class="TableOfContents-item sidebar-link"
    :class="'is-level'+item.level">
    {{item.title}}
  </a>
</template>
<script>
export default {
  props: ['item'],
  computed: {
    href: function () {
      return this.item.path ? this.item.path : '#'+this.item.slug
    }
  }
}
</script>
