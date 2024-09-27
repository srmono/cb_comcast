CRUD (Create, Read, Update, Delete) operations, including **upsert**, using **N1QL queries** in Couchbase:

### 1. **Create (INSERT)**

The **INSERT** statement in N1QL is used to add a new document to a Couchbase bucket. It requires a unique key for each document. If the key already exists, the operation will fail.

```sql
INSERT INTO `bucket_name` (KEY, VALUE)
VALUES ("user::123", {"name": "John", "age": 30, "email": "john@example.com"});
```

- **`bucket_name`**: Replace this with the name of your Couchbase bucket.
- **`KEY`**: The unique identifier for the document (`"user::123"`).
- **`VALUE`**: The JSON document being inserted.

If a document with the same key already exists, this operation will return an error.

---

### 2. **Read (SELECT/GET)**

You can retrieve a document by using the **SELECT** query. This reads the data from the bucket using the document’s key or other fields.

#### **Get by Key**:
```sql
SELECT META().id, name, age, email
FROM `bucket_name`
USE KEYS "user::123";
```

- **`USE KEYS`**: Specifies the document's key (e.g., `"user::123"`) for a direct lookup.
- **`META().id`**: Retrieves the document's ID along with the content.

#### **Get by Filter**:
You can also retrieve documents using a conditional query:
```sql
SELECT name, age, email
FROM `bucket_name`
WHERE age > 25;
```

- This retrieves all documents where the age is greater than 25.

---

### 3. **Update (UPDATE)**

The **UPDATE** statement modifies an existing document. You can update specific fields or the entire document.

```sql
UPDATE `bucket_name`
SET name = "John Updated", age = 31
WHERE META().id = "user::123";
```

- **`SET`**: Defines the fields to be updated (e.g., updating the `name` and `age` fields).
- **`WHERE`**: Limits the update to the document with the specific key (`"user::123"`).

If no document with the given key exists, the query won't update anything.

---

### 4. **Upsert (INSERT or UPDATE)**

The **UPSERT** statement is used to either **insert** a new document (if it doesn't exist) or **update** an existing document (if it does exist). This is useful when you want to avoid a separate check for the document's existence.

```sql
UPSERT INTO `bucket_name` (KEY, VALUE)
VALUES ("user::123", {"name": "John", "age": 30, "email": "john@example.com"});
```

- If the document with the key `"user::123"` already exists, this operation will update it.
- If the document doesn't exist, it will insert a new document.

---

### 5. **Delete (DELETE)**

The **DELETE** statement removes a document from the bucket based on its key or a condition.

#### **Delete by Key**:
```sql
DELETE FROM `bucket_name`
USE KEYS "user::123";
```

- This removes the document with the key `"user::123"`.

#### **Delete by Condition**:
You can also delete documents based on specific conditions:
```sql
DELETE FROM `bucket_name`
WHERE age < 25;
```

- This deletes all documents where the age is less than 25.

---

### Summary of N1QL CRUD Operations:

| Operation | N1QL Query Example |
|-----------|---------------------|
| **Create (INSERT)** | `INSERT INTO \`bucket_name\` (KEY, VALUE) VALUES ("user::123", {...})` |
| **Read (SELECT)** | `SELECT * FROM \`bucket_name\` USE KEYS "user::123"` |
| **Update (UPDATE)** | `UPDATE \`bucket_name\` SET name = "Updated Name" WHERE META().id = "user::123"` |
| **Upsert (UPSERT)** | `UPSERT INTO \`bucket_name\` (KEY, VALUE) VALUES ("user::123", {...})` |
| **Delete (DELETE)** | `DELETE FROM \`bucket_name\` USE KEYS "user::123"` |

Make sure to replace **`bucket_name`** with the actual name of your Couchbase bucket.