<template>

  <footer class="Footer">

    <div class="Wrap">

      <div class="Row">

        <div class="Column--3 Column--medium-6 Column--xSmall-12">
          <a href="https://www.okta.com/" target="_blank" rel="noopener noreferrer">
            <div class="Logo">
              <img src="https://developer.okta.com/sites/all/themes/developer/images/logo-footer.png" alt="Okta">
            </div>
            <p>Visit okta.com</p>
          </a>
        </div>

        <FooterColumn
          v-for="(column, index) in footer_columns"
          :heading="column.heading"
          :menu="column.menu"/>

      </div>

    </div>

  </footer>

</template>

<style lang="scss">

</style>

<script>

  export default {

    name: 'Footer',

    components: {},

    props: {},

    data() {

      return {
        footer_columns: null
      }

    },

    methods: {},

    created() {

      if(this.$themeConfig.footer_nav) {
        this.footer_columns = this.$themeConfig.footer_nav
      }

    },

    mounted() {}

  }

</script>

