<template>

  <div class="theme-container">

    <TopNavigation/>

    <PromoBanner/>

    <Content/>

    <Footer/>

  </div>

</template>

<style lang="scss">
  @import '../styles/okta';
</style>

<script>

  import PromoBanner from '../global-components/PromoBanner'
  import TopNavigation from '../global-components/TopNavigation'
  import Footer from '../global-components/Footer'

  export default {

    name: 'Layout',

    components: {
      PromoBanner,
      TopNavigation,
      Footer,
    },

    props: {},

    data() {

      return {

      }

    },

    methods: {

    },

    created() {

    },

    mounted() {

    }

  }

</script>

