`cbimport` is a command-line utility in Couchbase used for importing data into a bucket from different file formats like JSON, CSV, or TSV. It supports flexible configurations to control how the data is imported.

Here’s a detailed breakdown of the common parameters you can use with `cbimport`:

---

### **Basic Syntax of `cbimport`**

```bash
cbimport <format> -c <cluster-connection-string> -u <username> -p <password> -b <bucket> -d <data-source> [options]
```

- `<format>`: The format of the file to import (`json`, `csv`, or `tsv`).
- `-c`: Couchbase cluster connection string (e.g., `couchbase://localhost`).
- `-u`: Username (e.g., `Administrator`).
- `-p`: Password for the Couchbase account.
- `-b`: The bucket where the data should be imported.
- `-d`: The path to the data source (local file or remote URL).

---

### **Common Parameters**

1. **Cluster Connection Parameters**:
   - `-c, --cluster <string>`: The connection string for the Couchbase cluster.
     - Example: `couchbase://localhost` for a single node or `couchbase://node1,node2,node3` for multiple nodes.
   
   - `-u, --username <string>`: The username for accessing the Couchbase cluster.
     - Example: `Administrator`.

   - `-p, --password <string>`: The password for accessing the Couchbase cluster.
     - Example: `password123`.

   - `-b, --bucket <string>`: The bucket to import data into.
     - Example: `mybucket`.

   - `--scope <string>`: Specify the scope within the bucket for the import (Couchbase 7.0+).
     - Example: `--scope myspecialscope`.

   - `--collection <string>`: Specify the collection within the scope to import data into (Couchbase 7.0+).
     - Example: `--collection mycollection`.

---

2. **Data Source Parameters**:
   - `-d, --dataset <path>`: The path or URL to the data file. This is mandatory and points to the location of the data file you are importing.
     - Example: `file://path/to/data.json`.

   - `-f, --format <format>`: The file format for the data source. Supported formats are `list` and `lines` for JSON, and `csv` or `tsv` for CSV/TSV files.
     - Example: `--format list` for JSON files in a list format or `--format csv` for a CSV file.
   
   - `-g, --generate-key <pattern>`: A pattern to generate document keys for the import. This is important for identifying unique documents.
     - Example: `-g %id%` uses a field `id` from each document to generate the document key.

---

3. **Document Management Parameters**:
   - `--mode <mode>`: Specifies the operation mode for the import. Options are:
     - `insert` (default): Insert new documents only. Fails if the document already exists.
     - `upsert`: Update if the document exists, insert if it doesn’t.
     - `replace`: Replace documents if they exist. Fails if they don’t exist.
     - `delete`: Deletes the documents based on the keys provided in the dataset.
     - Example: `--mode upsert` ensures documents are updated if they already exist, otherwise they will be inserted.

   - `--threads <num>`: The number of threads to use for the import operation. Higher thread counts can speed up imports, but will use more resources.
     - Example: `--threads 8` to use 8 threads during the import process.

   - `--doc-size <size>`: Specifies the average document size (in bytes). This is mainly used for performance reporting.
     - Example: `--doc-size 1024` for a document size of 1 KB.

   - `--skip-doc-errors`: Skips documents that cause errors during the import (useful for ignoring problematic records).
     - Example: `--skip-doc-errors` will ignore documents with errors and continue importing the others.

   - `--dry-run`: Validates the dataset and the connection without performing the actual import. Useful for testing the command.
     - Example: `--dry-run` will only simulate the import process.

---

4. **Progress and Logging Parameters**:
   - `--log-level <level>`: Sets the log level for the import process. Options are `fatal`, `error`, `warn`, `info`, `debug`, or `trace`.
     - Example: `--log-level debug` for detailed logging during import.

   - `--log-file <path>`: Specifies a file to log the results of the import operation.
     - Example: `--log-file /path/to/log.txt`.

   - `--reporting-interval <seconds>`: Specifies the interval in seconds at which progress reports are shown.
     - Example: `--reporting-interval 5` for progress updates every 5 seconds.

   - `--timeout <seconds>`: Specifies the timeout in seconds for each operation.
     - Example: `--timeout 60` for a 60-second timeout.

---

5. **CSV/TSV Specific Parameters**:
   - `--infer-types`: Automatically detects and converts column types when importing CSV or TSV files.
     - Example: Use `--infer-types` to ensure that integer and float columns in CSV are converted correctly.
   
   - `--header`: Specifies that the first row of the CSV/TSV file should be treated as column headers.
     - Example: `--header` ensures that the first row is treated as column names.
   
   - `--max-errors <num>`: Defines the maximum number of errors allowed before aborting the import.
     - Example: `--max-errors 10` will stop the import if more than 10 errors are encountered.

---

6. **Error Handling Parameters**:
   - `--continue-on-error`: Continue the import even if errors are encountered.
     - Example: `--continue-on-error` will ensure the import continues even if some documents cause errors.
   
   - `--verbose`: Provides additional details about each document that was imported or failed.
     - Example: `--verbose` helps to debug import issues by providing more information.

   - `--output-file <path>`: Specifies a file where error details will be logged for later review.
     - Example: `--output-file /path/to/errors.txt` will log all errors during import.

---

### **Examples of Using `cbimport`**

1. **JSON List Import (with key generation)**:
   Import a JSON file containing a list of documents where each document has an `id` field used as the key.

   ```bash
   cbimport json -c couchbase://localhost -u Administrator -p password \
   -b mybucket -d file://path/to/data.json -f list -g %id%
   ```

2. **CSV Import with Upsert Mode**:
   Import data from a CSV file into Couchbase, using the first column as the document key and updating existing documents (`upsert`).

   ```bash
   cbimport csv -c couchbase://localhost -u Administrator -p password \
   -b mybucket -d file://path/to/data.csv -g %0% --header --mode upsert
   ```

3. **Import with Multiple Threads**:
   Import a JSON file with 8 threads to speed up the import process.

   ```bash
   cbimport json -c couchbase://localhost -u Administrator -p password \
   -b mybucket -d file://path/to/data.json -f list -g %id% --threads 8
   ```

4. **Import with Error Logging**:
   Import a JSON file, logging all errors to an external file.

   ```bash
   cbimport json -c couchbase://localhost -u Administrator -p password \
   -b mybucket -d file://path/to/data.json -f list -g %id% --log-level debug \
   --output-file /path/to/error_log.txt
   ```

5. **Dry Run to Test Import**:
   Perform a dry run to test the import without actually inserting data into the bucket.

   ```bash
   cbimport json -c couchbase://localhost -u Administrator -p password \
   -b mybucket -d file://path/to/data.json -f list -g %id% --dry-run
   ```

---

### **Summary**

- **`cbimport`** supports **JSON**, **CSV**, and **TSV** imports with various options to control document keys, import modes (`insert`, `upsert`, `replace`), and error handling.
- You can tune the performance of your import by adjusting **thread counts**, **concurrency**, and **timeouts**.
- Always use the **`--mode upsert`** or **`replace`** for resuming interrupted imports to prevent duplicates or conflicts.
- Use **error handling flags** (`--skip-doc-errors`, `--continue-on-error`, etc.) and **logging options** to deal with issues during large imports.
