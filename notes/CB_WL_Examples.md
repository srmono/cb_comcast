To simulate a workload with **moderate read-heavy traffic**, here’s a step-by-step guide along with detailed examples. This scenario is common for applications where reads are more frequent than writes, such as user profile lookups, cached queries, or product catalogs.

---

### **Example 1: Simulating Moderate Read-Heavy Traffic**

Let's assume you want to simulate a workload with:
- 70% reads, 20% writes, and 10% deletes.
- Moderate document sizes (2KB per document).
- The target throughput is 3000 operations per second (ops/sec).
- You want to test against 1,000,000 unique keys (items).
- 16 concurrent clients (threads) for parallelism.
- The test will run for 10 minutes (600 seconds).

Here’s the command to run this workload using `cbworkloadgen`:

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 3000 --ratio=read=70,write=20,delete=10 --doc-size=2048 \
--concurrency=16 --num-keys=1000000 --time=600
```

#### **Explanation of Parameters**:
- `-n localhost:8091`: Specifies the Couchbase node’s address.
- `-u Administrator -p password`: Credentials for authentication.
- `-b default`: The Couchbase bucket to run the workload on (here, it's the `default` bucket).
- `-t 3000`: Target 3000 operations per second.
- `--ratio=read=70,write=20,delete=10`: Defines the operation mix, with 70% reads, 20% writes, and 10% deletes.
- `--doc-size=2048`: Specifies the document size as 2048 bytes (2KB).
- `--concurrency=16`: Runs the workload with 16 parallel clients performing operations concurrently.
- `--num-keys=1000000`: Uses 1 million unique keys (simulating a large dataset).
- `--time=600`: Runs the workload for 10 minutes (600 seconds).

---

### **Benchmarking with Moderate Read-Heavy Traffic**

Once you’ve run the workload, you need to monitor key performance metrics:

1. **Throughput (Ops/Sec)**:
   - Check if Couchbase is sustaining the desired throughput of 3000 ops/sec.
   - If the system can’t sustain this rate (e.g., dips below 3000), it could indicate bottlenecks in the CPU, memory, or disk I/O.

2. **Latency**:
   - Latency is critical for read-heavy workloads, as users often expect fast read responses.
   - Measure response times across different percentiles (e.g., 50th, 95th, 99th):
     - **50th Percentile (P50)**: Median response time.
     - **95th Percentile (P95)**: Time it takes for 95% of requests to complete. Focus on this for real-world latency measurement.
     - **99th Percentile (P99)**: Tail latency. The worst-performing requests (slower responses) often indicate stress on the system.
  
3. **Failures**:
   - Make sure no or very few operations are failing. Failures could indicate that the system is overloaded or that there are connectivity issues.

4. **Resource Utilization**:
   - Monitor CPU, memory, and disk usage on the Couchbase nodes while the workload is running.
   - For read-heavy workloads, Couchbase tends to be **memory-intensive** (to handle document lookups quickly) and **CPU-intensive** (for processing multiple requests concurrently).

---

### **Example 2: Scaling Up the Read-Heavy Traffic**

Now let's say you want to increase the throughput and simulate a higher load (e.g., 6000 ops/sec) while keeping the same read-heavy ratio. Here’s how you would modify the command:

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 6000 --ratio=read=70,write=20,delete=10 --doc-size=2048 \
--concurrency=32 --num-keys=1000000 --time=900
```

#### Changes:
- `-t 6000`: Increased the throughput to 6000 ops/sec.
- `--concurrency=32`: Increased the number of concurrent clients to 32 for handling the higher load.
- `--time=900`: Run the test for 15 minutes (900 seconds) instead of 10 minutes.

---

### **Example 3: Testing with Larger Documents**

If your use case involves larger documents (e.g., 5KB instead of 2KB), you can modify the document size to see how Couchbase handles larger payloads. Here’s an example with a 5KB document size:

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 4000 --ratio=read=70,write=20,delete=10 --doc-size=5120 \
--concurrency=16 --num-keys=1000000 --time=600
```

#### Changes:
- `--doc-size=5120`: Increased the document size to 5120 bytes (5KB).
- `-t 4000`: Targeting 4000 ops/sec to see how Couchbase handles the increased document size with similar throughput.

---

### **Evaluating Benchmark Results for Moderate Read-Heavy Traffic**

After running the benchmarks, it’s essential to analyze the results in detail. Here’s how to evaluate each metric for a read-heavy workload:

#### **1. Throughput**:
   - **Achieved Ops/Sec**: Compare the actual throughput achieved against the target (`-t` parameter). For example, if you targeted 3000 ops/sec but only achieved 2500, investigate potential resource bottlenecks.
   - **Scalability**: If increasing the concurrency or document size causes a drop in throughput, this may indicate that your system needs additional resources (e.g., more CPU cores, more nodes in the cluster, faster disks).

#### **2. Latency**:
   - **Low Latency Expected for Reads**: For a read-heavy workload, Couchbase should ideally return read operations in under 10 ms for the **50th percentile** (P50) and around 20–50 ms for the **95th percentile** (P95), depending on the hardware.
   - **Evaluate Tail Latency (P99)**: Focus on the **99th percentile** for reads, as this represents the slower requests under load. Ideally, it should not exceed 100 ms. If P99 is too high, you may need to optimize your system or cache more frequently read documents in memory.
  
#### **3. Failures**:
   - **No Failures**: A well-performing system should not experience any failed operations under moderate read-heavy traffic. Failures could indicate:
     - Resource exhaustion (e.g., running out of memory, high CPU usage).
     - Network issues (e.g., timeouts due to high latency).
     - Improper configuration (e.g., not enough replicas, or disk write failures).

#### **4. Resource Utilization**:
   - **CPU Usage**: Check if CPU usage spikes during the workload. High CPU utilization (close to 100%) might suggest the need to scale up the number of Couchbase nodes or increase CPU resources.
   - **Memory Usage**: Couchbase stores active data in memory. For read-heavy workloads, ensure that the working set fits within the available memory. If Couchbase frequently accesses disk, adding more memory could help improve performance.
   - **Disk I/O**: Monitor disk I/O, especially during write-heavy portions of the workload. High disk wait times or I/O bottlenecks can slow down the system, especially for updates and deletes.

---

### **Example Report Analysis**

Here’s an example of what a result report might look like from `workloadgen`:

```json
{
  "ops_per_sec": 2980,
  "read_latency_ms": {
    "50th": 5,
    "95th": 15,
    "99th": 45
  },
  "write_latency_ms": {
    "50th": 20,
    "95th": 35,
    "99th": 80
  },
  "failures": 0
}
```

#### **Throughput**:
- Achieved throughput: 2980 ops/sec (close to the target of 3000, which is good).

#### **Latency**:
- **Read latency**:
  - 50th percentile: 5 ms (very low latency for reads).
  - 95th percentile: 15 ms (acceptable for most use cases).
  - 99th percentile: 45 ms (a little high but still under 50 ms, which is good for a busy system).
  
- **Write latency**:
  - 50th percentile: 20 ms (decent for writes).
  - 95th percentile: 35 ms (within acceptable limits).
  - 99th percentile: 80 ms (slightly high, but common for heavier writes).

#### **Failures**:
- **0 failures**: Excellent—no operations failed during the test.

---

### **Conclusion**

By running `workloadgen` with different configurations, you can simulate various levels of read-heavy workloads and evaluate Couchbase’s performance. Focus on throughput, latency, failures, and resource utilization to get a comprehensive understanding of how well your system handles real-world traffic.
