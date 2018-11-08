<template>
  <section class="PageContent DynamicSidebar has-tableOfContents">
    <!-- Begin Sidebar -->
    <Sidebar />
    <!-- End Sidebar -->

    <!-- Begin Content -->
    <Content class="PageContent-main"/>
    <!-- End Content -->

    <!-- Begin Table Of Contents -->
    <TableOfContents class="TableOfContents" :items="tableOfContentsItems"></TableOfContents>
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
      return resolveHeaders(
        this.$page
      )
    }
  }
}
</script>
