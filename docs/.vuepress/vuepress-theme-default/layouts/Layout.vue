<template>
  <div class="PageWrap">
    <!-- Begin Header -->
    <TopNavigation></TopNavigation>
    <!-- End Header -->


    <!-- Begin Promo Banner -->

    <!-- End Promo Banner -->


    <!-- Begin Page Content -->
    <component v-if="$page.frontmatter.component" :is="$page.frontmatter.component" />
    <Page v-else />
    <!-- End Page Content -->


    <!-- Begin Footer -->
    <Footer />
    <!-- End Footer -->
  </div>
</template>

<script>
export default {
  components: {
    TopNavigation: () => import('../components/TopNavigation.vue'),
    Footer: () => import('../components/Footer.vue'),
    Documentation: () => import('../components/Documentation.vue'),
    Page: () => import('../components/Page.vue'),
    ChangeLog: () => import('../components/ChangeLog.vue')
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
  }
}

</script>

<style lang="scss">
  @import '../styles/okta';
  @import "~prismjs/themes/prism-solarizedlight.css";

  .header-anchor {
    display:none;
  }
</style>
