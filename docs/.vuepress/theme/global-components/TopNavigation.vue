<template>

  <div>

    <header
      :class="{
        'Header': true,
        'is-fixed': true,
        'search-active' : search_active
      }">

      <div class="Wrap">

        <a
          class="Logo" :href="(external_domain + 'bingo')"
          v-html="logo_svg">
        </a>

        <nav class="Header-nav PrimaryNav">
          <ul
            :class=""
            class="menu"
            v-if="menu_items && menu_items.length">

            <MenuItem
              v-for="(item, index) in menu_items"
              :key="index"
              :item="item"
              :index="index"
              :last="menu_items.length"></MenuItem>

          </ul>

          <a class="PrimaryNav-toggle" href="#">
            <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g class="MenuIcon" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                <path d="M1,16 L19,16" class="MenuIcon-line1" stroke="#FFFFFF" stroke-width="2"></path>
                <path d="M1,4 L19,4" class="MenuIcon-line2" stroke="#FFFFFF" stroke-width="2"></path>
                <path d="M1,10 L19,10" class="MenuIcon-line3" stroke="#FFFFFF" stroke-width="2"></path>
                <path d="M1,10 L19,10" class="MenuIcon-line4" stroke="#FFFFFF" stroke-width="2"></path>
              </g>
            </svg>
            <svg class="CloseIcon" width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="ALl-Boards" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop" transform="translate(-915.000000, -235.000000)" fill="#FFFFFF">
                  <g id="Search-bar-Active" transform="translate(30.000000, 26.000000)">
                    <polygon id="Icon/Cross" points="901 210.6 899.4 209 893 215.4 886.6 209 885 210.6 891.4 217 885 223.4 886.6 225 893 218.6 899.4 225 901 223.4 894.6 217"></polygon>
                  </g>
                </g>
              </g>
            </svg>
          </a>

          <div class="PrimaryNav-cta">
            <a target="_blank" rel="noopener noreferrer" href="https://login.okta.com/?SAMLRequest=fc%2B7CsJAEAXQXvAflu1NNJUMeZBGELTx1a%2FrYILJTtyZGD%2FfSBRiYzlw77lMnD3rSj3Qc0ku0YtgrhU6S5fSXRN9PKxmS52l00nMpq6iBvJWCrfDe4ss6vStRe9aDzmGIZfo1jsgwyWDMzUyiIV9vt1AH4XGk5ClSvewUgMNa%2BYW%2FVj5jxhm9NLP67QQaSAMu64L6CYmsFSHlnzT4ZlLwTgcL6Sf8%2FeX9AU%3Dhttps://login.okta.com/?SAMLRequest=fc%2B7CsJAEAXQXvAflu1NNJUMeZBGELTx1a%2FrYILJTtyZGD%2FfSBRiYzlw77lMnD3rSj3Qc0ku0YtgrhU6S5fSXRN9PKxmS52l00nMpq6iBvJWCrfDe4ss6vStRe9aDzmGIZfo1jsgwyWDMzUyiIV9vt1AH4XGk5ClSvewUgMNa%2BYW%2FVj5jxhm9NLP67QQaSAMu64L6CYmsFSHlnzT4ZlLwTgcL6Sf8%2FeX9AU%3D" class="Button--redOutline">Login</a>
            <a :href="(external_domain + '/signup/')" class="Button--red">Sign up</a>
          </div>

          <a
            class="SearchIcon"
            @click="handleSearchClick"
            v-on-clickaway="handleOffSearchClick"></a>

          <form
            id="form_search"
            class="SearchBar Formisimo_clocked_69929"
            method="get"
            :action="search_url"
            name="form_search"
            @submit="handleSearchSubmit">

            <input type="text" name="stq" autocomplete="off" id="st-search-input-auto" class="st-search-input" placeholder="Search">
            <input type="submit" name="submit" id="st-search-submit-go" value="GO">

          </form>

        </nav>

      </div>

    </header>

  </div>

</template>

<style lang="scss">

</style>

<script>

  import { mixin as clickaway } from 'vue-clickaway'
  import MenuItem from "../components/MenuItem"

  export default {

    name: 'TopNavigation',

    components: {
      MenuItem
    },

    mixins: [
      clickaway
    ],

    props: {},

    data() {

      return {
        search_active: false,
        logo_svg: '',
        external_domain: '',
        search_url: '',
        menu_items: null,
      }

    },

    methods: {

      handleOffSearchClick(event) {

        let ignored_id = [
          'st-search-submit-go',
          'st-search-input-auto'
        ]

        if (!ignored_id.includes(event.target.getAttribute('id'))) {
          this.search_active = false
        }

      },

      handleSearchClick(event) {

        event.preventDefault
        this.search_active = !this.search_active

      },

      handleSearchSubmit(event) {

        event.preventDefault()
        event.stopPropagation()

        let search_phrase = document.getElementById('st-search-input-auto').value

        if (search_phrase.length > 3) {
          window.location.href = this.search_url + '#stq=' + search_phrase
        }

      }

    },

    created() {

      if(this.$themeConfig.external_domain) {
        this.external_domain = this.$themeConfig.external_domain
      }

      if(this.$themeConfig.logo_svg) {
        this.logo_svg = this.$themeConfig.logo_svg
      }

      if(this.$themeConfig.primary_nav) {
        this.menu_items = this.$themeConfig.primary_nav
      }

      if(this.$themeConfig.search_url) {
        this.search_url = this.$themeConfig.search_url
      }

    },

    mounted() {}

  }

</script>

