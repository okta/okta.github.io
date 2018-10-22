<template>

  <div class="theme-container">

    <TopNavigation/>

    <PromoBanner/>

    <Content class="PageContent DynamicSidebar has-tableOfContents page-content"/>

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

    components: {},

    mixins: {
      Layout
    },

    props: {},

    data() {

      return {}

    },

    methods: {},

    created() {},

    mounted() {}

  }

</script>

