In Couchbase N1QL, **`NEST`** and **`UNNEST`** are advanced join operations designed for working with **nested arrays** and **embedded documents**. They help you access, filter, and work with arrays or objects embedded within documents.

### **1. `NEST`**

`NEST` is used to perform a **join** where one document contains another document, effectively creating a parent-child relationship between documents based on keys. It combines the data from two documents and **embeds the right-hand document as an array** in the resulting document.

This operation is typically used to create a nested structure where the matching documents from the right-hand side (RHS) of the `JOIN` are nested under the corresponding document from the left-hand side (LHS).

#### **Syntax**:
```sql
SELECT ... FROM bucket1 NEST bucket2 ON bucket1.key = bucket2.key
```

#### **Example**:
Assume you have two documents:

**`bucket1` (customers)**:
```json
{
  "id": "customer1",
  "name": "John Doe"
}
```

**`bucket2` (orders)**:
```json
{
  "customer_id": "customer1",
  "order_id": "order1",
  "total": 100
}
```

#### NEST Query:
```sql
SELECT customer.*, orders
FROM customers NEST orders ON customer.id = orders.customer_id;
```

- **Result**: This query nests all matching `orders` documents under each `customers` document. The result will look like this:
  ```json
  {
    "id": "customer1",
    "name": "John Doe",
    "orders": [
      {
        "customer_id": "customer1",
        "order_id": "order1",
        "total": 100
      }
    ]
  }
  ```

In this case, `orders` is nested as an array within the corresponding `customers` document.

#### **Use Case**:
`NEST` is useful when you want to return the main document with its associated child documents nested inside, such as retrieving a customer and embedding all their associated orders.

---

### **2. `UNNEST`**

`UNNEST` is used to **flatten nested arrays** or **embedded objects** within a document so that each array element or object becomes its own individual row in the result set. It essentially **splits** the array into multiple rows.

#### **Syntax**:
```sql
SELECT ... FROM bucket UNNEST bucket.array_field AS alias
```

#### **Example**:
Assume you have a document in the `products` bucket with a nested array of `reviews`:

```json
{
  "id": "product1",
  "name": "Laptop",
  "reviews": [
    {"reviewer": "Alice", "rating": 5},
    {"reviewer": "Bob", "rating": 4}
  ]
}
```

#### UNNEST Query:
```sql
SELECT product.name, review.reviewer, review.rating
FROM products AS product
UNNEST product.reviews AS review;
```

- **Result**: This query flattens the `reviews` array so that each review becomes its own row:
  ```json
  [
    {
      "name": "Laptop",
      "reviewer": "Alice",
      "rating": 5
    },
    {
      "name": "Laptop",
      "reviewer": "Bob",
      "rating": 4
    }
  ]
  ```

In this case, the `reviews` array is unnested, and each review becomes a separate row in the result set.

#### **Use Case**:
`UNNEST` is useful when you want to work with each element of an array individually, for example, when filtering based on values within the array, aggregating values, or returning individual items from the array as separate rows.

---

### **NEST vs. UNNEST**: Key Differences

| Feature   | `NEST`                          | `UNNEST`                          |
|-----------|----------------------------------|------------------------------------|
| Operation | Combines child documents from another bucket, embedding them as arrays in the parent document | Flattens arrays or objects within a document, creating individual rows for each array element |
| Use Case  | Used when you want to return documents with nested relationships | Used when you want to treat each array element or embedded object as a separate row |
| Result    | A parent document with nested child documents as arrays | Individual rows for each array element or embedded object |

---

### **Example with Both `NEST` and `UNNEST`**

Suppose we have two buckets: `users` and `orders`. The `orders` bucket contains an array of `items`.

**`users` bucket**:
```json
{
  "user_id": "user1",
  "name": "Jane Doe"
}
```

**`orders` bucket**:
```json
{
  "order_id": "order1",
  "user_id": "user1",
  "items": [
    {"product": "Laptop", "price": 1000},
    {"product": "Mouse", "price": 50}
  ]
}
```

#### Combined Query Example:
```sql
SELECT user.name, order.order_id, item.product, item.price
FROM users AS user
NEST orders AS order ON user.user_id = order.user_id
UNNEST order.items AS item
WHERE item.price > 50;
```

- **Result**:
  ```json
  [
    {
      "name": "Jane Doe",
      "order_id": "order1",
      "product": "Laptop",
      "price": 1000
    }
  ]
  ```
  - This query:
    - Uses `NEST` to join `users` and `orders` based on the `user_id`.
    - Uses `UNNEST` to flatten the `items` array in the `orders` document.
    - Filters the result to return only those items with a price greater than 50.

---

### **Advanced Example: Filtering with `UNNEST` and Array Operations**

```sql
SELECT user.name, ARRAY item FOR item IN order.items WHEN item.price > 50 END AS expensive_items
FROM users AS user
NEST orders AS order ON user.user_id = order.user_id
WHERE ARRAY_LENGTH(ARRAY item FOR item IN order.items WHEN item.price > 50 END) > 0;
```

- **Explanation**:
  - This query:
    - Uses `NEST` to join `users` and `orders`.
    - Filters the `items` array, keeping only those where the price is greater than 50, and creates a new array called `expensive_items`.
    - The `WHERE` clause ensures that only users with expensive items (those costing more than 50) are returned.

---

### **When to Use `NEST` and `UNNEST`**
- **`NEST`**: When you have documents stored in separate buckets and want to retrieve them as nested documents. Use it to create a hierarchy or embed child documents under their parent documents.
- **`UNNEST`**: When you have nested arrays or objects inside a document and want to treat each array element or object as a separate row. Use it when you need to filter, transform, or analyze individual array elements.
