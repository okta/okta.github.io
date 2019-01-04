<template>
  <div class="PageWrap">
    <!-- Begin Header -->
    <TopNavigation></TopNavigation>
    <!-- End Header -->


    <!-- Begin Promo Banner -->

    <!-- End Promo Banner -->


    <!-- Begin Page Content -->

    <Content class="PageContent-main"/>
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
    Footer: () => import('../components/Footer.vue')
  }
}

</script>

<style lang="scss">
  @import '../styles/okta';
  @import '~prismjs/themes/prism-solarizedlight.css';

  .header-anchor {
    display:none;
  }
</style>
