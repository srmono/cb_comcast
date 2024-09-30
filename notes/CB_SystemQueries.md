In Couchbase, **system queries** (also known as **system keyspaces**) are special queries that allow you to access metadata and information about the Couchbase cluster, buckets, indexes, users, and more. These queries are executed against **system keyspaces** that contain metadata about the Couchbase environment.

Here are the commonly used system keyspaces, along with example queries for each:

### 1. **System Keyspaces Overview**
System keyspaces provide insights into the following aspects of the Couchbase system:
- Indexes
- Buckets
- Scopes and Collections
- Users
- Active Queries
- Functions
- Datastores
- Keyspaces (which include Buckets, Scopes, and Collections)
- Eventing metadata, etc.

System keyspaces are typically prefixed with `system:` and can be queried similarly to normal buckets in Couchbase.

---

### 2. **List of System Keyspaces and Example Queries**

#### **1. `system:indexes`**
- **Description**: Shows details about all the indexes in the Couchbase cluster.
- **Query**:
  ```sql
  SELECT * FROM system:indexes;
  ```

#### **2. `system:keyspaces`**
- **Description**: Lists all keyspaces in the Couchbase cluster, including buckets, scopes, and collections.
- **Query**:
  ```sql
  SELECT * FROM system:keyspaces;
  ```

#### **3. `system:buckets`**
- **Description**: Lists all the buckets in the Couchbase cluster along with metadata like memory size, replica count, etc.
- **Query**:
  ```sql
  SELECT * FROM system:buckets;
  ```

#### **4. `system:scopes`**
- **Description**: Lists all the scopes within all the buckets.
- **Query**:
  ```sql
  SELECT * FROM system:scopes;
  ```

#### **5. `system:collections`**
- **Description**: Lists all collections within each bucket and scope.
- **Query**:
  ```sql
  SELECT * FROM system:collections;
  ```

#### **6. `system:users`**
- **Description**: Retrieves information about all users defined in the Couchbase cluster.
- **Query**:
  ```sql
  SELECT * FROM system:users;
  ```

#### **7. `system:roles`**
- **Description**: Displays the roles available in the Couchbase cluster.
- **Query**:
  ```sql
  SELECT * FROM system:roles;
  ```

#### **8. `system:namespaces`**
- **Description**: Lists all the namespaces (typically associated with buckets and clusters).
- **Query**:
  ```sql
  SELECT * FROM system:namespaces;
  ```

#### **9. `system:datastores`**
- **Description**: Shows all datastores, including available keyspaces (buckets, scopes, collections).
- **Query**:
  ```sql
  SELECT * FROM system:datastores;
  ```

#### **10. `system:completed_requests`**
- **Description**: Shows a log of completed N1QL queries in the cluster, including execution time, status, and more.
- **Query**:
  ```sql
  SELECT * FROM system:completed_requests;
  ```

#### **11. `system:active_requests`**
- **Description**: Displays information about currently running N1QL queries.
- **Query**:
  ```sql
  SELECT * FROM system:active_requests;
  ```

#### **12. `system:functions`**
- **Description**: Shows all user-defined functions (UDFs) that have been created within the cluster.
- **Query**:
  ```sql
  SELECT * FROM system:functions;
  ```

#### **13. `system:events`**
- **Description**: Displays information about the eventing service, including active eventing functions.
- **Query**:
  ```sql
  SELECT * FROM system:events;
  ```

#### **14. `system:ddl`**
- **Description**: Displays information about recent data definition language (DDL) statements executed in the system, such as `CREATE` or `DROP` index commands.
- **Query**:
  ```sql
  SELECT * FROM system:ddl;
  ```

#### **15. `system:prepareds`**
- **Description**: Displays all prepared N1QL statements (cached query plans).
- **Query**:
  ```sql
  SELECT * FROM system:prepareds;
  ```

#### **16. `system:replications`**
- **Description**: Shows information about cross-datacenter replications (XDCR) in the Couchbase cluster.
- **Query**:
  ```sql
  SELECT * FROM system:replications;
  ```

