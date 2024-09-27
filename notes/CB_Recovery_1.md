In Couchbase, failover is a mechanism that allows you to remove an unhealthy node from the cluster. After resolving the issue, the failed-over node can be added back to the cluster using **two types of recovery**:

1. **Full Recovery (Add Back: Full Recovery)**: This process rebroadcasts all data from the cluster to the failed node. It is typically used when the node has been offline for a long period or has lost a significant amount of data.
   
2. **Delta Recovery (Add Back: Delta Recovery)**: This process only syncs the changes (deltas) that occurred while the node was down. Delta recovery is faster and less resource-intensive, but it's only possible if the node’s data files remain mostly intact and the node has been offline for a relatively short period.

### Failover and Recovery Workflow in Couchbase

Here’s a breakdown of how **full recovery** and **delta recovery** work in Couchbase after a failover:

### 1. **Failover in Couchbase**

   - **Automatic Failover**: If a node in the cluster becomes unreachable or unresponsive, Couchbase automatically fails over the node. This requires that **auto-failover** be enabled and that the node meets certain conditions, such as being down for a certain amount of time.
   - **Manual Failover**: You can manually trigger a failover if you notice that a node is not behaving properly but hasn’t been automatically failed over.

   Once a node is failed over, it is removed from the active cluster, and replicas on other nodes are promoted to active status.

### 2. **Types of Recovery**

#### **Add Back: Full Recovery**
   - **When to use**: Full recovery should be used if the node has been down for a long time, has lost a significant amount of data, or you are unsure if the node is in a consistent state. This will ensure that the entire dataset is rebalanced back onto the node from the rest of the cluster.
   
   - **How it works**:
     1. The failed node is added back to the cluster.
     2. **All data** (both active and replica) is copied back to the failed node from other nodes in the cluster.
     3. The process might take longer depending on the size of the dataset.

   - **Performance Impact**: Full recovery is resource-intensive as it rebalances the entire dataset onto the failed node. This is slower and consumes more network and CPU resources compared to delta recovery.

#### **Add Back: Delta Recovery**
   - **When to use**: Delta recovery is faster and should be used if the node was down for only a short period and its data files remain mostly intact. The changes that happened during the downtime are synchronized with the rest of the cluster, minimizing the amount of data that needs to be transferred.
   
   - **How it works**:
     1. The failed node is added back to the cluster.
     2. Only **the changes** (deltas) that occurred during the node’s downtime are synchronized back onto the node.
     3. The node rejoins the cluster more quickly than with full recovery.

   - **Performance Impact**: Delta recovery is less resource-intensive and faster because it only transfers the changed data. This is preferred when minimizing downtime and performance impact is critical.

### 3. **How to Perform Recovery in Couchbase**

   Recovery after failover can be initiated through the **Couchbase Web UI** or via the **Couchbase CLI**.

#### **Using Couchbase Web Console for Recovery**:
1. **Login** to the Couchbase Web Console.
2. Go to **Servers** → You'll see the failed-over node listed.
3. Click the node, and you’ll see the option to **Add Back** the node.
4. You will be presented with two options:
   - **Full Recovery**: This will copy all data from other nodes in the cluster to the failed node.
   - **Delta Recovery**: This will only synchronize the changes that happened while the node was down.

5. Select the appropriate recovery type and proceed.

#### **Using Couchbase CLI for Recovery**:
You can also perform the recovery using the **Couchbase CLI**:

1. To **list the servers**, including the failed-over nodes:
   ```bash
   couchbase-cli server-list -c <cluster-ip>:8091 \
       --username <admin> --password <password>
   ```

2. To **add the failed-over node back** with **full recovery**:
   ```bash
   couchbase-cli recovery -c <cluster-ip>:8091 \
       --username <admin> --password <password> \
       --server-recovery-full <node-ip>
   ```

3. To **add the failed-over node back** with **delta recovery**:
   ```bash
   couchbase-cli recovery -c <cluster-ip>:8091 \
       --username <admin> --password <password> \
       --server-recovery-delta <node-ip>
   ```

4. After the node is added back, **rebalance the cluster**:
   ```bash
   couchbase-cli rebalance -c <cluster-ip>:8091 \
       --username <admin> --password <password>
   ```

### 4. **Considerations and Best Practices**

- **Choose Delta Recovery When Possible**: Delta recovery is quicker and uses fewer resources, so use it if the failed node is intact and the downtime was minimal.
  
- **Plan for Full Recovery if Node Data is Corrupted**: If the node experienced significant data corruption or extended downtime, a full recovery ensures all data is fully synchronized but takes longer.

- **Monitoring the Recovery Process**: During the recovery process, you can monitor the node and cluster health in the **Couchbase Web Console** under the **Servers** and **Tasks** sections.

- **Rebalance After Recovery**: After any recovery process, it's crucial to rebalance the cluster to ensure even distribution of data across all nodes.

### Summary

- **Full Recovery**: Re-syncs **all data** to the failed-over node. It's slower but ensures the node has a complete dataset.
- **Delta Recovery**: Only re-syncs the **changes** (deltas) since the node went down, making it faster and less resource-intensive.

Choose **full recovery** for prolonged outages or potential data corruption, and choose **delta recovery** for short outages with intact data.