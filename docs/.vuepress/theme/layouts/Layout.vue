<template>

  <div class="theme-container">

    <TopNavigation/>

    <PromoBanner/>

    <div class="PageContent page-content">
      <Content class="PageContent-main" id="docs-body"/>
    </div>

    <Footer/>

  </div>

</template>

<style lang="scss">
  @import '../styles/okta';
</style>

<script>

  export default {

    name: 'Layout',

    components: {},

    props: {},

    data() {

      return {}

    },

    methods: {},

    created() {

    },

    mounted() {}

  }

</script>

