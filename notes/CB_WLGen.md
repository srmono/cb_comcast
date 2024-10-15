### 1. **Installation and Setup**

Before using `workloadgen`, you need to install Couchbase Server and ensure the `cbworkloadgen` tool is available.

#### Steps:
- **Install Couchbase Server**:
  1. Download the Couchbase Server from the [official Couchbase download page](https://www.couchbase.com/downloads).
  2. Follow the installation instructions specific to your OS (Linux, macOS, or Windows).

- **Ensure Couchbase Command-Line Tools**:
  - `cbworkloadgen` is typically installed along with Couchbase Server. After installation, the binary will be located in the Couchbase installation directory under `/opt/couchbase/bin/` (on Linux) or `C:\Program Files\Couchbase\Server\bin\` (on Windows).

  Example on Linux:
  ```bash
  sudo /opt/couchbase/bin/cbworkloadgen -h
  ```

  If you don’t see `cbworkloadgen`, you may need to install Couchbase tools or update your environment's PATH.

---

### 2. **Configuration Parameters**

You can customize various parameters to create specific workloads based on your testing needs. Here’s a breakdown of common configuration options.

#### **Key Parameters:**
- **Cluster Connection**:
  - `-n` or `--node` : The Couchbase cluster node’s address (e.g., `localhost:8091`).
  - `-u` or `--username`: Username to connect to the Couchbase cluster (e.g., `Administrator`).
  - `-p` or `--password`: Password for the given user.
  - `-b` or `--bucket`: The Couchbase bucket (e.g., `default`).

- **Operations & Workload Mix**:
  - `-t` or `--throughput`: Target throughput, i.e., the number of operations per second.
  - `-r` or `--ratio`: Ratio of CRUD operations, like `read=70,write=20,delete=10` to simulate 70% reads, 20% writes, and 10% deletes.
  - `-d` or `--doc-size`: Average document size in bytes.
  - `-k` or `--num-keys`: The number of unique document keys to operate on.
  
- **Concurrency**:
  - `-c` or `--concurrency`: The number of parallel threads performing operations.

- **Duration**:
  - `-T` or `--time`: Duration of the test (in seconds).

#### Example Configuration:
```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default -j -t 5000 --ratio=read=70,write=20,delete=10 --doc-size=1024 --num-keys=1000000
```
In this example:
- 5000 operations/second are being targeted.
- The workload mix is 70% reads, 20% writes, and 10% deletes.
- Documents are 1 KB in size, and the test operates on 1,000,000 unique document keys.

---

### 3. **Example Workloads**

Here are some specific workload examples for different types of scenarios:

#### 1. **Read-Heavy Workload**:
This configuration mimics an environment where the majority of operations are read operations (e.g., a cache-like scenario).
```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default -t 2000 --ratio=read=90,write=5,delete=5 --doc-size=512 --num-keys=1000000
```
- 90% reads, 5% writes, 5% deletes.
- Smaller document sizes (512 bytes) to simulate caching systems.

#### 2. **Write-Heavy Workload**:
This setup simulates environments where the system handles more writes than reads (e.g., logging, data ingestion).
```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default -t 1000 --ratio=write=80,read=15,delete=5 --doc-size=4096 --num-keys=500000
```
- 80% writes, 15% reads, 5% deletes.
- Larger document sizes (4 KB) with fewer keys to simulate a logging workload.

#### 3. **Balanced Workload**:
A balanced workload with an even distribution of reads, writes, and updates.
```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default -t 1500 --ratio=read=33,write=33,delete=33 --doc-size=2048 --num-keys=750000
```
- 33% reads, 33% writes, 33% deletes.
- Document size: 2 KB with 750,000 unique keys.

---

### 4. **Analyzing Results**

When `workloadgen` finishes running, it generates various metrics and output that help you analyze how well Couchbase performed under the load.

#### Common Metrics:
- **Operations per second (throughput)**: The number of completed operations per second.
- **Latency**: The response time for each operation. Lower latencies indicate faster responses.
  - Latency is often shown as percentiles (e.g., 50th, 95th, 99th) to give an idea of the distribution.
- **Failures**: Any operations that failed to complete, often due to resource limits or Couchbase being overloaded.
- **Memory and CPU usage**: It’s useful to monitor system-level performance using external tools (e.g., `top`, `htop`, or Couchbase’s built-in monitoring).

#### Sample Output:
```json
{
  "ops_per_sec": 2000,
  "read_latency_ms": {
    "50th": 2,
    "95th": 5,
    "99th": 10
  },
  "write_latency_ms": {
    "50th": 5,
    "95th": 10,
    "99th": 20
  },
  "failures": 0
}
```

In this example:
- The system handled 2000 ops/sec with no failures.
- Read latencies are low (99th percentile at 10 ms).
- Write latencies are slightly higher, but still under 20 ms for the 99th percentile.

This kind of result helps in fine-tuning the system, whether through scaling resources or rebalancing workloads.

---

### 5. **Advanced Use Cases**

You can extend `workloadgen` to test more advanced scenarios.

#### 1. **Multi-Node Couchbase Cluster Testing**:
If you have a multi-node Couchbase cluster, you can test how the system behaves when operations are distributed across multiple nodes. Specify the IP addresses of different cluster nodes:
```bash
cbworkloadgen -n 192.168.0.101:8091,192.168.0.102:8091 -u Administrator -p password -b default -t 5000
```

#### 2. **Durability Requirements**:
Simulate how Couchbase handles workloads with stronger consistency guarantees. For example, testing write durability (replicating to multiple nodes before acknowledging a write):
```bash
cbworkloadgen -n localhost:8091 -u Administrator -p password -b default --durability=majority --ratio=write=80,read=20 --t 1000
```

#### 3. **Testing Couchbase Failover**:
You can simulate how the cluster behaves during node failures by running `workloadgen` while manually failing over a node (either through Couchbase UI or CLI). This helps assess the cluster's resilience and how it handles rebalancing operations under load.

#### 4. **Geographically Distributed Testing**:
In a global deployment, you may want to see how Couchbase performs with requests from multiple regions. You can run `workloadgen` from different locations to see how network latency impacts performance.

---

### Summary

The `workloadgen` tool is a powerful utility to simulate, benchmark, and analyze the performance of Couchbase clusters. By understanding key configuration parameters, running appropriate workloads, and interpreting the results, you can optimize your Couchbase deployment for your specific needs.
