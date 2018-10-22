<template>

  <li
    :class="{
      'first': (index == 0),
      'leaf': (index == last),
      'expanded': (item.children && item.children.length)
    }">

    <a
      :href="item.link"
      :class="('label ' + item.css)"
      :target="item.target"
      v-html="item.text"></a>

    <ul
      class="menu"
      v-if="item.children && item.children.length">

      <MenuItem
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        :index="index"
        :last="item.children.length"></MenuItem>

    </ul>

  </li>

</template>

<style lang="scss">

</style>

<script>

  import MenuItem from './MenuItem'

  export default {

    name: 'MenuItem',

    components: {
      MenuItem
    },

    props: {
      
      index: {
        type: Number,
        default: 0
      },
      
      last: {
        type: Number,
        default: 0,
      },
      
      item: {
        type: Object,
        default: () => {}
      },

      css: {
        type: String,
        default: ''
      }
      
    },

    data() {

      return {}

    },

    methods: {},

    created() {},

    mounted() {}

  }

</script>

