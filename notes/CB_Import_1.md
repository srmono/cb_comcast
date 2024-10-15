In Couchbase, using `cbimport` is indeed one of the most efficient ways to import data. However, for large-scale imports or scenarios where failures might occur during the import process, it’s important to plan for reliability and recovery. I will address both your queries below:

### **Best Ways to Import Data into Couchbase**

1. **cbimport** (recommended for bulk imports):
   - `cbimport` is typically used for importing large datasets (JSON, CSV, or TSV formats).
   - It can handle huge amounts of data and is flexible in terms of data format and schema.
   - Example:
     ```bash
     cbimport json -c couchbase://localhost -u Administrator -p password \
     -b mybucket -d file://path/to/file.json -f list -g %id%
     ```
   - `cbimport` can also handle various file formats (`JSON`, `CSV`, `TSV`) and supports options like setting document key patterns (`-g` flag), creating collections during the import, and more.

2. **Couchbase SDKs** (for programmatic data insertion):
   - SDKs (Java, Python, Go, Node.js, etc.) allow more control over the import process and error handling.
   - SDKs provide the ability to handle retries, logging, and transaction-like operations if needed.
   - This approach is preferred when inserting data as part of application logic.

3. **N1QL Queries** (via REST or SDKs):
   - N1QL can also be used for inserting or upserting data into Couchbase if the data is already in Couchbase (for example, from one bucket to another).
   - It’s not optimal for large-scale imports but can be useful for data migration within Couchbase or incremental updates.

4. **Couchbase Kafka or Spark Connectors**:
   - For streaming or incremental data ingestion, connectors like **Kafka** or **Apache Spark** are useful.
   - Kafka connectors allow real-time syncing of Couchbase with other systems.

5. **Manual JSON Import through Admin UI**:
   - For small datasets, you can also import directly through the Couchbase Web UI. This is useful for testing but not recommended for large imports.

---

### **Handling Failures During `cbimport` and Resuming Failed Imports**

When you’re importing more than 1 lakh (100,000) documents and the import fails midway, it’s important to understand what has been inserted and how to resume without duplicating already inserted documents.

#### **Steps to Handle Partial Imports and Resume `cbimport`:**

1. **Identify Successfully Inserted Documents**:
   - Couchbase does not track which documents were imported successfully out-of-the-box with `cbimport`. However, there are strategies to handle this:
     - **Enable logging**: When running `cbimport`, you should enable detailed logging, which can help track how many documents were imported before failure.
     - **Use Document Keys**: When importing, you can ensure that each document has a unique identifier or key. This allows you to check which documents have already been inserted by querying the bucket.
     - **Use N1QL Queries**: After the failure, you can run a N1QL query to check how many documents exist in the bucket (or collection):
       ```sql
       SELECT COUNT(*) FROM mybucket;
       ```

2. **Skipping Already Inserted Documents**:
   To avoid re-importing documents, you need a mechanism to ensure that only the missing documents are imported. There are a few ways to achieve this:
   
   - **Upserts Instead of Inserts**: Use the `--mode` flag in `cbimport` to perform an upsert instead of an insert:
     ```bash
     cbimport json -c couchbase://localhost -u Administrator -p password \
     -b mybucket -d file://path/to/file.json -f list -g %id% --mode upsert
     ```
     - `--mode upsert` ensures that any document that already exists in the bucket will simply be updated (no duplicates), and only new documents will be added.

   - **Pre-check Existing Documents**: If you want to skip over already inserted documents and only insert missing ones, you can use a script or a Couchbase SDK (e.g., Python, Java) to check the document keys and insert only those that don’t already exist:
     - **Python Example**:
       ```python
       from couchbase.cluster import Cluster, ClusterOptions
       from couchbase_core.cluster import PasswordAuthenticator
       from couchbase.exceptions import DocumentExistsException

       cluster = Cluster('couchbase://localhost', ClusterOptions(PasswordAuthenticator('Administrator', 'password')))
       bucket = cluster.bucket('mybucket')
       collection = bucket.default_collection()

       documents = load_from_file('file.json')  # Load your JSON documents here
       
       for doc in documents:
           try:
               # Try to insert document if it doesn't already exist
               collection.insert(doc['id'], doc)
           except DocumentExistsException:
               # If the document already exists, skip it
               print(f"Document with id {doc['id']} already exists, skipping...")
       ```

3. **Resume the Import**:
   If `cbimport` fails midway, you can take the following steps:
   
   - **Use Offset**: If the failure occurs during a CSV or TSV import, you can use the `--start-pos` option to resume the import from a specific position in the file. This won’t work for JSON `list` format, but works for line-based formats.
     ```bash
     cbimport csv -c couchbase://localhost -u Administrator -p password \
     -b mybucket -d file://path/to/file.csv --start-pos <row-number>
     ```
   
   - **Split the Data**: If you have a JSON file with a list of documents, split the file into smaller chunks and re-import the failed part separately. You can do this using simple text processing tools like `split` in Linux or custom scripts.

4. **Use Error Logging and Retry**:
   - Run `cbimport` with the `--log-level` set to `verbose` or `debug`. This will give you detailed output of any failures and help you understand at what point the import failed.
     ```bash
     cbimport json -c couchbase://localhost -u Administrator -p password \
     -b mybucket -d file://path/to/file.json --log-level verbose
     ```
   - You can capture the logs and use them to retry or resume the process manually.

#### **Automation for Large Imports with Failures**:
- If failures during import are frequent due to network issues or system limitations, consider writing a custom import script using Couchbase SDKs (e.g., Python, Java). These allow more control over retries, error handling, and progress tracking.
- For example, you could wrap the insertion logic in a retry mechanism that handles network failures and only retries documents that haven’t been successfully imported.

#### **Summary of Approaches to Resume Partial Imports**:
1. **Upserts**: Use the `--mode upsert` option to ensure that already inserted documents are not duplicated.
2. **Logging**: Use detailed logging (`--log-level verbose`) to track failures and analyze progress.
3. **N1QL Queries**: After failure, use a N1QL query to check how many documents have been successfully inserted.
4. **Manual Resume**: Split large datasets and manually resume the import process, or write scripts to check for existing documents before inserting.
