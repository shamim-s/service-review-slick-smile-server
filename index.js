const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.zn49gp5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const servicesCollection = client.db('slickSmileDB').collection('services');
        const reviewCollection = client.db('slickSmileDB').collection('reviews');

    // get 3 services data for home page 
            app.get('/services', async(req, res) => {
                const query = {};
                const cursor = servicesCollection.find(query);
                const result = await cursor.limit(3).toArray();
                res.send(result);
            })

    // get all services data for all services page 
        app.get('/services/all', async(req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

    // getting e single service with id 
        app.get('/services/all/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.findOne(query);
            res.send(result);
        })

    
    }
    finally{

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send("SLICK SMILE SERVER RUNNING");
})

app.listen(port, () => {
    console.log(`SLICK SMILE SERVER RUNNING IN PORT ${port}`);
})