<template>

  <div class="theme-container">

    <TopNavigation/>

    <PromoBanner/>

    <div class="PageContent page-content">
      <Content class="PageContent DynamicSidebar has-tableOfContents page-content"/>
    </div>

    <Sidebar/>

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

