Couchbase uses a well-defined hierarchy to organize and manage data, especially in multi-tenant and distributed environments. The hierarchy includes **Data Stores**, **Namespaces**, **Keyspaces**, **Scopes**, and **Collections**. Here’s how they relate to each other in sequence and what each term means:

### 1. **Data Store**
   - At the highest level, a **Couchbase Server** itself can be considered a **Data Store**.
   - Each Couchbase instance can manage data through **Buckets**, which are the primary containers for data.
   - A **bucket** can be compared to a traditional database. It's a collection of data that resides in memory and disk.

   **Example**: If you have multiple buckets like `travel-sample`, `ecommerce`, etc., each of these buckets can be seen as a separate data store.

### 2. **Namespace**
   - **Namespace** refers to the logical grouping that represents a **cluster** of Couchbase nodes.
   - In Couchbase N1QL, the default namespace is implicitly the current Couchbase cluster, and it's often not explicitly stated.
   - However, if you have multiple Couchbase clusters, you could define them using different namespaces.

   **Example**: You could connect to different Couchbase clusters, where each cluster can be treated as a different namespace.

### 3. **Keyspace**
   - **Keyspace** is a concept that refers to a collection of data that can be queried in N1QL.
   - In Couchbase, a **keyspace** typically refers to a **bucket**, **scope**, or **collection**.
   - A keyspace is the fully-qualified name of where a document or data resides. It’s where your data "lives" and can be accessed via queries.

   **Example**: When querying Couchbase, you can reference the keyspace with the fully-qualified name: 
   ```bucket_name.scope_name.collection_name```.

### 4. **Bucket** (Part of Keyspace)
   - A **Bucket** is the primary container for storing JSON documents in Couchbase. 
   - It's the equivalent of a database in traditional RDBMS.
   - Buckets hold collections of documents and can be configured with specific resource constraints (like memory quotas, replication, and persistence).

   **Example**: A bucket might be named `travel-sample` that contains multiple scopes and collections.

### 5. **Scope** (Part of Keyspace)
   - **Scope** is a subdivision within a **bucket**. It allows logical grouping of collections, similar to a schema in relational databases.
   - Scopes are introduced to enable multi-tenancy and help organize data within a bucket.
   - A **bucket** can contain multiple **scopes**.

   **Example**: A bucket `ecommerce` may have two scopes, `inventory` and `sales`. Each scope contains collections that are specific to their context.

### 6. **Collection** (Part of Keyspace)
   - **Collection** is the lowest level in the hierarchy and is where actual documents (JSON objects) are stored.
   - Collections are used to group documents logically, similar to a table in a relational database, but designed for JSON documents in Couchbase.
   - Each **scope** can contain multiple **collections**.

   **Example**: In the `inventory` scope, you might have collections like `products`, `categories`, and `suppliers`.

### **Hierarchy in Sequence:**

Here’s how the hierarchy flows in sequence:

1. **Data Store (Couchbase Cluster)**
   - Can include multiple **Namespaces** (Clusters)
   - Each Namespace contains **Buckets**.
     - Each **Bucket** is the equivalent of a database and can contain multiple **Scopes**.
       - Each **Scope** is the equivalent of a schema and can contain multiple **Collections**.
         - Each **Collection** stores **Documents**, which are the individual pieces of data.

### Example in Practice:

Imagine you are working with an `ecommerce` bucket. This bucket could have multiple scopes for different parts of the business:

- **Bucket: `ecommerce`**
  - **Scope: `inventory`**
    - **Collection: `products`**
    - **Collection: `categories`**
  - **Scope: `sales`**
    - **Collection: `orders`**
    - **Collection: `customers`**

To fully qualify a collection in N1QL, you'd reference the keyspace like this:
```sql
SELECT * FROM `ecommerce`.`inventory`.`products` WHERE ...
```

In this example:
- **ecommerce** is the **bucket**.
- **inventory** is the **scope**.
- **products** is the **collection**.
  
You are querying the `products` collection inside the `inventory` scope of the `ecommerce` bucket.

### Summary of Terms:
- **Data Store:** Refers to the Couchbase instance, managing one or more clusters.
- **Namespace:** Refers to a Couchbase cluster or logical grouping of servers.
- **Keyspace:** A keyspace refers to where data resides; it can be a bucket, scope, or collection.
- **Bucket:** A logical database-like container where data is stored.
- **Scope:** A schema-like organization for logically grouping collections inside a bucket.
- **Collection:** A table-like structure holding documents (JSON objects) within a scope.
