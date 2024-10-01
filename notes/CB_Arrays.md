Couchbase N1QL provides several **array-only operators** that help you interact with and manipulate arrays within documents. These operators allow you to check if specific conditions are met within arrays, transform arrays, or filter arrays. Below are the array-only operators available in Couchbase N1QL.

### **Array-Only Operators in Couchbase N1QL**

#### **1. `ANY` Operator**
- **Purpose**: Checks if **any element** in an array satisfies a given condition.
- **Syntax**:
  ```sql
  ANY alias IN array_expression SATISFIES condition END
  ```
- **Example**:
  ```sql
  SELECT name
  FROM bucket
  WHERE ANY interest IN interests SATISFIES interest = 'travel' END;
  ```
  This query checks if the `interests` array contains at least one element that is `'travel'`.

#### **2. `EVERY` Operator**
- **Purpose**: Checks if **all elements** in an array satisfy a given condition.
- **Syntax**:
  ```sql
  EVERY alias IN array_expression SATISFIES condition END
  ```
- **Example**:
  ```sql
  SELECT name
  FROM bucket
  WHERE EVERY score IN scores SATISFIES score >= 50 END;
  ```
  This query checks if all elements in the `scores` array are greater than or equal to 50.

#### **3. `ARRAY` Operator**
- **Purpose**: Used to transform or construct an array from an existing array or a collection of expressions.
- **Syntax**:
  ```sql
  ARRAY expression FOR alias IN array_expression WHEN condition END
  ```
  - `FOR`: Loops through the array.
  - `WHEN`: Adds a condition (optional) that filters elements based on a condition.
  
- **Example**:
  ```sql
  SELECT name, ARRAY v * 2 FOR v IN scores WHEN v >= 50 END AS doubled_scores
  FROM bucket;
  ```
  This query multiplies each score in the `scores` array by 2 for elements greater than or equal to 50.

#### **4. `WITHIN` Operator**
- **Purpose**: Checks if an element exists **anywhere within** an array, including nested arrays.
- **Syntax**:
  ```sql
  expression WITHIN array_expression
  ```
- **Example**:
  ```sql
  SELECT name
  FROM bucket
  WHERE 'travel' WITHIN interests;
  ```
  This query checks if `'travel'` exists in the `interests` array, including any nested arrays within it.

#### **5. `SOME` Operator**
- **Purpose**: Acts similarly to `ANY`, but only checks if **at least one element** in an array satisfies the condition.
- **Syntax**:
  ```sql
  SOME alias IN array_expression SATISFIES condition END
  ```
  (In practice, `ANY` and `SOME` are often interchangeable.)

- **Example**:
  ```sql
  SELECT name
  FROM bucket
  WHERE SOME score IN scores SATISFIES score >= 90 END;
  ```

#### **6. `FIRST` Operator**
- **Purpose**: Retrieves the **first element** in an array that satisfies a condition.
- **Syntax**:
  ```sql
  FIRST expression FOR alias IN array_expression WHEN condition END
  ```
- **Example**:
  ```sql
  SELECT name, FIRST v FOR v IN scores WHEN v > 80 END AS first_high_score
  FROM bucket;
  ```
  This query returns the first score in the `scores` array that is greater than 80.

#### **7. `DISTINCT ARRAY` Operator**
- **Purpose**: Similar to the `ARRAY` operator, but ensures that the resulting array has **distinct values** (i.e., no duplicates).
- **Syntax**:
  ```sql
  DISTINCT ARRAY expression FOR alias IN array_expression WHEN condition END
  ```
- **Example**:
  ```sql
  SELECT name, DISTINCT ARRAY v FOR v IN scores WHEN v > 50 END AS distinct_high_scores
  FROM bucket;
  ```
  This query creates an array of distinct scores greater than 50 from the `scores` array.

#### **8. `ARRAY_LENGTH` Function (Not an Operator, but Useful)**
- **Purpose**: Returns the length (number of elements) of an array.
- **Syntax**:
  ```sql
  ARRAY_LENGTH(array_expression)
  ```
- **Example**:
  ```sql
  SELECT name, ARRAY_LENGTH(interests) AS interest_count
  FROM bucket;
  ```
  This query counts the number of elements in the `interests` array for each document.

---

### **Example Queries Using Array Operators**

#### Example 1: `ANY` and `ARRAY`
```sql
SELECT name, ARRAY v FOR v IN interests WHEN v LIKE '%travel%' END AS travel_related
FROM bucket
WHERE ANY interest IN interests SATISFIES interest LIKE '%travel%' END;
```
This query:
- Uses `ANY` to check if the `interests` array contains any elements that match the pattern `'travel'`.
- Uses `ARRAY` to create a new array, `travel_related`, which includes only elements in `interests` that match the pattern `'travel'`.

