In Couchbase's N1QL (a query language similar to SQL for Couchbase), the `GROUP BY` and `HAVING` clauses are used in a way similar to traditional SQL. Here's a detailed explanation of how they differ and how they are used:

### `GROUP BY` Clause

- **Purpose**: The `GROUP BY` clause is used to group rows that have the same values in specified columns into summary rows, often combined with aggregate functions like `COUNT()`, `SUM()`, `AVG()`, etc.
- **How it works**: When you `GROUP BY` one or more fields, N1QL aggregates data based on those fields. It groups rows with the same value for the specified field(s) and applies aggregate functions across each group.
  
  **Example**:
  ```sql
  SELECT city, COUNT(*)
  FROM travel
  GROUP BY city;
  ```

  This groups all the entries in the `travel` bucket by the `city` field and returns the count of entries for each city.

### `HAVING` Clause

- **Purpose**: The `HAVING` clause is used to filter groups after aggregation. It's similar to the `WHERE` clause, but `WHERE` is used to filter individual rows **before** aggregation, while `HAVING` filters the groups **after** aggregation.
- **How it works**: After groups are created by `GROUP BY`, the `HAVING` clause is applied to filter these groups based on a condition (typically involving aggregate functions).
  
  **Example**:
  ```sql
  SELECT city, COUNT(*)
  FROM travel
  GROUP BY city
  HAVING COUNT(*) > 10;
  ```

  This query first groups the entries by `city`, then filters to return only the cities where the count of entries is greater than 10.

### Key Differences

- **`GROUP BY`** is used to group rows based on a certain field or fields.
- **`HAVING`** is used to filter those groups after aggregation.
- **`WHERE` vs. `HAVING`**: The `WHERE` clause filters rows **before** aggregation, while `HAVING` filters the groups **after** aggregation.

### Combined Example

Here's an example that combines both `GROUP BY` and `HAVING` in a Couchbase query:

```sql
SELECT category, AVG(price)
FROM products
WHERE price > 10
GROUP BY category
HAVING AVG(price) > 50;
```

- The `WHERE` clause filters products with a price greater than 10.
- The `GROUP BY` groups the remaining products by `category`.
- The `HAVING` clause filters the grouped categories, returning only those where the average price is greater than 50.

This highlights the order of operations: **WHERE → GROUP BY → HAVING**.