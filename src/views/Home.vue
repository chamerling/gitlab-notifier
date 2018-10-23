<template>
  <div class="home">
    <merge-requests/>
  </div>
</template>

<script>
import MergeRequests from '@/components/MergeRequests.vue'

export default {
  name: 'home',
  components: {
    MergeRequests
  }
}
</script>
