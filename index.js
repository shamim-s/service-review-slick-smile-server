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

    // Post method for submit reviews
        app.post('/reviews/add', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

    // add a new service from client side
        app.post('/addservice', async(req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        })

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

    //geting each service review
        app.get('/reviews', async(req, res) => {
            let query = {};
            if(req.query.name){
                query ={
                    name: req.query.name
                }
            }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

    //get my review based on user email
        app.get('/myreview', async(req, res) => {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
    
    // update review 
        app.get('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await reviewCollection.findOne(query);
            res.send(result);
        })
        
    //Update review
        app.put('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id:ObjectId(id)};
            const prev = req.body;
            const option = {upsert: true};
            const updatedDoc = {
                $set:{
                    name: prev.name,
                    img: prev.img,
                    email: prev.email,
                    review: prev.review,
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedDoc, option);
            res.send(result);
        })

    // delete user review by id 
        app.delete('/myreview/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
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