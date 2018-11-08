<template>

  <aside class="Sidebar">

    <h2 class="Sidebar-location Sidebar-toggle h6">Navigation</h2>
    <div class="Sidebar-close Sidebar-toggle"></div>
    <div>
      <div v-for="section in navigation" :key="section.title" class="Sidebar-group">
        <h3 class="Sidebar-title">{{section.title}}</h3>
        <ul class="Sidebar-nav">
          <li v-for="link in section.links" :key="link.title" :class="{'is-active': $page.path === link.path}">
            <a :href="link.link">{{link.title}}</a>
          </li>
        </ul>
      </div>
    </div>

  </aside>

</template>

<script>
  export default {
    name: 'Sidebar',
    computed: {
      navigation() {
        return this.$site.pages
          .filter(pages => pages.path.startsWith( "/documentation/"))[0]
          .frontmatter.sections
      }
    }
  }
</script>

<style src="../styles/okta.scss" lang="scss"></style>
<style scoped>
  .Sidebar-group {
    margin: 0 0 60px
  }
</style>
