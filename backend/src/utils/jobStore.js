class JobStore {
  constructor() {
    this.jobs = new Map();
  }

  createJob(jobId, data) {
    this.jobs.set(jobId, {
      status: "pending",
      progress: 0,
      filePath: null,
      error: null,
      ...data,
    });
  }

  updateJob(jobId, data) {
    if (this.jobs.has(jobId)) {
      const currentJob = this.jobs.get(jobId);
      this.jobs.set(jobId, { ...currentJob, ...data });
    }
  }

  getJob(jobId) {
    return this.jobs.get(jobId);
  }

  removeJob(jobId) {
    this.jobs.delete(jobId);
  }
}

export default new JobStore();
