const express = require("express");
const couchbase = require("couchbase");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is listerning at ${PORT}`)
})


//db connection
let collection;

// Couchbase connection initialization
async function initCouchbase() {
    try {
        const clusterConnStr = 'couchbase://localhost';
        const username = 'admin';
        const password = '123456';
        const bucketName = 'my_bucket';

        // Connect to Couchbase cluster
        const cluster = await couchbase.connect(clusterConnStr, {
            username: username,
            password: password,
        });

        // Select the bucket and default collection
        const bucket = cluster.bucket(bucketName);
        collection = bucket.defaultCollection();  // Assign the collection to be used globally

        console.log('Connected to Couchbase and collection initialized');
    } catch (error) {
        console.error('Error initializing Couchbase:', error);
    }
}

// Initialize Couchbase on server start
initCouchbase();



// async function main() {
//     // For a secure cluster connection, use `couchbases://<your-cluster-ip>` instead.
//     const clusterConnStr = 'couchbase://localhost'
//     const username = 'admin'
//     const password = '123456'
//     const bucketName = 'my_bucket'
  
//     const cluster = await couchbase.connect(clusterConnStr, {
//       username: username,
//       password: password,
//     })
  
//     const bucket = cluster.bucket(bucketName)
  
//     // Get a reference to the default collection, required only for older Couchbase server versions
//     const defaultCollection = bucket.defaultCollection()
  
//   }
  
//   // Run the main function
//   main()
//     .catch((err) => {
//       console.log('ERR:', err)
//       process.exit(1)
//     })
//     .then(process.exit)


// crud api  http://localhost:3001/users

// app.post('/users', async (req, res) => {
//   try {
//       const userId = `user::${Date.now()}`;  // Generate a unique user key
//       const document = req.body;  // Document data from the request body

//       const result = await collection.insert(userId, document);
//       res.status(201).send({ message: 'User created', id: userId, result });
//   } catch (error) {
//       res.status(500).send({ error: 'Error creating user', details: error });
//   }
// });

app.post('/users', async (req, res) => {
  try {
      const userId = `user::${Date.now()}`;
      const document = req.body;

      console.log('Attempting to insert document:', document);

      const result = await collection.insert(userId, document);
      console.log('Insert result:', result);

      res.status(201).send({ message: 'User created', id: userId, result });
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send({ error: 'Error creating user', details: error });
  }
});



app.get('/', async (req, res) => {
  try {
      // const userId = req.params.id;  // Extract user ID from URL
      // const result = await collection.get(userId);  // Get document by ID
      res.status(200).send("Hello World");
  } catch (error) {
      res.status(404).send({ error: 'User not found', details: error });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
      const userId = req.params.id;  // Extract user ID from URL
      const result = await collection.get(userId);  // Get document by ID
      res.status(200).send(result.content);
  } catch (error) {
      res.status(404).send({ error: 'User not found', details: error });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
      const userId = req.params.id;  // Extract user ID from URL
      const updatedDocument = req.body;  // Updated data from the request body

      const result = await collection.replace(userId, updatedDocument);
      res.status(200).send({ message: 'User updated', result });
  } catch (error) {
      res.status(500).send({ error: 'Error updating user', details: error });
  }
});


app.delete('/users/:id', async (req, res) => {
  try {
      const userId = req.params.id;  // Extract user ID from URL
      const result = await collection.remove(userId);
      res.status(200).send({ message: 'User deleted', result });
  } catch (error) {
      res.status(500).send({ error: 'Error deleting user', details: error });
  }
});


