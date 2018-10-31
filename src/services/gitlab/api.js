import Client from './client';
import { from, interval } from 'rxjs';
import { flatMap, switchMap, pluck, distinct } from 'rxjs/operators';
import EventEmitter from 'eventemitter3';

export default class Api extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.subscriptions = new Map();
    this.pollingInterval = options.pollingInterval || 3000;
    this.client = new Client(options.apiEndpoint, options.apiToken);
  }

  watchMergeRequests() {
    const myMergeRequests$ = interval(this.pollingInterval).pipe(
      switchMap(() => from(this.client.fetchMergeRequests())),
      pluck('data')
    );

    const newMergeRequest$ = myMergeRequests$.pipe(
      flatMap(mr => mr),
      distinct(mr => mr.id)
    );

    this.newMergeRequestSubscription = newMergeRequest$.subscribe(mr => {
      this.emit('new-merge-request', mr);
      this.subscriptions.set(mr.iid, []);

      const pipelineSubscription = this.watchPipeline(mr).subscribe(pipeline => {
        if (pipeline && pipeline[0]) {
          this.emit('updated-pipeline', {mergeRequest: mr, pipeline: pipeline[0]});
        }
      });

      const mergeRequestSubscription = this.watchMergeRequest(mr.project_id, mr.iid).subscribe(mergeRequest => {
        this.emit('updated-merge-request', mergeRequest);

        if (mergeRequest.state === 'merged') {
          this.emit('merged-merge-request', mergeRequest);
          this.subscriptions.get(mr.iid).forEach(subscription => subscription.unsubscribe());
          this.subscriptions.delete(mr.iid);
        }
      });
      this.subscriptions.get(mr.iid).push(...[pipelineSubscription, mergeRequestSubscription]);
    });
  }

  unwatchMergeRequests() {
    this.subscriptions.forEach((value, key) => {
      value.forEach(subscription => subscription.unsubscribe());
      this.subscriptions.delete(key);
    });

    this.newMergeRequestSubscription && this.newMergeRequestSubscription.unsubscribe();
  }

  watchMergeRequest(projectId, mergeRequestId) {
    return interval(this.pollingInterval).pipe(
      switchMap(() => from(this.client.fetchMergeRequest(projectId, mergeRequestId))),
      pluck('data'),
    );
  }

  watchPipeline(mergeRequest) {
    return interval(this.pollingInterval).pipe(
      switchMap(() => from(this.client.fetchPipelines(mergeRequest.source_project_id, mergeRequest.source_branch))),
      pluck('data')
    );
  }
}
