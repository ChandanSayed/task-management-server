const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = process.env.URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const taskManagementCollection = client.db('taskManagement').collection('tasks');
    app.get('/', (req, res) => {
      res.send('Welcome to the home route!');
    });

    app.post('/add-task', async (req, res) => {
      console.log(req.body);
      const response = await taskManagementCollection.insertOne(req.body);
      res.send(response);
    });

    app.get('/tasks/:uid', async (req, res) => {
      // console.log(req.params);
      const response = await taskManagementCollection.find({ uId: req.params.uid }).toArray();
      res.send(response);
    });

    app.delete('/tasks/:id', async (req, res) => {
      const response = await taskManagementCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(response);
    });

    app.put('/tasks/update-task/:id', async (req, res) => {
      const { deadline, description, priority, title } = req.body;
      const response = await taskManagementCollection.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { $set: { deadline, description, priority, title } });
      res.send(response);
    });

    app.put('/tasks/update-task-category/:id', async (req, res) => {
      const { category } = req.body;
      const response = await taskManagementCollection.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { $set: { category } });
      res.send(response);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
