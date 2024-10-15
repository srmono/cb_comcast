Here’s a detailed breakdown with **examples** for each aspect of benchmarking with `workloadgen`, from testing **throughput** to more advanced topics like **fault tolerance** and **node failure tests**. These examples cover a variety of parameters to help you understand how to set up and interpret different types of performance evaluations for Couchbase.

---

### **1. Throughput**

**Throughput** measures how many operations per second (ops/sec) your system can handle. You might want to simulate a certain number of operations, or gradually increase this to stress the system.

**Example**: Test Couchbase's ability to handle 5000 operations per second with a mix of 60% reads and 40% writes.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 5000 --ratio=read=60,write=40 --doc-size=2048 --concurrency=20 \
--num-keys=1000000 --time=600
```
- This runs for 600 seconds with 5000 ops/sec.
- The **key metric** here is whether Couchbase can sustain this level of operations.

---

### **2. Latency**

**Latency** measures the response time for operations. You’ll want to analyze this at different percentiles (e.g., 50th, 95th, 99th) to understand how fast the system is responding under load.

**Example**: Simulate 70% reads, 20% writes, and 10% deletes to measure latency at 95th and 99th percentiles.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 4000 --ratio=read=70,write=20,delete=10 --doc-size=1024 \
--concurrency=25 --num-keys=500000 --time=900
```

- The **important metric** here is latency at the 95th percentile or higher. The goal is to ensure that even the slowest 5% of operations remain within an acceptable time range (e.g., <100ms).

---

### **3. Capacity**

**Capacity** measures how many resources the system consumes under different workloads. This includes CPU, memory, and disk usage.

**Example**: Test Couchbase’s capacity by simulating 10000 ops/sec and monitoring CPU/memory usage on each node.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 10000 --ratio=read=50,write=50 --doc-size=4096 \
--concurrency=50 --num-keys=2000000 --time=1200
```
- Check resource utilization on each node while the test is running using tools like `top`, `htop`, or Couchbase's built-in resource monitoring dashboard.

---

### **4. Fault Tolerance**

**Fault tolerance** measures the system’s ability to handle node failures and recover without significant impact on performance.

**Example**: Simulate a read-heavy workload while forcing a node failover to see how the system recovers.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 6000 --ratio=read=90,write=10 --doc-size=2048 \
--concurrency=30 --num-keys=1000000 --time=1800
```

- While this is running, manually fail over a node using Couchbase's UI or CLI and observe how the system behaves.
- The goal is to measure how quickly the system recovers and if any operations fail during the failover.

---

### **5. Cluster Size**

**Cluster size** affects performance and resilience. More nodes generally allow higher throughput and better fault tolerance.

**Example**: Test a 6-node cluster to evaluate how Couchbase scales with more nodes under heavy load.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 8000 --ratio=read=80,write=20 --doc-size=2048 \
--concurrency=40 --num-keys=3000000 --time=1800
```

- Measure the impact of adding nodes on throughput and latency.
- The goal is to see how the performance improves as the cluster grows.

---

### **6. Data Set**

**Data set size** is important for ensuring that the benchmark reflects real-world scenarios. You need to simulate a realistic number of items in the database.

**Example**: Use a 2 million item data set with documents averaging 3KB in size.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
--num-keys=2000000 --doc-size=3072 --ratio=read=70,write=30 \
--concurrency=20 --time=1200
```

- Ensure the key size and document size are realistic for your use case.

---

### **7. Network**

**Network** can affect latency and throughput, especially in geographically distributed clusters. Use network monitoring tools to simulate conditions like high latency or packet loss.

**Example**: Simulate moderate throughput while testing Couchbase’s network resilience (e.g., with 100ms latency).

```bash
cbworkloadgen -n couchbase1.local:8091,couchbase2.local:8091 \
-u Administrator -p password -b default \
--ratio=read=50,write=50 --doc-size=1024 --num-keys=1000000 --time=1800
```

- Use network tools like `tc` on Linux to simulate network latency and packet loss between nodes.
- The goal is to evaluate the impact of poor network conditions on Couchbase performance.

---

