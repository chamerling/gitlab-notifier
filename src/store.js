import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiEndpoint: process.env.VUE_APP_GITLAB || 'https://gitlab.com',
    apiToken: process.env.VUE_APP_API_TOKEN,
    mergeRequests: []
  },
  getters: {
    getMergeRequest(state, iid) {
      return _.find(state.mergeRequests, { iid });
    }
  },
  mutations: {
    addMergeRequest(state, mergeRequest) {
     state.mergeRequests.push(mergeRequest)
    },

    removeMergeRequest(state, mergeRequest) {
      state.mergeRequests.splice(_.findIndex(state.mergeRequests, mr => mr.iid === mergeRequest.iid), 1);
    },

    updateMergeRequest(state, mergeRequest) {
      const mr = _.find(state.mergeRequests, { iid: mergeRequest.iid });
      if (mr) {
        mr.approvals = mergeRequest.approvals;
        mr.title = mergeRequest.title;
      }
    },

    updatePipeline(state, {mergeRequest, pipeline}) {
      const mr = _.find(state.mergeRequests, { iid: mergeRequest.iid });

      if (mr) {
        Vue.set(mr, 'pipeline', pipeline);
      }
    }
  },
  actions: {
    addMergeRequest({ commit }, mr) {
      commit('addMergeRequest', mr);
    },

    removeMergeRequest({ commit }, mr) {
      commit('removeMergeRequest', mr)
    },

    updateMergeRequest({ commit }, mr) {
      commit('updateMergeRequest', mr);
    },

    updatePipeline({ commit }, mr, pipeline) {
      commit('updatePipeline', mr, pipeline);
    }
  }
});
