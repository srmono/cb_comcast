In SQL (and by extension, Couchbase’s N1QL), the `CASE` expression is used to return values based on certain conditions. There are **two types** of `CASE` expressions: **Simple `CASE`** and **Searched `CASE`**.

Here’s a breakdown of the differences between the two:

### 1. **Simple `CASE` Expression** (or Case Expression)

The **Simple `CASE`** expression compares a single expression to a list of potential values. It checks each value and returns a result when a match is found.

**Syntax**:
```sql
CASE expression
    WHEN value1 THEN result1
    WHEN value2 THEN result2
    ...
    ELSE default_result
END
```

- **`expression`**: The value being compared.
- **`value1`, `value2`**: The potential values that the expression is compared against.
- **`result1`, `result2`**: The values returned if the expression matches one of the `WHEN` conditions.
- **`ELSE`**: The value returned if no match is found (optional).

**Example**:
```sql
SELECT name,
   CASE gender
       WHEN 'M' THEN 'Male'
       WHEN 'F' THEN 'Female'
       ELSE 'Unknown'
   END AS gender_label
FROM people;
```

In this example, the `CASE` expression checks the `gender` field and returns 'Male' if it’s `'M'`, 'Female' if it’s `'F'`, and 'Unknown' if it’s neither.

### 2. **Searched `CASE` Expression**

The **Searched `CASE`** expression allows more flexibility because it uses **Boolean conditions** instead of comparing a single expression. This means you can evaluate different conditions that don’t rely on a single value comparison.

**Syntax**:
```sql
CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ...
    ELSE default_result
END
```

- **`condition1`, `condition2`**: Any Boolean condition that can be true or false.
- **`result1`, `result2`**: The values returned if the conditions evaluate to `TRUE`.
- **`ELSE`**: The value returned if no conditions evaluate to `TRUE` (optional).

**Example**:
```sql
SELECT name,
   CASE
       WHEN age < 18 THEN 'Minor'
       WHEN age >= 18 AND age < 65 THEN 'Adult'
       ELSE 'Senior'
   END AS age_group
FROM people;
```

In this example, the `CASE` expression evaluates multiple conditions:
- If the `age` is less than 18, it returns 'Minor'.
- If the `age` is between 18 and 64, it returns 'Adult'.
- Otherwise, it returns 'Senior'.

### Key Differences:

- **Simple `CASE` Expression**:
  - Compares a single expression to multiple values.
  - It is concise when you have direct value comparisons.
  - Syntax: `CASE expression WHEN value THEN result`.

- **Searched `CASE` Expression**:
  - Evaluates multiple conditions that can be more complex than just value matching.
  - Offers more flexibility because each `WHEN` condition is a Boolean expression.
  - Syntax: `CASE WHEN condition THEN result`.

### Summary:

- **Use Simple `CASE`** when you are comparing one expression against different specific values (e.g., gender, status codes).
- **Use Searched `CASE`** when you have complex conditions to evaluate, such as ranges or more intricate logical expressions (e.g., age ranges, salary comparisons).