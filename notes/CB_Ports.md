Couchbase uses a variety of ports for its internal services, depending on the type of service and communication being performed. Here is a detailed breakdown of the key ports Couchbase uses and what each port does, along with how they are typically mapped. These can be exposed or mapped differently, but they serve distinct purposes in Couchbase clusters:

### **Common Couchbase Ports and Their Functions:**

| **Port**   | **Service**                               | **Description**                                                                                                           |
|------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| **8091**   | **Admin Web UI (HTTP)**                   | The main Couchbase Admin Web UI and cluster management over HTTP (unsecured).                                              |
| **8092**   | **Views (Indexing & Querying)**           | Used for querying Views (MapReduce) and indexing data.                                                                    |
| **8093**   | **Query Service (N1QL Query)**            | Handles N1QL query service for querying the database.                                                                     |
| **8094**   | **Search Service (FTS)**                  | Full-text search (FTS) service port for Couchbase Search.                                                                 |
| **8095**   | **Analytics Service**                    | Couchbase Analytics service port.                                                                                         |
| **8096**   | **Eventing Service**                     | Eventing service for real-time event processing.                                                                          |
| **11207**  | **Smart Client (Memcached Binary Protocol)** | Port used by Couchbase SDKs for data communication with the cluster (using the memcached binary protocol).                |
| **11210**  | **Data Operations (KV service)**          | Used for key-value (KV) data operations with Couchbase.                                                                   |
| **11211**  | **Memcached compatibility**               | Memcached compatibility port, typically for legacy applications.                                                          |
| **18091**  | **Admin Web UI (HTTPS)**                  | Secured Couchbase Admin Web UI over HTTPS (TLS).                                                                          |
| **18092**  | **Views (Indexing & Querying - HTTPS)**   | Secured port for Views (MapReduce) over HTTPS.                                                                            |
| **18093**  | **Query Service (N1QL Query - HTTPS)**    | Secured N1QL query service over HTTPS.                                                                                    |
| **18094**  | **Search Service (FTS - HTTPS)**          | Secured full-text search service port over HTTPS.                                                                         |
| **18095**  | **Analytics Service (HTTPS)**             | Secured Analytics service over HTTPS.                                                                                     |
| **18096**  | **Eventing Service (HTTPS)**              | Secured Eventing service over HTTPS.                                                                                      |
| **4369**   | **Erlang Port Mapper Daemon (epmd)**       | Required for node-to-node communication (internode communication).                                                        |
| **4984**   | **Sync Gateway HTTP API**                 | Sync Gateway HTTP REST API for Couchbase Mobile (used in distributed mobile synchronization).                             |
| **4985**   | **Sync Gateway Admin API**                | Admin API for Sync Gateway (Couchbase Mobile).                                                                            |
| **9100-9105** | **Inter-node Communication (gRPC)**     | Ports used for inter-node communication using the gRPC protocol. This is crucial for the Couchbase cluster to synchronize nodes. |
| **9999**   | **REST API (for XDCR)**                   | Used for XDCR (Cross Data Center Replication) REST APIs to replicate data between Couchbase clusters.                      |
| **21100-21299** | **Backup and Restore**               | Ports used for Couchbase backup and restore operations in distributed environments.                                        |

---

### **Breakdown of the Ports by Service Type:**

1. **Administrative Ports:**
   - **8091 (HTTP)** and **18091 (HTTPS)**: Main Admin UI and REST API access to the cluster.
   - These are the ports you'll use to access the Couchbase Web UI for cluster management, as well as any manual administrative tasks via the REST API.

2. **Data Access and Queries:**
   - **8093 (N1QL Query)** and **18093 (N1QL Query over HTTPS)**: These ports are for running **N1QL queries**, Couchbase’s SQL-like query language, over HTTP or HTTPS.
   - **8092 (Views)** and **18092 (Views over HTTPS)**: Used for **Views**—the old MapReduce indexing and querying system in Couchbase, over HTTP or HTTPS.
   - **11210**: Used for **data operations**, specifically key-value (KV) operations, using the Couchbase protocol.
   - **11211**: This is the **Memcached compatibility** port, used if you want Couchbase to act like a traditional Memcached server for certain legacy applications.

3. **Analytics and Search:**
   - **8094 (Search Service - FTS)** and **18094 (HTTPS)**: Full-text search service for Couchbase queries.
   - **8095 (Analytics Service)** and **18095 (HTTPS)**: Analytics service for complex data analysis in Couchbase.
   
4. **Eventing and Replication:**
   - **8096 (Eventing Service)** and **18096 (Eventing over HTTPS)**: Eventing service to handle real-time event processing and custom triggers in Couchbase.
   - **9999**: REST API used for **XDCR (Cross Data Center Replication)**, which allows data replication across clusters.

5. **Sync Gateway (Couchbase Mobile)**:
   - **4984**: Sync Gateway HTTP API used in mobile environments for synchronizing Couchbase Lite with the server.
   - **4985**: Sync Gateway Admin API used for managing mobile synchronizations.

6. **Node-to-Node Communication:**
   - **4369 (epmd)**: Couchbase is built on Erlang, and this port is required for node-to-node communication in the cluster.
   - **9100-9105 (gRPC)**: These ports are used for inter-node communication in distributed Couchbase clusters using gRPC, ensuring nodes can share data and metadata.

7. **Backup/Restore Ports:**
   - **21100-21299**: These ports are reserved for Couchbase's **backup and restore** services. In large distributed clusters, backup and restore can use multiple ports simultaneously to transfer data.

---

### **Can You Change or Assign Custom Ports?**
Yes, Couchbase allows you to configure some of these ports during setup or through configuration files. You can map Couchbase's internal ports to any available ports on your host machine when using Docker (as you've been doing). However, the port numbers are fixed internally within Couchbase unless explicitly configured otherwise.

For example, if you're running multiple Couchbase nodes on the same machine (like with Docker), you'll often **map internal ports to custom external ports** (e.g., mapping **8091** to **7091**, **18091** to **18081**, etc.). The Couchbase services will still function the same way, but you'll need to access the node using the custom port you've mapped.

---

### **Key Points to Remember:**
- **8091** and **8092** are the most commonly used ports for Couchbase UI and querying.
- **11210** is essential for the core key-value (KV) operations, especially when using Couchbase SDKs.
- Ports **8093-8096** cover **advanced services** like **N1QL queries**, **Full-text search (FTS)**, **Analytics**, and **Eventing**.
- For **secure communications**, each major service has a corresponding **HTTPS port** (e.g., **18091** for Admin UI, **18093** for N1QL Queries, etc.).
- **Backup/Restore** and **inter-node communication** use higher-range ports, which are less frequently modified.

By understanding and correctly mapping these ports, you can ensure seamless communication between Couchbase services, nodes, and clients across different network environments, whether local, Docker-based, or distributed across data centers.