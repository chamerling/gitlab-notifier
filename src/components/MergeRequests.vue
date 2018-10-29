<template>
  <v-list v-if="mergeRequests.length" two-line dark>
    <div v-for="mergeRequest in mergeRequests" :key="mergeRequest.iid">
      <merge-request-item :mr="mergeRequest"/>
    </div>
  </v-list>
  <div v-else class="text-xs-center">
    <v-progress-circular
      :size="50"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
import MergeRequestItem from '@/components/MergeRequestItem.vue';

export default {
  name: 'MergeRequests',
  computed: {
    mergeRequests() {
      return this.$store.state.mergeRequests;
    }
  },
  components: {
    MergeRequestItem
  }
}
</script>
