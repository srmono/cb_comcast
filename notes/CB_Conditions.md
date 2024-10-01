In Couchbase, conditions in N1QL (the query language) are used to filter and manipulate data. They are often used in the `WHERE` clause to specify which documents to include in the results based on various criteria. Here’s a detailed overview of the types of conditions you can use in Couchbase queries.

## **1. Comparison Operators**

Comparison operators are used to compare values in conditions.

| Operator | Description                 | Example                |
|----------|-----------------------------|------------------------|
| `=`      | Equal to                    | `WHERE age = 30`       |
| `!=`     | Not equal to                | `WHERE age != 30`      |
| `<`      | Less than                   | `WHERE age < 30`       |
| `<=`     | Less than or equal to       | `WHERE age <= 30`      |
| `>`      | Greater than                | `WHERE age > 30`       |
| `>=`     | Greater than or equal to    | `WHERE age >= 30`      |

### **Example**:
```sql
SELECT *
FROM users
WHERE age >= 18 AND age <= 25;
```

---

## **2. Logical Operators**

Logical operators are used to combine multiple conditions.

| Operator | Description                | Example                      |
|----------|----------------------------|------------------------------|
| `AND`    | Returns true if both conditions are true | `WHERE age > 18 AND city = 'New York'` |
| `OR`     | Returns true if at least one condition is true | `WHERE age < 18 OR city = 'Los Angeles'` |
| `NOT`    | Returns true if the condition is false | `WHERE NOT active` |

### **Example**:
```sql
SELECT *
FROM users
WHERE (age > 18 AND city = 'New York') OR (age < 18 AND city = 'Los Angeles');
```

---

## **3. BETWEEN Operator**

The `BETWEEN` operator is used to filter results within a specific range.

### **Syntax**:
```sql
WHERE field BETWEEN value1 AND value2
```

### **Example**:
```sql
SELECT *
FROM products
WHERE price BETWEEN 10 AND 50;
```

---

## **4. IN Operator**

The `IN` operator checks if a value matches any value in a list.

### **Syntax**:
```sql
WHERE field IN (value1, value2, value3, ...)
```

### **Example**:
```sql
SELECT *
FROM orders
WHERE status IN ('shipped', 'delivered');
```

---

## **5. LIKE Operator**

The `LIKE` operator is used for pattern matching in string comparisons. Wildcards `%` (for zero or more characters) and `_` (for a single character) can be used.

### **Syntax**:
```sql
WHERE field LIKE 'pattern'
```

### **Example**:
```sql
SELECT *
FROM users
WHERE name LIKE 'A%';  -- Names that start with 'A'
```

---

## **6. IS NULL / IS NOT NULL**

These conditions check for `NULL` values in fields.

### **Syntax**:
```sql
WHERE field IS NULL
WHERE field IS NOT NULL
```

### **Example**:
```sql
SELECT *
FROM users
WHERE email IS NOT NULL;
```

---

## **7. EXISTS Operator**

The `EXISTS` operator checks for the existence of a subquery.

### **Syntax**:
```sql
WHERE EXISTS (subquery)
```

### **Example**:
```sql
SELECT *
FROM users u
WHERE EXISTS (
    SELECT *
    FROM orders o
    WHERE o.user_id = u.id
);
```

---

## **8. ARRAY Functions**

Couchbase allows conditions to be applied to arrays. You can use array functions like `ARRAY_CONTAINS` or `ARRAY_LENGTH` to filter documents based on array contents.

### **Examples**:

#### Using `ARRAY_CONTAINS`
```sql
SELECT *
FROM users
WHERE ARRAY_CONTAINS(favorite_colors, 'blue');
```

#### Using `ARRAY_LENGTH`
```sql
SELECT *
FROM orders
WHERE ARRAY_LENGTH(items) > 0;  -- Orders with at least one item
```

---

## **9. Subqueries**

You can use subqueries to filter results based on the results of another query.

### **Example**:
```sql
SELECT *
FROM users u
WHERE u.id IN (
    SELECT o.user_id
    FROM orders o
    WHERE o.status = 'shipped'
);
```

---

## **10. Conditionals: CASE Statements**

The `CASE` statement allows for conditional logic within a query.

### **Syntax**:
```sql
CASE 
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ELSE result3
END
```

### **Example**:
```sql
SELECT name, 
       CASE 
           WHEN age < 18 THEN 'Minor'
           WHEN age >= 18 AND age < 65 THEN 'Adult'
           ELSE 'Senior'
       END AS age_group
FROM users;
```

---

## **11. Conditional Aggregation**

You can also use conditions in aggregate functions with the `FILTER` clause.

### **Example**:
```sql
SELECT 
    COUNT(*) AS total_orders,
    COUNT(*) FILTER (WHERE status = 'shipped') AS shipped_orders
FROM orders;
```

---

## **12. HAVING Clause**

The `HAVING` clause is used to filter results after aggregation.

### **Example**:
```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 5;
```

---

## **Summary of Common Conditions in Couchbase**

- **Comparison Operators**: `=`, `!=`, `<`, `<=`, `>`, `>=`
- **Logical Operators**: `AND`, `OR`, `NOT`
- **BETWEEN**: For range filtering
- **IN**: For checking values in a list
- **LIKE**: For pattern matching
- **IS NULL / IS NOT NULL**: To check for null values
- **EXISTS**: For checking the existence of records
- **ARRAY Functions**: `ARRAY_CONTAINS`, `ARRAY_LENGTH`, etc.
- **Subqueries**: For advanced filtering
- **CASE Statements**: For conditional logic
- **HAVING**: For filtering aggregated results

These conditions provide a robust framework for querying and manipulating data in Couchbase.