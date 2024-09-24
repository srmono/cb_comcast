Handling ambiguous results, ensuring data writes, avoiding duplicates, and managing failures when writing large numbers of records (like 100k) to Couchbase involves using several best practices and features of Couchbase SDKs. Below is a structured approach to managing these scenarios effectively.

### 1. **Handling Ambiguous Results in Couchbase**

When writing data to Couchbase, the system may occasionally return an "ambiguous" response, especially if network interruptions or timeouts occur. Ambiguous results indicate that Couchbase is unsure if the write succeeded. Here's how to handle it:

- **Check Write Status**: When you receive an ambiguous response, you can perform a lookup by document key to verify if the write was successful or not. This could be a `GET` operation that ensures the document exists and is updated correctly.

- **Use Durability Options**: Couchbase provides **durability guarantees** to ensure the data is written persistently and consistently. By using `durabilityLevel` options like:
  - `MAJORITY`: Ensure the write is persisted to a majority of nodes.
  - `PERSIST_TO_MAJORITY`: Ensure the write is persisted to disk in the majority of nodes.
  
  These settings can reduce ambiguity but might introduce a bit more latency.

- **Retry Logic**: Implement retries for ambiguous results using exponential backoff to avoid overwhelming the system with repeated requests.

### 2. **Ensuring All Data Writes and Avoiding Duplicates**

When writing a large batch of records (like 100k), you need to ensure data consistency without duplicating documents. The following techniques can help:

- **Use Upsert Operations**:
  - `upsert`: This operation either creates a new document or updates an existing one. If a document with the same key exists, it will be overwritten, avoiding duplicates.
  
  ```java
  collection.upsert("docKey", myDocument);
  ```

- **Use `INSERT` with Error Handling for Duplicates**:
  - If you specifically want to ensure no duplicates and only want to insert new documents, use the `INSERT` operation, which fails if the document key already exists. You can catch the exception (`DocumentExistsException`) and log it as a duplicate.

  ```java
  try {
      collection.insert("docKey", myDocument);
  } catch (DocumentExistsException e) {
      // Handle duplicate record case
  }
  ```

- **CAS (Check and Set)**: Use Couchbase's CAS (Compare and Swap) for optimistic concurrency control. It helps prevent multiple writes to the same document from different processes.

  ```java
  collection.replace("docKey", myDocument, ReplaceOptions.cas(casValue));
  ```

### 3. **Handling Failures Midway (Partial Inserts)**

If the process of inserting 100k records fails midway, Couchbase has no built-in "transaction resume" feature, but you can implement strategies to handle partial success:

- **Track Successful Writes**: 
  - Keep track of the document keys that were successfully inserted in an external log or metadata store (e.g., another Couchbase bucket or a file).
  - Use Couchbase’s asynchronous API to track write results and keep a list of successfully inserted document keys.

  ```java
  List<String> successfulInserts = new ArrayList<>();
  for (String docKey : documents) {
      try {
          collection.insert(docKey, myDocument);
          successfulInserts.add(docKey);
      } catch (Exception e) {
          // Handle failure and log
      }
  }
  ```

- **Use Pagination or Batching**: 
  - Break the 100k write operation into smaller chunks (batches) and keep track of each batch’s success. If one batch fails, you only need to retry that specific batch.

### 4. **Restart Process and Avoid Duplicates After Failure**

If the process fails and you need to restart, follow these steps to avoid duplicates:

- **Check for Existing Documents**: Before restarting, check for which documents are already inserted. This can be done using Couchbase’s `GET` operation or `exists()` method to verify document existence.

  ```java
  if (!collection.exists("docKey")) {
      collection.insert("docKey", myDocument);
  }
  ```

- **Idempotent Writes with Upserts**: 
  - Use `upsert()` for idempotency. If the document already exists, `upsert` will update it, ensuring that you’re not creating duplicates.

- **Transaction Control**: 
  - If more advanced consistency is required, Couchbase offers **transactions** that can help maintain atomicity for groups of writes. Couchbase transactions allow you to ensure either all or none of the writes succeed, and if a transaction fails, you can safely retry.

  ```java
  cluster.transactions().run((ctx) -> {
      ctx.insert(collection, "docKey", myDocument);
      ctx.commit();
  });
  ```

- **Track Failed Records and Retry**: Log all failed inserts and retry them after resolving the underlying issue. For each retry, use a mechanism to check if the document was already inserted to avoid duplicates.

### 5. **Ignore Already Inserted Documents and Insert New Ones**

To handle this efficiently:

- **Use Bulk `exists()` Check**:
  - If you have a large batch of keys to insert, and you want to insert only new documents, perform a bulk existence check and insert only those that don’t exist.

- **Query-Based Existence Check**:
  - Use N1QL queries to identify documents that are missing in the dataset.
  
  ```sql
  SELECT RAW META().id FROM `bucket-name` WHERE META().id IN ["docKey1", "docKey2", ...] AND SOME CONDITION
  ```

By following this approach, you ensure that only missing documents are inserted while avoiding duplication.

---

### Summary

1. **Ambiguous Results**: Use durability guarantees, retries, and check existing documents.
2. **Ensure Data Writes**: Use `upsert` for idempotent writes or `insert` with proper error handling to avoid duplicates.
3. **Failure Handling**: Use batching, track progress, and retry only failed records.
4. **Restart Process**: Check for already inserted documents before retrying or use upserts.
5. **Avoid Duplicates**: Use the `exists()` check before insert or use idempotent operations like `upsert`.

These strategies will help ensure consistent, reliable data writing in Couchbase, even in the face of failure or ambiguous outcomes.