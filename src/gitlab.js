import { from, interval } from 'rxjs';
import { flatMap, switchMap, pluck, distinct } from 'rxjs/operators';
import axios from 'axios';

class Gitlab {
  constructor(store, options = { pollingInterval: 3000 }) {
    this.store = store;
    this.subscriptions = {};
    this.pollingInterval = options.pollingInterval || 3000;
    this.client = axios.create({
      baseURL: this.store.state.apiEndpoint,
      headers: {
        'Private-Token': this.store.state.apiToken
      }
    });
  }

  watchMergeRequests() {
    const myMergeRequests$ = interval(this.pollingInterval).pipe(
      switchMap(() => from(this.fetchMergeRequests())),
      pluck('data')
    );

    const newMergeRequest$ = myMergeRequests$.pipe(
      flatMap(mr => mr),
      distinct(mr => mr.id)
    );

    newMergeRequest$.subscribe(mr => {
      this.store.dispatch('addMergeRequest', mr);

      const pipeline$ = this.watchPipeline(mr).subscribe(pipeline => {
        if (pipeline && pipeline[0]) {
          this.store.dispatch('updatePipeline', { mergeRequest: mr, pipeline: pipeline[0] });
        }
      });

      const mergeRequest$ = this.watchMergeRequest(mr.project_id, mr.iid).subscribe(mergeRequest => {
        this.store.dispatch('updateMergeRequest', mergeRequest);

        if (mergeRequest.state === 'merged') {
          this.store.dispatch('removeMergeRequest', mergeRequest);
          mergeRequest$.unsubscribe();
          pipeline$.unsubscribe();
        }
      });
    });
  }

  watchMergeRequest(projectId, mergeRequestId) {
    return interval(this.pollingInterval).pipe(
      switchMap(() => from(this.fetchMergeRequest(projectId, mergeRequestId))),
      pluck('data'),
    );
  }

  watchPipeline(mergeRequest) {
    return interval(this.pollingInterval).pipe(
      switchMap(() => from(this.fetchPipelines(mergeRequest.source_project_id, mergeRequest.source_branch))),
      pluck('data')
    );
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

export default Gitlab;