<template>
    <div class="Page Page--docs-page">
      <TopNavigation/>

      <section class="PageContent DynamicSidebar has-tableOfContents">
          <aside class="Sidebar">
            <h2 class="Sidebar-location Sidebar-toggle h6">Navigation</h2>
            <div class="Sidebar-close Sidebar-toggle"></div>
            <div v-for="(navItem, i) in navigation" :key="i" class="Sidebar-navgroup">
              <h3 class="Sidebar-title">{{navItem.title}} Integration</h3>
              <ul class="Sidebar-nav">
                <li v-for="(codePage, i) in navItem.pages" :key="i" :class="{'is-active': codePage.path === $page.path}">
                  <a :href="codePage.path">{{codePage.frontmatter.link_title}}</a>
                </li>
              </ul>
            </div>
          </aside>
          <Content class="PageContent-main"/>
      </section>

      <Footer />
    </div>
</template>

<script>
  export default {
    data: function () {
      return {

      }
    },
    computed: {
      navigation() {
        let nav = {};
        this.$site.pages
          .filter(pages => pages.frontmatter.layout === 'Code')
          .forEach(function (page) {
            let type = page.frontmatter.integration_type;
            if ( !nav.hasOwnProperty(type) ) {
              nav[type] = { "title": type, "pages": [] };
            }

            nav[type]["pages"].push(page)

          });
        return nav
      }
    }
  }
</script>

<style src="../styles/okta.scss" lang="scss"></style>
<style scoped>
  .Sidebar-navgroup {
    margin: 0 0 40px;
  }

  .Sidebar-navgroup:first-child {
    margin-top: 0;
  }

  .Sidebar-nav > li > a {
    text-transform: uppercase;
  }
</style>
