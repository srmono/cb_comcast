A complete example where we take data that was backed up from **DynamoDB**, convert it into a format suitable for **Couchbase**, and insert it into Couchbase.

We'll assume:
- The DynamoDB backup is in **JSON format** (a typical backup might look like the output of a DynamoDB `scan` operation).
- The data has some attributes that need to be adjusted to fit Couchbase's more flexible schema.

### Sample DynamoDB Backup Data (JSON)

Let's say we have the following data in a file named `dynamodb_backup.json`, representing the JSON format DynamoDB might export:

```json
[
    {
        "user_id": {"S": "user_123"},
        "name": {"S": "Alice"},
        "email": {"S": "alice@example.com"},
        "age": {"N": "30"},
        "is_active": {"BOOL": true}
    },
    {
        "user_id": {"S": "user_456"},
        "name": {"S": "Bob"},
        "email": {"S": "bob@example.com"},
        "age": {"N": "25"},
        "is_active": {"BOOL": false}
    }
]
```

This data includes the typical DynamoDB data types like `S` (string), `N` (number), and `BOOL` (boolean). For Couchbase, we want to convert it to standard JSON types (strings, integers, booleans, etc.).

---

### Plan:
1. **Load the backup JSON data**.
2. **Convert the DynamoDB-specific format** (e.g., `{"S": "value"}` to `"value"`, `{"N": "value"}` to numbers).
3. **Insert the data into Couchbase** using the **Python Couchbase SDK**.

---

### Python Script: Converting DynamoDB Data and Inserting into Couchbase

Here is a complete Python script for converting and inserting the data into Couchbase.

#### Step-by-Step Implementation

1. **Load the JSON backup from DynamoDB**.
2. **Convert** DynamoDB types to standard JSON types.
3. **Insert** the transformed data into a **Couchbase bucket**.

```python
import json
from couchbase.cluster import Cluster, ClusterOptions
from couchbase.auth import PasswordAuthenticator
from couchbase.exceptions import DocumentExistsException

# Couchbase setup: connect to Couchbase cluster and bucket
cluster = Cluster('couchbase://localhost', ClusterOptions(PasswordAuthenticator('username', 'password')))
bucket = cluster.bucket('your-bucket-name')
collection = bucket.default_collection()  # Default collection, adjust if needed

# Function to convert DynamoDB format to regular JSON (Couchbase-friendly)
def convert_dynamodb_item(dynamodb_item):
    converted_item = {}
    for key, value in dynamodb_item.items():
        if 'S' in value:  # DynamoDB string type
            converted_item[key] = value['S']
        elif 'N' in value:  # DynamoDB number type (which is in string format)
            converted_item[key] = int(value['N'])  # Convert to integer
        elif 'BOOL' in value:  # DynamoDB boolean type
            converted_item[key] = value['BOOL']
        # Add additional conversions if needed (e.g., for lists, maps, etc.)
    return converted_item

# Function to load the DynamoDB backup, convert, and insert into Couchbase
def migrate_data(json_file):
    # Load data from DynamoDB backup (JSON file)
    with open(json_file, 'r') as f:
        dynamodb_data = json.load(f)

    # Convert and insert each item into Couchbase
    for dynamodb_item in dynamodb_data:
        # Convert DynamoDB-specific format to Couchbase-friendly format
        couchbase_item = convert_dynamodb_item(dynamodb_item)
        
        # Use the 'user_id' as the document key for Couchbase
        document_key = couchbase_item['user_id']
        
        try:
            # Insert the converted item into Couchbase
            collection.insert(document_key, couchbase_item)
            print(f"Inserted document with key: {document_key}")
        except DocumentExistsException:
            print(f"Document with key {document_key} already exists, skipping.")

if __name__ == "__main__":
    # Migrate data from DynamoDB backup to Couchbase
    migrate_data('dynamodb_backup.json')
```

---

### **Explanation of the Script:**

#### 1. **Converting DynamoDB Format to JSON:**

DynamoDB uses specific types in its JSON structure, like `{"S": "string"}` for strings and `{"N": "number"}` for numbers. We use the `convert_dynamodb_item()` function to convert these DynamoDB types into regular JSON types that Couchbase accepts:
- **Strings (`S`)**: Extracted as normal strings.
- **Numbers (`N`)**: DynamoDB stores them as strings, but we convert them to actual integers or floats.
- **Booleans (`BOOL`)**: Converted to regular Python `True` or `False`.

You can expand this conversion function to handle other DynamoDB types (e.g., `L` for lists, `M` for maps) if needed.

#### 2. **Inserting Data into Couchbase:**

- **Couchbase Setup**: We initialize the Couchbase connection using the **Python SDK**. The bucket and collection are specified. If you are using multiple collections, you can modify the `collection` to point to the appropriate one.
  
- **Document Key**: In this case, we use `user_id` as the document key, but you can modify this to fit your data structure. For each document in the backup, we insert it into Couchbase with the `collection.insert()` method.

#### 3. **Error Handling:**
- If the document with the same key already exists in Couchbase, the script will skip it to avoid conflicts, using the `DocumentExistsException`.

---

### **Example Output:**

When you run the script, you will see output like this:

```
Inserted document with key: user_123
Inserted document with key: user_456
```

This confirms that the documents have been inserted into Couchbase successfully.

---

### Sample Document in Couchbase:

After the migration, each document in Couchbase might look like this:

```json
{
    "user_id": "user_123",
    "name": "Alice",
    "email": "alice@example.com",
    "age": 30,
    "is_active": true
}
```

This is a standard JSON document without the DynamoDB-specific type wrappers (`S`, `N`, etc.).

---

### Summary:

- The script reads the backup data from DynamoDB (stored in JSON format).
- It converts the DynamoDB-specific data types into standard JSON types.
- The converted data is inserted into Couchbase, where each document is stored under the appropriate key.

This approach is scalable, and you can adjust the conversion logic to handle more complex data structures (like lists and maps) if your DynamoDB data includes them.