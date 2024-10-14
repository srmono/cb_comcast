Let's work through two examples to insert data from JSON files into **Couchbase** using the **Python SDK**. These examples will cover:

1. **Inserting the whole data into a single bucket**.
2. **Inserting the same data into multiple collections within the same bucket**.

We'll assume the JSON data is structured as an array of objects and the file format is similar to this example:

### Sample JSON Data (for both examples)
```json
[
  {
    "id": "user_123",
    "name": "Alice",
    "email": "alice@example.com",
    "age": 30
  },
  {
    "id": "user_456",
    "name": "Bob",
    "email": "bob@example.com",
    "age": 25
  }
]
```

We'll save this data into a file named `sample_data.json` and load it into Couchbase.

---

### **Example 1: Insert the Whole Data into a Single Bucket**

In this example, you’ll insert all the documents from the JSON file into the **default collection** of a Couchbase **bucket**.

#### Steps:

1. Load the data from the JSON file.
2. Insert each document into the **default collection** of the **bucket**.

Here’s the Python script for this:

```python
import json
from couchbase.cluster import Cluster, ClusterOptions
from couchbase.auth import PasswordAuthenticator
from couchbase.exceptions import DocumentExistsException

# Couchbase setup: connect to Couchbase cluster and bucket
cluster = Cluster('couchbase://localhost', ClusterOptions(PasswordAuthenticator('username', 'password')))
bucket = cluster.bucket('your-bucket-name')
collection = bucket.default_collection()  # Use the default collection

# Function to load JSON data from a file and insert into Couchbase
def insert_data_into_bucket(json_file):
    # Load data from JSON file
    with open(json_file, 'r') as f:
        data = json.load(f)

    # Insert each record into Couchbase
    for item in data:
        document_key = item['id']  # Assuming each item has a unique 'id' field
        try:
            collection.insert(document_key, item)
            print(f"Inserted document with key: {document_key}")
        except DocumentExistsException:
            print(f"Document with key {document_key} already exists, skipping.")

if __name__ == "__main__":
    insert_data_into_bucket('sample_data.json')
```

#### Breakdown:
- **Loading JSON**: The script reads the `sample_data.json` file and loads the data into the `data` variable.
- **Inserting Data**: For each item in the JSON array, the script uses the `insert` method of the default collection to insert it into the Couchbase bucket. The document key is the `id` field from the JSON.
- **Error Handling**: If the document with the same key already exists, it skips that document using `DocumentExistsException`.

---

### **Example 2: Insert the Same Data into Multiple Collections in the Same Bucket**

In this case, you might have different types of data that should go into different collections within the same Couchbase bucket. For example:
- User-related documents go into a "users" collection.
- Product-related documents go into a "products" collection.

We’ll use the same `sample_data.json` and map each document into different collections based on a condition (for simplicity, we'll assign all documents into one of two collections).

#### Steps:

1. Load the data from the JSON file.
2. Based on a condition (like `age`, `id`, or type), decide which collection each document should go into.
3. Insert the documents into their respective collections.

Here’s how you can achieve this:

```python
import json
from couchbase.cluster import Cluster, ClusterOptions
from couchbase.auth import PasswordAuthenticator
from couchbase.exceptions import DocumentExistsException

# Couchbase setup: connect to Couchbase cluster and bucket
cluster = Cluster('couchbase://localhost', ClusterOptions(PasswordAuthenticator('username', 'password')))
bucket = cluster.bucket('your-bucket-name')

# Access specific collections
users_collection = bucket.scope('my-scope').collection('users')
products_collection = bucket.scope('my-scope').collection('products')

# Function to load JSON data from a file and insert into different collections based on a condition
def insert_data_into_collections(json_file):
    # Load data from JSON file
    with open(json_file, 'r') as f:
        data = json.load(f)

    # Insert data into different collections based on condition
    for item in data:
        document_key = item['id']  # Assuming each item has a unique 'id' field

        # Condition: if 'age' is above 28, insert into 'users' collection, else into 'products'
        try:
            if item['age'] > 28:  # You can use any other condition
                users_collection.insert(document_key, item)
                print(f"Inserted document with key {document_key} into 'users' collection.")
            else:
                products_collection.insert(document_key, item)
                print(f"Inserted document with key {document_key} into 'products' collection.")
        except DocumentExistsException:
            print(f"Document with key {document_key} already exists, skipping.")

if __name__ == "__main__":
    insert_data_into_collections('sample_data.json')
```

#### Breakdown:
- **Multiple Collections**: This script accesses two different collections (`users` and `products`) within the same bucket and inserts the documents accordingly.
  - The `bucket.scope('my-scope').collection('users')` and `bucket.scope('my-scope').collection('products')` access different collections under the same bucket.
- **Condition-based Insertion**: We’re using a simple condition: if the `age` field is greater than 28, the document goes into the `users` collection; otherwise, it goes into the `products` collection.
- **Error Handling**: Similar to Example 1, the script handles cases where documents with the same key already exist.

---

### Adjustments Based on Your Data and Collections:
1. **Custom Document Key**: Adjust the `document_key` based on your document structure in the JSON (e.g., use `email`, `id`, or some other unique identifier).
2. **Collections Logic**: The condition for deciding which collection to insert into can be as simple or complex as needed. For example, you could insert based on different types of data (e.g., users, products, orders), or any other field that is appropriate.

### Conclusion:
- **Inserting into a Single Bucket**: Use the `default_collection()` to insert all documents directly into the bucket without creating multiple collections.
- **Inserting into Multiple Collections**: Access different collections using `bucket.scope('your-scope').collection('your-collection')` and insert data based on your defined logic.

This setup gives you the flexibility to handle both small and large-scale JSON data insertion into Couchbase.