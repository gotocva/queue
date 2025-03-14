
# 📦 @gotocva-queue  
**An in-memory event queue for Node.js with retry and backoff support.**  

[![NPM Version](https://img.shields.io/npm/v/@gotocva-queue.svg)](https://www.npmjs.com/package/@gotocva-queue)  
[![License](https://img.shields.io/npm/l/@gotocva-queue.svg)](https://github.com/@gotocva/queue/blob/main/LICENSE)  
[![Downloads](https://img.shields.io/npm/dt/@gotocva-queue.svg)](https://www.npmjs.com/package/@gotocva-queue)  

---

## 🚀 Features
✅ **In-memory queue** (No Redis, No Database)  
✅ **Auto-retry failed jobs** (with configurable attempts)  
✅ **Backoff delay before retry**  
✅ **Process jobs sequentially**  
✅ **Simple API, Lightweight, and Fast**  

---

## 📥 Installation  
Install via **npm**:  
```sh
npm install @gotocva-queue
```

Install via **yarn**:  
```sh
yarn add @gotocva-queue
```

---

## 📌 Usage  

### 1️⃣ **Basic Example**  
```javascript
const Queue = require('@gotocva-queue');

const jobQueue = new Queue();

// Register event listener to process jobs
jobQueue.on('process', async (job, resolve, reject) => {
  console.log(`Processing job: ${JSON.stringify(job)}`);

  // Simulate a failing job (50% failure rate)
  if (Math.random() > 0.5) {
    return reject(new Error('Random Job Failure'));
  }

  setTimeout(resolve, 1000); // Simulate async task success
});

// Add jobs with retry & backoff
jobQueue.add({ id: 1, task: 'Send Email' }, { attempts: 3, backoff: 5000 });
jobQueue.add({ id: 2, task: 'Generate Report' }, { attempts: 3, backoff: 5000 });
```

---

## 📖 API Reference

### 🏗 `new Queue()`
Creates a new instance of the **in-memory queue**.

### 📌 `.add(job, options)`
Adds a **job** to the queue.  
#### **Parameters**  
- **`job`** *(Object)* → Job data (e.g., `{ id: 1, task: 'Send Email' }`)  
- **`options`** *(Object, optional)*:  
  - `attempts` *(Number)* → Number of times to retry on failure *(default: `3`)*
  - `backoff` *(Number)* → Delay before retrying in **ms** *(default: `5000`)*  

#### **Example**
```javascript
queue.add({ id: 1, task: 'Send Email' }, { attempts: 3, backoff: 5000 });
```

---

### 🔄 `.on('process', async (job, resolve, reject) => { ... })`
Registers a **listener** that processes jobs.

#### **Parameters**
- **`job`** *(Object)* → The job being processed  
- **`resolve`** *(Function)* → Call this when the job succeeds  
- **`reject`** *(Function)* → Call this when the job fails  

#### **Example**
```javascript
queue.on('process', async (job, resolve, reject) => {
  try {
    console.log(`Processing job: ${job.task}`);
    resolve(); // Mark job as complete
  } catch (error) {
    reject(error); // Retry if job fails
  }
});
```

---

## ⚡ Advanced Example

### **Simulating API Calls & Retrying on Failure**
```javascript
const Queue = require('@gotocva-queue');
const axios = require('axios');

const apiQueue = new Queue();

// Process jobs (making API request)
apiQueue.on('process', async (job, resolve, reject) => {
  console.log(`Calling API: ${job.url}`);

  try {
    const response = await axios.get(job.url);
    console.log(`✅ API Success: ${response.status}`);
    resolve();
  } catch (error) {
    console.error(`❌ API Failed: ${error.message}`);
    reject(error);
  }
});

// Add an API call job
apiQueue.add({ url: 'https://jsonplaceholder.typicode.com/posts/1' }, { attempts: 5, backoff: 3000 });
```

---

## 🛠 How It Works  

| **Step** | **Description** |
|----------|---------------|
| 1️⃣ | Jobs are added to the queue using `.add(job, options)`. |
| 2️⃣ | The `process` event is triggered for each job. |
| 3️⃣ | If the job succeeds, `resolve()` is called. |
| 4️⃣ | If the job fails, `reject(error)` is called, and the job retries based on `attempts`. |
| 5️⃣ | Failed jobs wait (`backoff` ms) before retrying. |

---

## 📌 Why Use `@gotocva-queue`?  

✅ **No Dependencies** → No need for Redis or external services  
✅ **Simple API** → Just add jobs and listen for events  
✅ **Fast & Lightweight** → Built for high performance  
✅ **Supports Retries** → Ensures jobs are processed reliably  

---

## ⚖️ Comparison with Other Queues  

| Feature            | @gotocva-queue  | Bull (Redis) | Kue (Redis) |
|--------------------|---------------|-------------|-------------|
| **No Redis Required** | ✅ Yes  | ❌ No  | ❌ No  |
| **Retry & Backoff** | ✅ Yes  | ✅ Yes  | ✅ Yes  |
| **In-Memory**       | ✅ Yes  | ❌ No  | ❌ No  |
| **Simple API**      | ✅ Yes  | ❌ Complex | ❌ Complex |
| **Good for Small Apps** | ✅ Yes  | ❌ No | ❌ No |

---

## 📜 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author
**gotocva** - [GitHub](https://github.com/gotocva)  

---

## ⭐ Support
If you like this project, give it a ⭐ on **[GitHub](https://github.com/gotocva/queue)**! 🚀