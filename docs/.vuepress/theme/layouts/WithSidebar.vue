<template>

  <div class="theme-container">

    <TopNavigation/>

    <PromoBanner/>

    <section class="PageContent DynamicSidebar has-tableOfContents">
    <Sidebar/>

    <div class="PageContent page-content">
      <Content class="PageContent-main DynamicSidebar has-tableOfContents page-content"/>
    </div>

    </section>

    <Footer/>

  </div>

</template>

<style lang="scss">

</style>

<script>

  import Layout from './Layout'

  export default {

    name: 'WithSidebar',

    mixins: {
      Layout
    },

  }

</script>

