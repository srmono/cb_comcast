Couchbase provides a powerful query language called N1QL (Non-first Normal Form Query Language) that supports a variety of **joins**, similar to SQL joins, for querying data from multiple buckets or documents. These joins allow you to combine documents based on relationships, even if they reside in separate Couchbase buckets.

Here's a detailed overview of the different types of joins Couchbase supports:

---

### **1. INNER JOIN**

An **INNER JOIN** returns only the documents that have matching values in both the left-hand side (LHS) and right-hand side (RHS) of the join condition. If no match is found, the document is excluded from the result.

#### **Syntax**:
```sql
SELECT ...
FROM bucket1 AS b1
INNER JOIN bucket2 AS b2 ON b1.key = b2.key;
```

#### **Example**:
Let's say we have two buckets, `customers` and `orders`.

**`customers` bucket**:
```json
{
  "id": "customer1",
  "name": "John Doe"
}
```

**`orders` bucket**:
```json
{
  "order_id": "order1",
  "customer_id": "customer1",
  "total": 100
}
```

**INNER JOIN query**:
```sql
SELECT c.name, o.order_id, o.total
FROM customers AS c
INNER JOIN orders AS o ON c.id = o.customer_id;
```

- **Result**:
  ```json
  [
    {
      "name": "John Doe",
      "order_id": "order1",
      "total": 100
    }
  ]
  ```
- **Explanation**: The query retrieves customers who have placed orders by matching `customers.id` with `orders.customer_id`.

---

### **2. LEFT OUTER JOIN**

A **LEFT OUTER JOIN** returns all documents from the left-hand side (LHS), and the matching documents from the right-hand side (RHS). If there is no match on the right-hand side, Couchbase returns `NULL` for the RHS.

#### **Syntax**:
```sql
SELECT ...
FROM bucket1 AS b1
LEFT OUTER JOIN bucket2 AS b2 ON b1.key = b2.key;
```

#### **Example**:
In addition to the data from the previous example, assume we have a customer without any orders:

**`customers` bucket**:
```json
{
  "id": "customer2",
  "name": "Jane Smith"
}
```

**LEFT OUTER JOIN query**:
```sql
SELECT c.name, o.order_id, o.total
FROM customers AS c
LEFT OUTER JOIN orders AS o ON c.id = o.customer_id;
```

- **Result**:
  ```json
  [
    {
      "name": "John Doe",
      "order_id": "order1",
      "total": 100
    },
    {
      "name": "Jane Smith",
      "order_id": null,
      "total": null
    }
  ]
  ```
- **Explanation**: The result includes all customers. For `Jane Smith`, who doesn't have any orders, `NULL` is returned for the `order_id` and `total`.

---

### **3. RIGHT OUTER JOIN**

A **RIGHT OUTER JOIN** is the opposite of a LEFT OUTER JOIN. It returns all documents from the right-hand side (RHS) and the matching documents from the left-hand side (LHS). If there is no match on the left-hand side, Couchbase returns `NULL` for the LHS.

#### **Syntax**:
```sql
SELECT ...
FROM bucket1 AS b1
RIGHT OUTER JOIN bucket2 AS b2 ON b1.key = b2.key;
```

#### **Example**:
If you want to retrieve all orders, even if some are not associated with customers, you can use a **RIGHT OUTER JOIN**.

**RIGHT OUTER JOIN query**:
```sql
SELECT c.name, o.order_id, o.total
FROM customers AS c
RIGHT OUTER JOIN orders AS o ON c.id = o.customer_id;
```

- **Result**:
  ```json
  [
    {
      "name": "John Doe",
      "order_id": "order1",
      "total": 100
    }
  ]
  ```

- **Explanation**: This would return all orders, including those without matching customers (though, in this case, all orders are associated with customers).

---

### **4. NEST JOIN**

`NEST` is a special type of join in Couchbase that is used to combine documents into a **nested array**. It works like an INNER JOIN, but instead of returning the matched documents as separate rows, it **nests** the RHS document under the LHS document.

#### **Syntax**:
```sql
SELECT ...
FROM bucket1 AS b1
NEST bucket2 AS b2 ON b1.key = b2.key;
```

#### **Example**:
Let's say you want to retrieve customers and **nest** their orders under each customer.

**NEST JOIN query**:
```sql
SELECT c.name, orders
FROM customers AS c
NEST orders AS o ON c.id = o.customer_id;
```

