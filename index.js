const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');

require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svxyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("travel-packages");
        const packagesCollection = database.collection("packages");
        const bookOrderCollection = database.collection("book-order-collection");

        //POST API FOR NEW PACKAGE ADDING API
        app.post('/addPackages', async (req, res) => {
            const newPackage = req.body;
            // console.log("hit the post", newPackage);
            const result = await packagesCollection.insertOne(newPackage);
            res.json(result)
            // console.log(result);
        })

        //POST API FOR BOOK PACKAGE API
        app.post('/bookedPackages', async (req, res) => {
            console.log("hitting the post");
            const bookedPackage = req.body;
            console.log(bookedPackage);
            const result = await bookOrderCollection.insertOne(bookedPackage);
            res.json(result)
            // console.log(result);
        })

        //GET MY ORDERED PACKAGES API
        app.get('/myOrders/:email', async (req, res) => {
            // console.log(req.params.email);
            const result = await bookOrderCollection.find({ email: req.params.email }).toArray();
            // console.log(result);
            res.send(result);
        })

        //DELETE MY ORDER API
        app.delete('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookOrderCollection.deleteOne(query);
            res.json(result);
        })

        // MANAGE ALL ORDERS API
        app.delete('/manageOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookOrderCollection.deleteOne(query);
            res.json(result);
        })

        // GET SINGLE PACKAGE API
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            // console.log("getting specific service id:", id);
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);
            // console.log(package);
        })

        // GET API FOR ALL DATA LOAD IN PACKAGES SECTION API
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const allPackages = await cursor.toArray();
            res.send(allPackages);
            // console.log(allPackages);
        })

        // GET ALL BOOKED ORDERS API
        app.get('/manageOrders', async (req, res) => {
            const cursor = bookOrderCollection.find({});
            const allBookedOrders = await cursor.toArray();
            res.send(allBookedOrders);
            // console.log(allBookedOrders);
        })


        app.put("/manageOrders/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "Approved"
                },
            };
            const result = await bookOrderCollection.updateOne(filter, updateDoc, options)
            res.json(result);
        });


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello, I am form node js and express.')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:`, port)
})