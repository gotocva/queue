const EventEmitter = require('events');

class Queue extends EventEmitter {

  showLog = false;
  constructor() {
    super();
    this.queue = [];
    this.processing = false;
  }

  /**
   * Add a job to the queue with retry and backoff options
   * @param {Object} job - The job data
   * @param {Object} options - Job options { attempts: Number, backoff: Number }
   */
  add(job, options = { attempts: 3, backoff: 5000 }) {
    job.attempts = options.attempts;
    job.backoff = options.backoff;
    if(options.showLog) this.showLog = options.showLog;
    this.queue.push(job);
    this.process();
  }

  /**
   * Process the queue one job at a time
   */
  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    let job = this.queue.shift();

    while (job.attempts > 0) {
      try {
        await this.emitAsync('process', job);
        if(this.showLog == true) console.log(`✅ Job completed: ${JSON.stringify(job)}`);
        break; // Job succeeded, exit retry loop
      } catch (error) {
        if(this.showLog == true) console.error(`❌ Job failed, attempts left: ${job.attempts - 1}`, error);
        job.attempts--;

        if (job.attempts > 0) {
          if(this.showLog == true) console.log(`⏳ Retrying job in ${job.backoff}ms...`);
          await this.sleep(job.backoff);
        }
      }
    }

    this.processing = false;
    setImmediate(() => this.process()); // Continue processing
  }

  /**
   * Emit event with async support
   * @param {string} event - Event name
   * @param  {...any} args - Event arguments
   * @returns {Promise}
   */
  emitAsync(event, ...args) {
    return new Promise((resolve, reject) => {
      this.emit(event, ...args, resolve, reject);
    });
  }

  /**
   * Sleep function for backoff delay
   * @param {Number} ms - Milliseconds to wait
   * @returns {Promise}
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = Queue;