#### Example 2: `EVERY`
```sql
SELECT name
FROM bucket
WHERE EVERY score IN scores SATISFIES score >= 60 END;
```
This query returns documents where every score in the `scores` array is greater than or equal to 60.

#### Example 3: `DISTINCT ARRAY`
```sql
SELECT name, DISTINCT ARRAY v FOR v IN tags WHEN v IS NOT NULL END AS distinct_tags
FROM bucket;
```
This query creates a `distinct_tags` array from the `tags` array, removing any `NULL` values and ensuring that each tag appears only once.

---

These **array-only operators** allow you to perform a wide range of operations on arrays in Couchbase, making it possible to query and manipulate complex data structures with ease.

---

Couchbase N1QL provides a set of features that allow you to work effectively with arrays, including **array slicing**, handling **arrays of objects**, and several **array functions** that simplify querying and manipulating arrays.

Let's dive into each of these topics:

---

## **1. Array Slicing**

**Array slicing** allows you to extract a **subset** of elements from an array based on their index positions.

### **Syntax**:
```sql
array_expression[start_index : end_index]
```

- **start_index**: The index position (zero-based) to begin the slice.
- **end_index**: The index position to end the slice (exclusive). The slice will not include the element at the end index.

If you omit the `start_index` or `end_index`, Couchbase will use defaults:
- If `start_index` is omitted, it defaults to `0`.
- If `end_index` is omitted, it defaults to the length of the array.

### **Example**:
Assume you have a document structure like:
```json
{
  "name": "John",
  "scores": [90, 85, 78, 92, 88, 79]
}
```

#### Slicing Example:
```sql
SELECT name, scores[1:4] AS sliced_scores
FROM bucket;
```
- **Result**: This query will return the elements from index 1 to 3 (`85, 78, 92`) from the `scores` array.
  ```json
  {
    "name": "John",
    "sliced_scores": [85, 78, 92]
  }
  ```

### Special Cases:
- **Negative Indexes**: You can also use negative indexes to start from the end of the array.
  ```sql
  SELECT name, scores[-3:-1] AS sliced_scores
  FROM bucket;
  ```
  This query slices from the third-to-last element to the second-to-last element of the array.

---

## **2. Array of Objects**

Couchbase often stores arrays of objects (i.e., arrays where each element is a JSON object). N1QL provides powerful ways to query and manipulate such structures.

### **Example Document**:
```json
{
  "name": "Jane",
  "projects": [
    {"name": "Project Alpha", "status": "completed", "budget": 10000},
    {"name": "Project Beta", "status": "in progress", "budget": 20000},
    {"name": "Project Gamma", "status": "completed", "budget": 15000}
  ]
}
```

### **Querying Array of Objects**:
You can access specific fields within each object in the array or filter based on field values.

#### Query Example:
```sql
SELECT name, projects
FROM bucket
WHERE ANY project IN projects SATISFIES project.status = 'completed' END;
```
This query returns documents where **any project** in the `projects` array has the status `'completed'`.

### **Using `ARRAY` to Create a Subset of Array of Objects**:
You can create a new array of objects that meet specific conditions.

```sql
SELECT name, ARRAY project FOR project IN projects WHEN project.status = 'completed' END AS completed_projects
FROM bucket;
```
This query creates a new array `completed_projects`, containing only the projects that have the status `'completed'`.

### **Accessing Specific Fields in Array of Objects**:
If you want to access specific fields from each object in the array, you can extract those fields.

```sql
SELECT name, ARRAY project.name FOR project IN projects WHEN project.budget > 10000 END AS large_projects
FROM bucket;
```
This query creates a new array `large_projects`, which contains only the names of the projects with a budget greater than 10,000.

---

## **3. Array Functions**

Couchbase N1QL provides several built-in **array functions** to manipulate and analyze arrays. Below are some commonly used array functions.

### **ARRAY_LENGTH()**
- **Purpose**: Returns the number of elements in an array.
- **Syntax**:
  ```sql
  ARRAY_LENGTH(array_expression)
  ```
- **Example**:
  ```sql
  SELECT name, ARRAY_LENGTH(projects) AS project_count
  FROM bucket;
  ```

### **ARRAY_APPEND()**
- **Purpose**: Adds an element to the end of an array.
- **Syntax**:
  ```sql
  ARRAY_APPEND(array_expression, value)
  ```
- **Example**:
  ```sql
  SELECT ARRAY_APPEND([1, 2, 3], 4) AS extended_array;
  ```
  This will return `[1, 2, 3, 4]`.