### **8. Operation Ratios**

The **operation ratio** defines the mix of reads, writes, updates, and deletes in your workload. This is crucial for simulating different types of workloads.

**Example**: Simulate a 70% read, 20% write, and 10% delete workload.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
--ratio=read=70,write=20,delete=10 --doc-size=2048 \
--concurrency=30 --num-keys=1000000 --time=600
```

- The mix of operations should reflect your actual application workload.

---

### **9. Document Size**

**Document size** affects performance and resource utilization, especially memory and disk I/O.

**Example**: Test with large 10KB documents.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
--doc-size=10240 --ratio=read=60,write=40 --concurrency=20 --num-keys=500000 --time=600
```

- Couchbase should handle larger documents well, but the test will reveal how it impacts throughput and latency.

---

### **10. Keyspace**

The **keyspace** represents the number of unique keys being used. Simulating a large keyspace is important for use cases that have a large number of unique items.

**Example**: Simulate a keyspace of 10 million unique keys.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
--num-keys=10000000 --doc-size=4096 --ratio=read=80,write=20 \
--concurrency=25 --time=1200
```

- A larger keyspace ensures that Couchbase’s key distribution mechanisms are tested.

---

### **11. Concurrency**

**Concurrency** refers to the number of parallel clients performing operations. This tests Couchbase’s ability to handle multiple simultaneous users.

**Example**: Simulate 50 concurrent clients performing operations.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
--concurrency=50 --doc-size=2048 --ratio=read=70,write=30 --num-keys=1000000 --time=900
```

- Increasing concurrency helps measure how Couchbase scales under high user demand.

---

### **12. Duration**

**Duration** of the test ensures that you capture performance over time, including any potential slowdowns or bottlenecks.

**Example**: Run a 1-hour benchmark to simulate a sustained workload.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
--time=3600 --ratio=read=60,write=40 --doc-size=2048 --concurrency=30 --num-keys=1000000
```

- Running long tests helps identify slowdowns that occur over time, such as increased latency or resource exhaustion.

---

### **13. Baseline Test**

A **baseline test** is the first benchmark you run to establish initial performance metrics without any additional load or special conditions.

**Example**: Run a simple baseline test with a small amount of traffic.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
--time=600 --ratio=read=90,write=10 --doc-size=1024 --concurrency=10 --num-keys=100000
```

- This test will give you an idea of your system’s basic performance under low load.

---

### **14. Incremental Tests**

An **incremental test** involves gradually increasing the workload to find the point where performance starts to degrade.

**Example**: Start at 2000 ops/sec, then incrementally increase to 6000 ops/sec.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b

 default \
--time=300 --ratio=read=80,write=20 --doc-size=2048 --concurrency=10 --num-keys=100000
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 4000 --time=300 --ratio=read=80,write=20 --doc-size=2048 --concurrency=20 --num-keys=100000
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 6000 --time=300 --ratio=read=80,write=20 --doc-size=2048 --concurrency=30 --num-keys=100000
```

- Observe when performance starts to degrade (e.g., increasing latency or failures).

---

### **15. Stress Test**

A **stress test** pushes the system to its limits by applying a load far higher than the expected maximum, to see how it behaves under extreme conditions.

**Example**: Run a stress test with 20000 ops/sec and observe system behavior.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 20000 --time=900 --ratio=read=50,write=50 --doc-size=4096 --concurrency=100 --num-keys=5000000
```

- Monitor system behavior for failures, high latency, and resource exhaustion.

---

### **16. Node Failure Test**

A **node failure test** checks how Couchbase handles node failures during active workloads.

**Example**: Simulate a read-heavy workload and manually fail over a node to test fault tolerance.

```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default \
-t 6000 --ratio=read=90,write=10 --doc-size=1024 --concurrency=20 --num-keys=1000000 --time=1800
```

- While the workload is running, manually take down a node and observe how the system handles it.

---

### **Conclusion**

By following these examples, you can perform comprehensive benchmarking of Couchbase using `cbworkloadgen`. Each test type focuses on a different aspect of system performance, allowing you to fine-tune and optimize Couchbase for your particular use case. 