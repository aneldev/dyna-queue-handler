/* Dev note:

  Stress tests
      Set the STRESS_MODE to true and run the test.
      In case you get the error
        Cannot read property 'getFileName' of undefined
      increase the jasmine.DEFAULT_TIMEOUT_INTERVAL for the case of STRESS_MODE==true.

  Variables initialization
      Test variables initialization is done outside of the it() to be more clear.
      Note that this initialization is taking part before all it() called.

* */

const STRESS_MODE: boolean = false;

if (STRESS_MODE) console.log('WARNING: test is running in Stress Mode, will be slow! For distribution set it to False!');

const TEST_RECORDS_COUNT = STRESS_MODE ? 400 : 20;

import {IGroupJobsView, IGroupJobsViewItem, IJob} from "../../src/DynaQueueHandler";

declare let jasmine: any, describe: any, expect: any, it: any;
if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST_RECORDS_COUNT * 800;

import {DynaQueueHandler} from '../../src/index';
import {forTimes, forLoopToArray, shuffleArray} from "dyna-loops";

let queue = new DynaQueueHandler({diskPath: './temp/testDynaQueueHandler'});

describe('Dyna Queue Handler with default group', () => {

  it(`should clear the disk before start`, (done: Function) => {
    queue.delAll()
      .then(() => {
        expect(true).toBe(true);
        done();
      })
      .catch(console.error);
  });

  // simple add / pick

  it(`should add ${TEST_RECORDS_COUNT} jobs`, (done: Function) => {
    let added: number = 0;
    forTimes(TEST_RECORDS_COUNT, (index: number) => {
      queue.addJob({testId: index})
        .then((job: IJob) => {
          added++;
          expect(job.data.testId).toBe(index);
          if (added == TEST_RECORDS_COUNT) done();
        })
        .catch(console.error);
    });
  });

  it(`should pick these ${TEST_RECORDS_COUNT} jobs back`, (done: Function) => {
    let receivedJobs: number = 0;
    forTimes(TEST_RECORDS_COUNT, (index: number) => {
      queue.pickJob()
        .then((job: IJob) => {
          expect(job && job.data.testId).toBe(index);
          receivedJobs++;
          if (receivedJobs == TEST_RECORDS_COUNT) expect(queue.isWorking).toBe(false);
          if (receivedJobs == TEST_RECORDS_COUNT) done();
        })
        .catch(console.error);
    });
  });

  it('should have the correct viewJobs state', (done: Function) => {
    queue.viewJobs().then((view: IGroupJobsView) => {
      let itemsOfPriority: IGroupJobsViewItem = view.items.find((item: IGroupJobsViewItem) => item.priority === 1);
      expect(itemsOfPriority.priority).toBe(1);
      expect(itemsOfPriority.count).toBe(0);
      done();
    });
  });

  // add pick with events

  const pickWithEventsCollectionAllJobs: IJob[] = [];
  const pickWithEventsCollectionSuperGroup: IJob[] = [];
  const updatePickWithEventsCollectionAllJobs: (job: IJob, done: Function) => void = (job, done) => pickWithEventsCollectionAllJobs.push(job) && done();
  const updatePickWithEventsCollectionSuperGroup: (job: IJob, done: Function) => void = (job, done) => pickWithEventsCollectionSuperGroup.push(job) && done();

  it(`should add ${TEST_RECORDS_COUNT} jobs and listen for events`, (done: Function) => {
    let added: number = 0;
    queue.on('job', updatePickWithEventsCollectionAllJobs);
    queue.on('job/super-group', updatePickWithEventsCollectionSuperGroup);
    forTimes(TEST_RECORDS_COUNT, (index: number) => {
      queue.addJob({testId: index}, index, 'super-group')
        .then((job: IJob) => {
          added++;
          if (added == TEST_RECORDS_COUNT) done();
        })
        .catch(console.error);
    });
  });

  it(`should have picked these ${TEST_RECORDS_COUNT} with event "job"`, (done: Function) => {
    setTimeout(() => {
      expect(pickWithEventsCollectionAllJobs.length).toBe(0); // zero because `job/super-group` is used instead of `job`
      expect(pickWithEventsCollectionSuperGroup.length).toBe(TEST_RECORDS_COUNT);
      queue.removeListener('job', updatePickWithEventsCollectionAllJobs);
      queue.removeListener('job/super-group', updatePickWithEventsCollectionSuperGroup);
      done();
    }, 200);
  });

  // add pick with priorities - test 1 (with only item per priority)

  const jobsWithWithDifferentPriorityTest1: any[] =
    shuffleArray(forLoopToArray(0, TEST_RECORDS_COUNT, (i: number) => ({data: {testId: i}, priority: i})));

  it('should add jobs with different priority', (done: Function) => {
    let added: number = 0;
    jobsWithWithDifferentPriorityTest1.forEach((jobInfo: any) => {
      queue.addJob(jobInfo.data, jobInfo.priority)
        .then((job: IJob) => {
          expect(job.data.testId).toBe(jobInfo.data.testId);
          expect(job.data.testId).toBe(jobInfo.priority);
          added++;
          if (added === jobsWithWithDifferentPriorityTest1.length) done();
        });
    })
  });

  it('should pick the jobs in correct order according the priority', (done: Function) => {
    const collectedJobs: IJob[] = [];
    forTimes(jobsWithWithDifferentPriorityTest1.length, (iterator: number) => {
      queue.pickJob()
        .then((job: IJob) => {
          collectedJobs.push(job);
          expect(job).not.toBe(null);
          expect(job).not.toBe(undefined);
          expect(job && job.data.testId).toBe(iterator);
          if (iterator == jobsWithWithDifferentPriorityTest1.length - 1) expect(queue.isWorking).toBe(false);
          if (iterator == jobsWithWithDifferentPriorityTest1.length - 1) done();
        });
    });
  });

  it('should have the correct viewJobs state', (done: Function) => {
    queue.viewJobs().then((view: IGroupJobsView) => {
      expect(view.hasJobs).toBe(false);
      done();
    });
  });

  // add pick with priorities - test 2 (with multiple items per priority

  const jobsWithWithDifferentPriorityTest2: any[] = [];
  const RECORDS_IN_SAME_PRIORITY_COUNT: number = STRESS_MODE ? 20 : 5;
  forTimes(TEST_RECORDS_COUNT, (iRecordsCount: number) =>
    forTimes(RECORDS_IN_SAME_PRIORITY_COUNT, (iForId: number) => // items with the same priority
      jobsWithWithDifferentPriorityTest2.push({data: {testId: `${iRecordsCount}-${iForId}`}, priority: iRecordsCount})
    )
  );
  shuffleArray(jobsWithWithDifferentPriorityTest2);

  it('should add jobs with different priority', (done: Function) => {
    let added: number = 0;
    jobsWithWithDifferentPriorityTest2.forEach((jobInfo: any) => {
      queue.addJob(jobInfo.data, jobInfo.priority)
        .then((job: IJob) => {
          expect(job.data.testId).toBe(jobInfo.data.testId);
          expect(job.priority).toBe(jobInfo.priority);
          added++;
          if (added === jobsWithWithDifferentPriorityTest2.length) done();
        });
    })
  });

  it('should pick the jobs in correct order according the priority', (done: Function) => {
    const collectedJobs: IJob[] = [];
    forTimes(TEST_RECORDS_COUNT, (iRecordsCount: number) =>
      forTimes(RECORDS_IN_SAME_PRIORITY_COUNT, (iForId: number) => {// items with the same priority
        queue.pickJob()
          .then((job: IJob) => {
            collectedJobs.push(job);
            expect(job).not.toBe(null);
            expect(job).not.toBe(undefined);
            expect(job && job.data.testId).toBe(`${iRecordsCount}-${iForId}`);
            expect(job && job.priority).toBe(iRecordsCount);
            if (iRecordsCount == TEST_RECORDS_COUNT - 1 && iForId == RECORDS_IN_SAME_PRIORITY_COUNT - 1) done();
          })
          .catch(console.error);
      })
    );
  });

  it('should have the correct no pending jobs', (done: Function) => {
    queue.viewJobs().then((view: IGroupJobsView) => {
      expect(view.hasJobs).toBe(false);
      done();
    });
  });

  // check the call back of the events when registered after the addition

  const testCollectionForDoneUsage: any[] = [];
  const consumeEvent1 = (job: IJob, done: Function) => {
    testCollectionForDoneUsage.push({action: 'job execution', job, time: new Date()});
    setTimeout(() => done(), 10);
  };

  it('should add items to use them later registered events', (done: Function) => {
    forTimes(TEST_RECORDS_COUNT, (i: number) => {
      let jobData: any = {jobId: i};
      queue.addJob(jobData, 0, 'my-super-group').then((job: IJob) => {
        testCollectionForDoneUsage.push({action: 'job add', job});
        if (i == TEST_RECORDS_COUNT - 1) done();
      });
    });
  });

  it('should add event and then consume the pending items', (done: Function) => {
    queue.on('job/my-super-group', consumeEvent1);
    setTimeout(() => {
      forTimes(TEST_RECORDS_COUNT, () => {
        expect(testCollectionForDoneUsage.shift().action).toBe('job add');
      });
      forTimes(TEST_RECORDS_COUNT, () => {
        expect(testCollectionForDoneUsage.shift().action).toBe('job execution');
      });
      expect(testCollectionForDoneUsage.length).toBe(0);
      done();
    }, TEST_RECORDS_COUNT * 110);
  });

  it('should have the correct no pending jobs in "my-super-group" group', (done: Function) => {
    queue.viewJobs('my-super-group').then((view: IGroupJobsView) => {
      expect(view.hasJobs).toBe(false);
      done();
    });
  });

  // check the call back of the events when the event registered in advance

  const testCollectionForDoneUsageOnTheSameTime: any[] = [];
  const consumeEvent2 = (job: IJob, done: Function) => {
    testCollectionForDoneUsageOnTheSameTime.push({action: 'job execution', job, time: new Date()});
    setTimeout(() => done(), 100);
  };

  it('should add items to use them while the event is already registered', (done: Function) => {
    queue.on('job/my-super-group-2', consumeEvent2);
    forTimes(TEST_RECORDS_COUNT, (iterate: number) => {
      let jobData: any = {jobId: iterate};
      queue.addJob(jobData, 0, 'my-super-group-2')
        .then((job: IJob) => {
          testCollectionForDoneUsageOnTheSameTime.push({action: 'job add', job});
          if (iterate == TEST_RECORDS_COUNT - 1) done();
        })
        .catch((error: any) => console.error('error adding items', error));
    });
  });

  it('should consume correctly the added items', (done: Function) => {
    setTimeout(() => {
      let jobAddActions: number = testCollectionForDoneUsageOnTheSameTime.filter((testAction: any) => testAction.action === 'job add').length;
      let jobExecutionActions: number = testCollectionForDoneUsageOnTheSameTime.filter((testAction: any) => testAction.action === 'job execution').length;

      expect(jobAddActions).toBe(TEST_RECORDS_COUNT);
      expect(jobExecutionActions).toBe(TEST_RECORDS_COUNT);

      done();
    }, TEST_RECORDS_COUNT * 150);
  });

  it('should have the correct no pending jobs in "my-super-group-2" group', (done: Function) => {
    queue.viewJobs('my-super-group-2').then((view: IGroupJobsView) => {
      expect(view.hasJobs).toBe(false);
      done();
    });
  });

  // clean up

  it(`should clean the disk for good bye`, (done: Function) => {
    queue.delAll()
      .then(() => {
        expect(true).toBe(true);
        done();
      })
      .catch(console.error);
  });


});