### **ARRAY_CONCAT()**
- **Purpose**: Concatenates two or more arrays.
- **Syntax**:
  ```sql
  ARRAY_CONCAT(array1, array2, ...)
  ```
- **Example**:
  ```sql
  SELECT ARRAY_CONCAT([1, 2], [3, 4], [5, 6]) AS combined_array;
  ```
  The result will be `[1, 2, 3, 4, 5, 6]`.

### **ARRAY_CONTAINS()**
- **Purpose**: Checks if a specific value exists in an array.
- **Syntax**:
  ```sql
  ARRAY_CONTAINS(array_expression, value)
  ```
- **Example**:
  ```sql
  SELECT name, ARRAY_CONTAINS(projects, {"name": "Project Alpha", "status": "completed", "budget": 10000}) AS has_alpha_project
  FROM bucket;
  ```

### **ARRAY_DISTINCT()**
- **Purpose**: Removes duplicate elements from an array.
- **Syntax**:
  ```sql
  ARRAY_DISTINCT(array_expression)
  ```
- **Example**:
  ```sql
  SELECT ARRAY_DISTINCT([1, 2, 2, 3, 4, 4, 5]) AS distinct_array;
  ```
  The result will be `[1, 2, 3, 4, 5]`.

### **ARRAY_FLATTEN()**
- **Purpose**: Flattens nested arrays into a single array.
- **Syntax**:
  ```sql
  ARRAY_FLATTEN(array_expression, depth)
  ```
  - **depth**: Specifies how many levels of nesting should be flattened.
  
- **Example**:
  ```sql
  SELECT ARRAY_FLATTEN([[1, 2], [3, 4], [5, 6]], 1) AS flattened_array;
  ```
  The result will be `[1, 2, 3, 4, 5, 6]`.

### **ARRAY_INTERSECT()**
- **Purpose**: Returns the common elements between two or more arrays.
- **Syntax**:
  ```sql
  ARRAY_INTERSECT(array1, array2, ...)
  ```
- **Example**:
  ```sql
  SELECT ARRAY_INTERSECT([1, 2, 3], [2, 3, 4], [3, 4, 5]) AS common_elements;
  ```
  The result will be `[3]` since 3 is the only common element in all arrays.

### **ARRAY_MAX() / ARRAY_MIN()**
- **Purpose**: Returns the maximum or minimum value in an array.
- **Syntax**:
  ```sql
  ARRAY_MAX(array_expression)
  ARRAY_MIN(array_expression)
  ```
- **Example**:
  ```sql
  SELECT ARRAY_MAX([1, 2, 3, 4, 5]) AS max_value, ARRAY_MIN([1, 2, 3, 4, 5]) AS min_value;
  ```

### **ARRAY_RANGE()**
- **Purpose**: Generates an array containing a range of integers.
- **Syntax**:
  ```sql
  ARRAY_RANGE(start, end, step)
  ```
  - **start**: Starting integer.
  - **end**: Ending integer (exclusive).
  - **step**: Increment (optional, default is 1).

- **Example**:
  ```sql
  SELECT ARRAY_RANGE(1, 10, 2) AS number_range;
  ```
  This generates an array `[1, 3, 5, 7, 9]`.

### **ARRAY_REMOVE()**
- **Purpose**: Removes all instances of a specific value from an array.
- **Syntax**:
  ```sql
  ARRAY_REMOVE(array_expression, value)
  ```
- **Example**:
  ```sql
  SELECT ARRAY_REMOVE([1, 2, 3, 2, 4, 2], 2) AS array_without_twos;
  ```
  The result will be `[1, 3, 4]`.

### **ARRAY_SUM()**
- **Purpose**: Returns the sum of all numerical values in an array.
- **Syntax**:
  ```sql
  ARRAY_SUM(array_expression)
  ```
- **Example**:
  ```sql
  SELECT ARRAY_SUM([1, 2, 3, 4, 5]) AS total_sum;
  ```

---

### **Example Query Using Array Slicing, Array of Objects, and Array Functions**
```sql
SELECT name,
       ARRAY_SLICE(projects[0:2]) AS first_two_projects,
       ARRAY project.name FOR project IN projects WHEN project.status = 'completed' END AS completed_projects,
       ARRAY_LENGTH(projects) AS total_projects,
       ARRAY_SUM(ARRAY project.budget FOR project IN projects END) AS total_budget
FROM bucket;
```
In this query:
- We slice the first two projects from the `projects` array.
- We extract

 the `name` of all completed projects.
- We compute the total number of projects.
- We calculate the total budget of all projects using `ARRAY_SUM`.

---

These features give you great flexibility when working with arrays in Couchbase N1QL. 