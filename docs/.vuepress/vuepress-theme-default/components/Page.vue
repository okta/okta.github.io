<template>
  <section class="PageContent DynamicSidebar" :class="{'has-tableOfContents': showToc}">
    <!-- Begin Sidebar -->
    <Sidebar />
    <!-- End Sidebar -->

    <!-- Begin Content -->
    <Content class="PageContent-main"/>
    <!-- End Content -->

    <!-- Begin Table Of Contents -->
    <TableOfContents v-if="showToc" class="TableOfContents" :items="tableOfContentsItems"></TableOfContents>
    <!-- End Table Of Contents -->
  </section>
</template>

<script>
import { resolveHeaders } from '../util'
export default {
  components: {
    TableOfContents: () => import('./TableOfContents.vue'),
    Sidebar: () => import('./Sidebar.vue')
  },
  computed: {
    tableOfContentsItems () {
      if (this.showToc) {
        return resolveHeaders(
          this.$page
        )
      }
    },
    showToc () {
      if (this.$page.frontmatter.showToc === false) {
        return false;
      }

      if (this.$page.path.includes('/code/')) {
        return false;
      }

      return true;
    }
  }
}
</script>
