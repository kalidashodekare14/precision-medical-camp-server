const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())


// kalidashodekare14
// SuKtoXdyUrqLx5X9


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.iyb1ucb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const popularCollection = client.db("MedicalDB").collection("popular-medical-camp")
        const campsCollection = client.db("MedicalDB").collection("camps")

        app.get('/popular-medical-camp', async (req, res) => {
            const result = await popularCollection.find().toArray()
            res.send(result)
        })

        app.get('/popular-detail/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await popularCollection.findOne(query)
            res.send(result)
        })
        
        app.post('/popular-medical-camp', async(req, res) =>{
            const item = req.body
            const result = await popularCollection.insertOne(item)
            res.send(result)
        })

        app.patch('/popular-medical-camp/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const updateDoc = {
                $inc: {
                    participant_count: 1
                }
            }
            const result = await popularCollection.updateOne(query, updateDoc)
            res.send(result)
        })

        app.post('/camps', async (req, res) => {
            const item = req.body
            console.log(item)
            const result = await campsCollection.insertOne(item)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Prescision medical camp server is running')
})

app.listen(port, () => {
    console.log(`prescision medical camp is running port ${port}`)
})
