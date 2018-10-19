<template>

  <div class="theme-container">

    <PromoBanner/>

    <TopNavigation/>

    <Content/>

    <Sidebar/>

    <Footer/>

  </div>

</template>

<style lang="scss">

</style>

<script>

  import Layout from './Layout'
  import Sidebar from '../global-components/Sidebar'
  import PromoBanner from '../global-components/PromoBanner'
  import TopNavigation from '../global-components/TopNavigation'
  import Footer from '../global-components/Footer'

  export default {

    name: 'WithSidebar',

    components: {
      PromoBanner,
      TopNavigation,
      Footer,
      Sidebar,
    },

    mixins: {
      Layout
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

