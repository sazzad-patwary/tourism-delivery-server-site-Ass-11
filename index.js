const express = require('express');

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');

// travel-world-assignment
// u066J6LkJJmjPvEi

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrdl1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        // console.log('database connected')
        const database = client.db("travel-world-assignment");
        const packageCollection = database.collection('packages');


        // GET package API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        //get single package
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            console.log('specific service', id);
            const query = { _id: ObjectId(id) };
            const package = await packageCollection.findOne(query);
            res.send(package);

        })


        //POST API
        app.post('/packages', async (req, res) => {
            const package = req.body;
            console.log('hit ai', package);

            const result = await packageCollection.insertOne(package);
            console.log(result);
            res.send(result);
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('travel world server running')
});

app.listen(port, () => {
    console.log('server running:', port);
})