- **Result**:
  ```json
  [
    {
      "name": "John Doe",
      "orders": [
        {
          "order_id": "order1",
          "customer_id": "customer1",
          "total": 100
        }
      ]
    }
  ]
  ```

- **Explanation**: The `orders` document is nested as an array under the matching `customers` document.

---

### **5. UNNEST JOIN**

`UNNEST` is the opposite of `NEST`. It **flattens** arrays or embedded documents into separate rows. This is useful when a document contains an array field, and you want to treat each array element as an individual row.

#### **Syntax**:
```sql
SELECT ...
FROM bucket1 AS b1
UNNEST b1.array_field AS alias;
```

#### **Example**:
Assume the `orders` document contains an array of `items`:

**`orders` bucket**:
```json
{
  "order_id": "order1",
  "customer_id": "customer1",
  "items": [
    {"product": "Laptop", "price": 1000},
    {"product": "Mouse", "price": 50}
  ]
}
```

**UNNEST JOIN query**:
```sql
SELECT o.order_id, item.product, item.price
FROM orders AS o
UNNEST o.items AS item;
```

- **Result**:
  ```json
  [
    {
      "order_id": "order1",
      "product": "Laptop",
      "price": 1000
    },
    {
      "order_id": "order1",
      "product": "Mouse",
      "price": 50
    }
  ]
  ```

- **Explanation**: Each element of the `items` array is un-nested and becomes its own row in the result.

---

### **6. SELF JOIN**

A **SELF JOIN** is when you join a bucket to itself. This is useful if you want to compare or correlate data within the same bucket.

#### **Syntax**:
```sql
SELECT ...
FROM bucket1 AS b1
INNER JOIN bucket1 AS b2 ON b1.key = b2.key;
```

#### **Example**:
Imagine you have a `users` bucket where each user can refer another user through a `referrer_id`.

**`users` bucket**:
```json
{
  "id": "user1",
  "name": "Alice",
  "referrer_id": "user2"
}
```
```json
{
  "id": "user2",
  "name": "Bob"
}
```

**SELF JOIN query**:
```sql
SELECT u1.name AS referred_user, u2.name AS referrer
FROM users AS u1
INNER JOIN users AS u2 ON u1.referrer_id = u2.id;
```

- **Result**:
  ```json
  [
    {
      "referred_user": "Alice",
      "referrer": "Bob"
    }
  ]
  ```

- **Explanation**: This query joins the `users` bucket with itself to show each user and their referrer.

---

### **7. COVERING INDEX JOIN**

When dealing with joins, performance can become a concern, especially with large datasets. Couchbase supports **covering indexes** to optimize joins by ensuring that the data needed for the query is fully covered by indexes, reducing the need for full bucket scans.

To optimize a join query, ensure that:
- The fields used in the `JOIN` condition are indexed.
- The fields being selected are part of the index (this is what makes the index "cover" the query).

#### **Example**:
```sql
CREATE INDEX idx_customer_id ON orders(customer_id);
```

This index helps speed up a join query where `orders.customer_id` is used in the join condition.

---

### **Example: Combining Multiple Joins**

You can combine different types of joins in a single query. For example, retrieving customers, their orders, and the items in each order:

```sql
SELECT c.name, o.order_id, item.product, item.price
FROM customers AS c
LEFT OUTER JOIN orders AS o ON c.id = o.customer_id
UNNEST o.items AS item;
```

- **Explanation**:
  - The `LEFT OUTER JOIN` retrieves customers and their orders, including customers with no orders.
  - The `UNNEST` flattens the `items` array from each order so that each item becomes its own row.

---

###

 **Summary of Joins**

| Join Type        | Description                                                      |
|------------------|------------------------------------------------------------------|
| **INNER JOIN**    | Returns only the matching documents from both sides.             |
| **LEFT OUTER JOIN** | Returns all documents from the LHS, with matching RHS or `NULL`. |
| **RIGHT OUTER JOIN** | Returns all documents from the RHS, with matching LHS or `NULL`. |
| **NEST JOIN**     | Combines documents into a nested array.                         |
| **UNNEST JOIN**   | Flattens arrays or embedded documents into individual rows.      |
| **SELF JOIN**     | Joins a bucket to itself.                                       |
| **COVERING INDEX JOIN** | Optimizes joins using indexes to improve query performance. |

Each join type provides a unique way of combining documents from multiple buckets or documents in Couchbase. They give you the flexibility to handle complex data relationships and retrieve the data efficiently.