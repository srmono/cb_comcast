Couchbase N1QL provides a variety of **aggregation functions** that allow you to perform operations like counting documents, calculating sums, averages, and more. Aggregations are similar to those found in SQL and are often used with `GROUP BY` to summarize data based on specific fields. These functions can be used to generate insights from large datasets in Couchbase.

Here's a detailed look at the aggregation functions supported by Couchbase:

---

### **1. COUNT**

The **`COUNT()`** function returns the total number of documents or expressions that match a query. It can be used to count all documents, or it can be restricted to non-`NULL` values by specifying a field or expression.

#### **Syntax**:
```sql
COUNT(expression)
COUNT(*)
```

#### **Example**:
```sql
SELECT COUNT(*) AS total_customers
FROM customers;
```

- **Result**: This counts the total number of documents in the `customers` bucket.

```sql
SELECT COUNT(o.total) AS total_orders
FROM orders AS o
WHERE o.status = 'completed';
```

- **Result**: This counts the number of completed orders (where the `total` is not `NULL`).

---

### **2. SUM**

The **`SUM()`** function returns the sum of a numeric field or expression across all matching documents.

#### **Syntax**:
```sql
SUM(expression)
```

#### **Example**:
```sql
SELECT SUM(o.total) AS total_revenue
FROM orders AS o;
```

- **Result**: This sums up the `total` field from all documents in the `orders` bucket to calculate the total revenue.

---

### **3. AVG (Average)**

The **`AVG()`** function calculates the average of a numeric field or expression across all matching documents. It excludes `NULL` values from the calculation.

#### **Syntax**:
```sql
AVG(expression)
```

#### **Example**:
```sql
SELECT AVG(o.total) AS average_order_value
FROM orders AS o
WHERE o.status = 'completed';
```

- **Result**: This calculates the average value of all completed orders.

---

### **4. MIN (Minimum)**

The **`MIN()`** function returns the smallest value of a field or expression across all matching documents. It works with numeric, string, and date values.

#### **Syntax**:
```sql
MIN(expression)
```

#### **Example**:
```sql
SELECT MIN(o.total) AS smallest_order
FROM orders AS o;
```

- **Result**: This finds the smallest `total` value among all orders.

---

### **5. MAX (Maximum)**

The **`MAX()`** function returns the largest value of a field or expression across all matching documents.

#### **Syntax**:
```sql
MAX(expression)
```

#### **Example**:
```sql
SELECT MAX(o.total) AS largest_order
FROM orders AS o;
```

- **Result**: This finds the largest `total` value among all orders.

---

### **6. ARRAY_AGG (Array Aggregation)**

The **`ARRAY_AGG()`** function is used to aggregate values from multiple documents into an array. This is useful when you want to group similar values together or return a list of items that match certain conditions.

#### **Syntax**:
```sql
ARRAY_AGG(expression)
```

#### **Example**:
```sql
SELECT ARRAY_AGG(o.order_id) AS order_ids
FROM orders AS o
WHERE o.customer_id = 'customer1';
```

- **Result**: This returns an array of all `order_id` values for a specific customer.

---

### **7. GROUP BY**

`GROUP BY` is not an aggregation function, but it's essential for aggregation queries. It groups documents based on one or more fields, allowing aggregate functions like `COUNT`, `SUM`, `AVG`, `MIN`, and `MAX` to operate on each group independently.

#### **Syntax**:
```sql
SELECT aggregate_function(...)
FROM bucket
GROUP BY field;
```

#### **Example**:
```sql
SELECT o.status, COUNT(*) AS total_orders
FROM orders AS o
GROUP BY o.status;
```

- **Result**: This groups orders by their status and counts how many orders fall into each status.

#### Another Example with SUM:
```sql
SELECT o.customer_id, SUM(o.total) AS total_spent
FROM orders AS o
GROUP BY o.customer_id;
```

- **Result**: This groups orders by customer ID and calculates the total amount spent by each customer.

---

### **8. HAVING**

`HAVING` is similar to `WHERE`, but it works on the results of the aggregation. It's used to filter groups after an aggregation has been performed.

#### **Syntax**:
```sql
SELECT aggregate_function(...)
FROM bucket
GROUP BY field
HAVING condition;
```

#### **Example**:
```sql
SELECT o.customer_id, SUM(o.total) AS total_spent
FROM orders AS o
GROUP BY o.customer_id
HAVING SUM(o.total) > 1000;
```

- **Result**: This filters out customers whose total spending is less than or equal to $1,000.

---

### **9. ARRAY_COUNT (Array Aggregation Count)**

The **`ARRAY_COUNT()`** function returns the count of elements in an array that match a condition.

