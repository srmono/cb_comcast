Both document designs you mentioned in Couchbase can be useful, depending on your specific use cases and the querying patterns you expect. Here's an analysis of each approach:

### 1. **First Approach:** `{order: { rest of the document goes here}}`
This design nests the entire order object under the key `order`. It is beneficial when:
- You have a very specific use case where orders are always accessed as a complete object, and you don't need to query or filter data based on other fields like `type`, `customer`, etc.
- You are grouping multiple pieces of information under the key `order`, which could help in terms of readability for developers.
  
However, **drawbacks** might include:
- Querying becomes more complicated since you need to access the nested fields (`order.customer`, `order.items`, etc.).
- Indexing on fields within the nested structure is not straightforward and might require more complex indexes.

**Use Case:**  
- This might be a good design when orders are always queried as a whole or when the document is used in a very specific context where you don't need to filter or search based on internal fields.

### 2. **Second Approach:** `{type: order, customer: {}}`
This design adds metadata directly at the root level, allowing you to specify the document type and add other key data points like `customer` alongside it. This approach is more flexible and generally better suited for:
- Scenarios where you need to filter or query documents based on their type (`type: order`) or any other key fields like `customer`.
- Building indexes on top-level fields like `type` or `customer`, improving the performance of queries and enabling efficient searching.

**Use Case:**
- This is ideal when your Couchbase collection contains multiple document types (e.g., `order`, `product`, `customer`) and you frequently filter or query data based on the type.
- It also suits use cases where you need to query orders based on customer information or other attributes at the top level.

### **Which One to Use?**
- **First Approach:** Use this when the order document is self-contained and you don't expect to query it often based on its internal fields. It's more suited for a schema with a specific, encapsulated object (e.g., an API returning whole objects without complex querying needs).
- 
- **Second Approach:** Use this when you anticipate needing more flexibility in querying based on different fields. This design is typically better for documents where the structure is more complex or if you're building a more generic system where documents might have shared fields (like `type`) across different entities.