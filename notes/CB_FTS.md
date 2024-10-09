Couchbase Full-Text Search (FTS) is a powerful feature that allows you to perform complex text searches within your data. It supports features like tokenization, stemming, ranking, and fuzzy matching, which are essential for building advanced search experiences. Let's walk through a **step-by-step guide to using Couchbase FTS at an advanced level**, covering topics like creating custom analyzers, fine-tuning indexing, and leveraging FTS features like fuzzy searches and phrase matching.

---

### **Step 1: Set Up FTS Index**

#### 1.1. **Create a Basic FTS Index**
Before diving into advanced features, you first need a Full-Text Search index. Here's how to create a basic FTS index:
- Open the **Couchbase Web UI**.
- Navigate to the **Search** tab and click **Add Index**.
- Choose the bucket you want to index and give the index a name.
- Select the default type mappings (document type, etc.), or use **dynamic mapping** (which automatically indexes all document fields).

#### 1.2. **Index Specific Fields (Optional)**
- In the index creation screen, you can choose which fields to index. This is useful for limiting your index to only the fields you plan to search, saving resources.
- Click **Add Child Mapping** and specify which fields should be indexed (e.g., `title`, `description`, etc.).

---

### **Step 2: Customize the Analyzer**

Custom analyzers allow you to control how text is broken down into tokens, how tokens are filtered, and how they are indexed. This is key to fine-tuning search behavior.

#### 2.1. **Create a Custom Analyzer**
- Go to the **Custom Analyzer** tab while creating or editing an FTS index.
- Define how text should be processed:
  - **Tokenizer**: Choose a tokenizer (e.g., `whitespace`, `ngram`, `edge_ngram`, `unicode`, etc.).
  - **Token Filters**: Add filters to remove stop words, apply stemming, etc.
  - **Char Filters**: Modify characters (e.g., strip accents or normalize text).

#### 2.2. **Use Different Analyzers for Different Fields**
You can assign different analyzers to specific fields in a document:
- While adding field mappings, you can select a specific analyzer per field. For instance:
  - For a `name` field, you might use a **whitespace** analyzer.
  - For a `description` field, you might use a **unicode** analyzer with stemming.

---

### **Step 3: Fine-Tune Indexing (Mappings and Types)**

Couchbase FTS allows you to define specific **mappings** for document types and fields, which control how the fields are indexed and searched.

#### 3.1. **Field-Level Mappings**
- Go to the **Type Mapping** section in the index.
- Create field mappings to control indexing behavior for specific fields. For example, you may:
  - **Exclude Fields**: Choose fields that you don’t want to be indexed (e.g., `password`).
  - **Store Fields**: Store the original text for certain fields to be retrieved during the search.

#### 3.2. **Data Types**
- FTS can index different types of data such as `text`, `numeric`, `boolean`, and `geospatial` fields. Configure the appropriate data type for each field.
  - **Text**: Use for string data where FTS capabilities are required.
  - **Numeric**: Useful for range queries.
  - **Geospatial**: If you need to search based on location or coordinates, you can map fields as geospatial types.

---

### **Step 4: Advanced Query Types**

Once your index is set up, you can perform advanced search queries using different FTS features.

#### 4.1. **Phrase Matching**
FTS allows you to search for exact phrases. For example:
```json
{
  "query": {
    "match_phrase": "Full-Text Search"
  }
}
```
This ensures that the phrase “Full-Text Search” appears in exactly this order in the document.

#### 4.2. **Fuzzy Matching**
You can allow for minor spelling mistakes or typos in your search by using **fuzzy matching**:
```json
{
  "query": {
    "fuzzy": {
      "field": "title",
      "term": "ftse",
      "fuzziness": 2
    }
  }
}
```
This query will match terms like `"FTS"`, even if there is a typo or minor misspelling in the search term.

#### 4.3. **Boolean Queries**
Boolean queries allow you to combine multiple search conditions with `AND`, `OR`, `NOT` logic. Example:
```json
{
  "query": {
    "bool": {
      "must": [
        { "match": "Couchbase" }
      ],
      "should": [
        { "match": "FTS" },
        { "match": "indexing" }
      ],
      "must_not": [
        { "match": "deprecated" }
      ]
    }
  }
}
```
This query requires that `"Couchbase"` must appear, prefers that `"FTS"` or `"indexing"` appear, and excludes documents containing `"deprecated"`.

---

### **Step 5: Fine-Tune Search Behavior**

#### 5.1. **Boosting**
You can boost certain fields to make them more relevant during search. For example, if you want documents with the term in the `title` field to be more important than those in the `description`:
```json
{
  "query": {
    "match": "Couchbase",
    "boost": 2.0
  }
}
```

#### 5.2. **Field-Scoped Queries**
You can scope your queries to specific fields, ensuring that searches only match specific document fields:
```json
{
  "query": {
    "match": {
      "field": "title",
      "query": "Couchbase"
    }
  }
}
```
This restricts the search to only the `title` field.

#### 5.3. **Range Queries (Numeric and Date Ranges)**
FTS supports numeric and date range searches. For example, to find documents where a `price` field is between 100 and 200:
```json
{
  "query": {
    "numeric_range": {
      "field": "price",
      "min": 100,
      "max": 200
    }
  }
}
```

#### 5.4. **Wildcard and Regex Searches**
You can perform wildcard or regex searches for more flexibility:
```json
{
  "query": {
    "wildcard": {
      "field": "title",
      "wildcard": "couch*"
    }
  }
}
```
This will match any words starting with "couch" (e.g., "Couchbase", "couching").

---

### **Step 6: Optimize Index and Queries**

#### 6.1. **Index Partitioning**
For large datasets, enable **partitioning** in the FTS index to distribute the indexing workload across nodes. This can significantly improve indexing and query performance.

#### 6.2. **Concurrency**
Ensure that you configure the index for **concurrent indexing** if your workload demands high throughput.

#### 6.3. **Query Profiling**
Couchbase FTS provides query profiling features to monitor the performance of search queries. Use the Couchbase Web UI or Couchbase’s REST API to review query performance and optimize slow queries.

---

### **Step 7: Full-Text Search Integration**

#### 7.1. **Integrating FTS with N1QL**
You can combine Full-Text Search with Couchbase N1QL queries. This allows you to use the power of both relational-style queries (via N1QL) and advanced text search (via FTS). For example:
```sql
SELECT meta().id
FROM `your_bucket`
WHERE SEARCH(`your_bucket`, 'Couchbase') AND type = "article";
```
This query uses FTS to search for the term "Couchbase" and N1QL to filter for documents of type `"article"`.

---

### Conclusion

Couchbase FTS is a highly flexible and powerful search solution that can be fine-tuned for complex search use cases. By creating custom analyzers, leveraging advanced query types (like fuzzy matching, phrase queries, and boolean queries), and integrating with N1QL, you can build robust and high-performance search applications.