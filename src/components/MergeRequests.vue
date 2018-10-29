<template>
  <v-list two-line dark>
    <div v-for="mergeRequest in mergeRequests" :key="mergeRequest.iid">
      <merge-request-item :mr="mergeRequest"/>
    </div>
  </v-list>
</template>

<script>
import MergeRequestItem from '@/components/MergeRequestItem.vue';

export default {
  name: 'MergeRequests',
  props: {
    mergeRequests: Array
  },
  components: {
    MergeRequestItem
  }
}
</script>
