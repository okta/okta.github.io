<template>
  <div class="event-types">
    <input type="text" id="event-type-search" name="filter" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Search event types for...">
    <div id="event-type-count">Found <b>{{resultCount}}</b> matches</div>
    <div class="event-type" v-for="eventType in eventTypeJson.versions[1].eventTypes" :key="eventType.id">
      <h4 id="appaccessrequestapproverapprove">
        {{eventType.id}}
      </h4>

      <div class="event-type-mappings" v-if="eventType.mappings.length > 0">
        <b>Legacy event types: </b> {{ eventType.mappings.join(', ') }}
      </div>

      <p class="event-type-description" v-if="eventType.description">{{ eventType.description}}</p>
      <p class="event-type-description" v-else>No Description</p>

      <div class="event-type-tags">
        <code class="event-type-tag" v-for="tag in eventType.tags" :key="tag">{{ tag }}</code>
      </div>
      <div class="event-type-release">
        Since: <a href="/docs/change-log/">{{ eventType.info.release }}</a>
      </div>
    </div>
  </div>
</template>

<script>
  import eventTypes from './../../vuepress-site/data/event-types.json'
  export default {
    created() {
      this.eventTypeJson = eventTypes
    },
    data() {
      return {
        resultCount: 0,
        eventTypeJson: null
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '../styles/event-types';
</style>