#### **17. `system:tasks`**
- **Description**: Displays all ongoing tasks, such as indexing or data rebalancing.
- **Query**:
  ```sql
  SELECT * FROM system:tasks;
  ```

---

### 3. **Practical Use Cases of System Queries**
- **Query Index Information**: To check the status, type, and progress of indexes.
  ```sql
  SELECT name, state, keyspace_id, index_key FROM system:indexes;
  ```

- **Monitor Query Activity**: To monitor and troubleshoot currently running queries in the system.
  ```sql
  SELECT * FROM system:active_requests;
  ```

- **List All Users**: To check the list of users and their associated roles in the Couchbase cluster.
  ```sql
  SELECT * FROM system:users;
  ```

- **Check Bucket Details**: To get details about all buckets in the cluster, such as their memory usage, replica count, etc.
  ```sql
  SELECT name, bucketType, memoryQuota, replicaNumber FROM system:buckets;
  ```

- **Monitor Completed Queries**: To view performance metrics of previously run queries, including their status, execution time, and duration.
  ```sql
  SELECT statement, status, elapsedTime, node FROM system:completed_requests;
  ```

### 4. **Query Optimizer Tools**
Couchbase also provides system keyspaces for query performance optimization:
- **`system:completed_requests`**: Helps you identify slow or inefficient queries.
- **`system:active_requests`**: Lets you check for long-running or stuck queries that are currently active.
- **`system:prepareds`**: Shows cached query plans to ensure that prepared statements are being used.

---

### Summary:
Couchbase’s system keyspaces provide a comprehensive way to manage and monitor the cluster, giving insights into buckets, indexes, queries, users, roles, and ongoing tasks. By using system queries, you can effectively manage system performance, monitor query activity, and handle administration tasks.

---

In Couchbase, `system:dual` is a special **keyspace** that acts as a dummy or placeholder keyspace for testing purposes. It behaves similarly to the `DUAL` table in traditional relational databases like Oracle.

### Key Features of `system:dual`:
1. **No Physical Data**: It doesn't store any actual data or documents. Instead, it's used to execute queries that don't require interaction with real data.
   
2. **Single Row and Single Column**: Internally, `system:dual` contains exactly one row and one column, but it's virtual and not backed by real data.

3. **For Testing and Expression Evaluation**: This keyspace is used in queries where you want to evaluate expressions, perform calculations, or return static values without querying a specific bucket, scope, or collection.

### Use Cases for `system:dual`:
1. **Evaluate Expressions**: You can use `system:dual` to evaluate expressions or return static values without interacting with actual data.

2. **Simple Query Testing**: Developers can use `system:dual` to test and run queries that don't require querying any specific collection.

3. **Return Constant Values**: If you want to return a constant or perform some calculations, `system:dual` is useful.

### Example 1: Return a Constant Value
```sql
SELECT 1 AS result FROM system:dual;
```
**Result:**
```json
[
  { "result": 1 }
]
```
Here, `system:dual` allows you to return the value `1` without querying any actual data.

### Example 2: Perform a Simple Calculation
```sql
SELECT 2 + 3 AS result FROM system:dual;
```
**Result:**
```json
[
  { "result": 5 }
]
```

### Why `system:dual` Exists:
In SQL-based databases, there's often a need for a table that can be used to select expressions or constants without requiring access to actual tables. The `system:dual` keyspace serves this purpose in Couchbase, making it easier to write and test queries where you're not querying real data but still want to evaluate expressions or return values.

### Practical Applications:
- **Running Queries without Data**: Useful in scripts or test cases where you want to execute queries for the purpose of logic testing, without depending on real data.
- **Constant Value Return**: Return a single value or perform calculations.
- **Evaluate Conditions**: Check or verify query logic without needing actual document queries.

In summary, `system:dual` is a utility keyspace in Couchbase that allows you to run queries without dealing with actual data, similar to how `DUAL` works in Oracle or other relational databases.