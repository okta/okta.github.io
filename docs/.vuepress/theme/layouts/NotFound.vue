<template>

  <div class="theme-container">

    <TopNavigation/>

    <PromoBanner/>

    <div class="PageContent page-content content custom">
      This is the 404 page.
    </div>

    <Footer/>

  </div>

</template>

<style lang="scss">

</style>

<script>

  import FooterColumn from '../global-components/FooterColumn'

  export default {

    name: 'NotFound',

    components: {
      FooterColumn
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

