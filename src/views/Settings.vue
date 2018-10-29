<template>
  <div class="pa-3">
    <v-form>
      <v-text-field
        ref="api-token"
        :value="apiToken"
        label="API Token"
        required
      ></v-text-field>
      <v-text-field
        ref="api-endpoint"
        :value="apiEndpoint"
        label="Gitlab URL"
        required
      ></v-text-field>
      <v-btn @click="submit">Submit</v-btn>
    </v-form>
  </div>
</template>

<script>

export default {
  name: 'settings',
  computed: {
    apiToken() {
      return this.$store.state.apiToken;
    },
    apiEndpoint() {
      return this.$store.state.apiEndpoint;
    }
  },
  methods: {
    submit() {
      this.$store.dispatch('updateSettings', { apiToken: this.$refs['api-token'].value, apiEndpoint: this.$refs['api-endpoint'].value });
      this.$router.push('/');
    }
  },
  components: {
  }
}
</script>
