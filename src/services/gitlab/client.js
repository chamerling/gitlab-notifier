import axios from 'axios';

export default class Client {
  constructor(baseURL, privateToken) {
    this.client = this._createClient(baseURL, privateToken);
  }

  _createClient(baseURL, privateToken) {
    return axios.create({
      baseURL,
      headers: {
        'Private-Token': privateToken
      }
    });
  }

  fetchMergeRequests() {
    return this.client.get('/api/v4/merge_requests?state=opened');
  }

  fetchMergeRequest(projectId, id) {
    return this.client.get(`/api/v4/projects/${projectId}/merge_requests/${id}`);
  }

  fetchPipelines(projectId, refId) {
    return this.client.get(`/api/v4/projects/${projectId}/pipelines?ref=${refId}`);
  }

  getCurrentUser() {
    return this.client.get('/api/v4/user');
  }
}