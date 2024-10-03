In Couchbase N1QL, there are different types of joins used to combine documents from multiple collections or buckets: **ANSI Join**, **Lookup Join**, and **Index Join**. Each type has its own use case and performance considerations. Here's an explanation of each:

---

### 1. **ANSI Join**
The **ANSI Join** is Couchbase's implementation of SQL-style joins. It's the most general form of a join, following the standard SQL syntax for `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, etc. You can use ANSI Joins to join documents from different collections (or buckets) based on common fields.

**Key Characteristics**:
- **General-purpose**: It supports complex joins with multiple conditions, joining across multiple collections or even buckets.
- **Full SQL-style support**: It includes support for `INNER`, `LEFT OUTER`, `RIGHT OUTER`, and `FULL OUTER` joins.
- **Evaluation**: It evaluates the join conditions after loading the documents from both sides of the join.

**Example**:
```sql
SELECT a.name, b.orderId
FROM `users` a
JOIN `orders` b ON a.userId = b.userId;
```
This joins the `users` and `orders` collections on the common field `userId`.

**When to Use**:
- When you need SQL-style flexibility with different types of joins (`INNER`, `OUTER`, etc.).
- When joining collections on complex conditions or multiple keys.

**Performance Consideration**: ANSI joins are more general but can be less performant than other types of joins (like Index Joins) if not properly indexed.

---

### 2. **Lookup Join**
A **Lookup Join** is typically used when you are joining one collection or bucket to another in a **document lookup** scenario. It uses the primary key (or a well-defined field) to efficiently fetch documents. The lookup join is highly optimized for these scenarios and is the default join type used when performing joins via document IDs.

**Key Characteristics**:
- **Document Lookup**: It’s designed to join based on a known key (like a document ID or indexed field).
- **Efficient**: It’s optimized for performance because Couchbase uses the key to directly look up documents.

**Example**:
```sql
SELECT a.name, b.orderId
FROM `users` a
JOIN `orders` b ON KEYS a.orderId;
```
In this case, `orders` is being looked up directly by the `orderId` key from the `users` collection. The key-based lookup makes it very efficient.

**When to Use**:
- When you're joining collections based on document IDs or keys.
- When performance is important, and the join is based on well-defined key relationships.

**Performance Consideration**: Lookup Joins are faster than ANSI joins when you know the document IDs because they don't need to scan through collections—Couchbase directly retrieves the document.

---

### 3. **Index Join**
The **Index Join** leverages **indexes** for faster joins by performing a join using an indexed field on the right-hand collection or bucket. Instead of loading all documents from both collections and then applying the join, the index join uses the index to quickly locate relevant documents.

**Key Characteristics**:
- **Uses indexes**: It joins documents based on a field that is indexed, making the join more efficient.
- **Query optimization**: By utilizing indexes, Couchbase avoids scanning through all documents, which significantly improves performance.

**Example**:
```sql
SELECT a.name, b.orderId
FROM `users` a
JOIN `orders` b ON a.userId = b.userId
USING INDEX (`userId_index`);
```
Here, the join uses an index on `userId` in the `orders` collection to find matching documents, instead of scanning all documents in the `orders` collection.

**When to Use**:
- When the field you are joining on is indexed.
- When you are working with large datasets and need to improve join performance.

**Performance Consideration**: Index Joins are faster than ANSI Joins because they make use of indexes rather than performing full document scans, but they require an appropriate index to be defined.

---

### Key Differences

| **Type**       | **Purpose**                                                     | **Performance**                                                      | **When to Use**                                                |
|----------------|-----------------------------------------------------------------|----------------------------------------------------------------------|----------------------------------------------------------------|
| **ANSI Join**  | Standard SQL-style join with full support for `INNER`, `LEFT`, `RIGHT`, and `FULL OUTER` joins. | Flexible, but potentially slower without proper indexing.             | Use when you need full SQL-style join flexibility.             |
| **Lookup Join**| Optimized for joins based on document IDs (or keys).             | Highly performant as it directly retrieves documents based on keys.   | Use for key-based lookups (e.g., when joining by document IDs). |
| **Index Join** | Leverages indexes for efficient joins on indexed fields.         | More performant than ANSI Join as it utilizes indexes.                | Use when joining on an indexed field for better performance.    |

---

### Summary

- **ANSI Join**: Most flexible, supports all SQL-style joins, but can be slower unless indexed properly.
- **Lookup Join**: Fastest when joining by document keys or IDs, very efficient for primary key-based lookups.
- **Index Join**: Efficient when joining on fields that are indexed, better for performance on large datasets.

Choose the join type based on your use case and performance needs, especially focusing on indexing when working with larger datasets.