#### **Syntax**:
```sql
ARRAY_COUNT(expression)
```

#### **Example**:
```sql
SELECT ARRAY_COUNT(o.items) AS item_count
FROM orders AS o;
```

- **Result**: This returns the number of items in each order.

---

### **10. PERCENTILE Functions**

Couchbase supports `PERCENTILE` functions that allow you to compute percentiles over numeric data.

#### **Syntax**:
```sql
PERCENTILE_CONT(expression, percentile_value)
PERCENTILE_DISC(expression, percentile_value)
```

- `PERCENTILE_CONT` computes the percentile based on continuous distribution (i.e., interpolation).
- `PERCENTILE_DISC` computes the percentile based on a discrete distribution.

#### **Example**:
```sql
SELECT PERCENTILE_CONT(o.total, 0.9) AS percentile_90
FROM orders AS o;
```

- **Result**: This calculates the 90th percentile of order totals, showing the value below which 90% of orders fall.

---

### **11. Standard Deviation and Variance**

Couchbase supports functions for calculating the **standard deviation** and **variance** across numeric fields.

#### **Syntax**:
```sql
STDDEV_POP(expression)   -- Standard deviation for the population
STDDEV_SAMP(expression)  -- Standard deviation for the sample
VAR_POP(expression)      -- Variance for the population
VAR_SAMP(expression)     -- Variance for the sample
```

#### **Example**:
```sql
SELECT STDDEV_POP(o.total) AS order_stddev
FROM orders AS o;
```

- **Result**: This calculates the population standard deviation of order totals.

---

### **12. COUNT DISTINCT**

The **`COUNT(DISTINCT expression)`** function counts the number of unique (distinct) values for a given field.

#### **Syntax**:
```sql
COUNT(DISTINCT expression)
```

#### **Example**:
```sql
SELECT COUNT(DISTINCT o.customer_id) AS unique_customers
FROM orders AS o;
```

- **Result**: This counts the number of unique customers who have placed orders.

---

### **13. Aggregate Example: Grouping and Aggregation**

Here’s an example combining multiple aggregation functions to generate a report:

#### **Query**:
```sql
SELECT o.customer_id,
       COUNT(*) AS total_orders,
       SUM(o.total) AS total_spent,
       AVG(o.total) AS avg_order_value,
       MIN(o.total) AS min_order_value,
       MAX(o.total) AS max_order_value
FROM orders AS o
GROUP BY o.customer_id;
```

- **Result**: This groups orders by customer and provides:
  - The total number of orders.
  - The total amount spent.
  - The average, minimum, and maximum order values.

---

### **14. Aggregate Example with Subqueries**

You can also use subqueries for more advanced aggregations, like finding the total orders per customer and the average total across all customers:

#### **Query**:
```sql
SELECT customer_id, total_spent
FROM (
  SELECT o.customer_id, SUM(o.total) AS total_spent
  FROM orders AS o
  GROUP BY o.customer_id
) AS spending
WHERE spending.total_spent > 1000;
```

- **Explanation**: 
  - The subquery calculates the total spending per customer.
  - The outer query filters for customers who have spent more than $1,000.

---

### **15. Complex Example: Aggregation on Nested Arrays**

Couchbase can aggregate over nested arrays by using functions like `ARRAY_SUM` and `ARRAY_COUNT`:

#### **Example**:
If an `order` document has an array of `items`, and you want to calculate the total number of items ordered and the total price:

```sql
SELECT o.order_id,
       ARRAY_SUM(ARRAY item.price FOR item IN o.items END) AS total_price,
       ARRAY_COUNT(o.items) AS total_items
FROM orders AS o;
```

- **Result**: This query calculates:
  - The total price of all items in each order.
  - The total number of items in each order.

---

### **Summary of Common Aggregation Functions**

| Function         | Description                                              |
|------------------|----------------------------------------------------------|
| **`COUNT()`**     | Counts the number of documents or values.                |
| **`SUM()`**       | Sums a numeric field or expression.                      |
| **`AVG()`**       | Calculates the average of a

 numeric field or expression. |
| **`MIN()`**       | Returns the minimum value of a field or expression.      |
| **`MAX()`**       | Returns the maximum value of a field or expression.      |
| **`ARRAY_AGG()`** | Aggregates values into an array.                         |
| **`PERCENTILE_CONT()`** | Calculates percentiles using continuous distribution. |
| **`STDDEV_POP()`** | Calculates the standard deviation for a population.     |
| **`COUNT(DISTINCT)`** | Counts the number of unique values.                  |

These aggregation functions in Couchbase allow you to perform complex data analysis directly within the N1QL query language. 