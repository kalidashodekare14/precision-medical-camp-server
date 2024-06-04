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
        const usersCollcetion = client.db("MedicalDB").collection("users")

        app.post('/users', async (req, res) => {
            const user = req.body
            const query = { email: user.email }
            const existingUser = await usersCollcetion.findOne(query)
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await usersCollcetion.insertOne(user)
            res.send(result)
        })

        // Organizer instead of admin
        app.get('/users/organizer/:email', async (req, res) => {
            // DOTO: verify and email check
            const email = req.params.email
            const query = { email: email }
            const user = await usersCollcetion.findOne(query)
            console.log(user)
            let organizer = false
            if (user) {
                organizer = user?.role === 'admin';
            }
            res.send({ organizer })
        })

        app.get('/popular-medical-camp', async (req, res) => {
            const result = await popularCollection.find().toArray()
            res.send(result)
        })

        app.get('/popular-medical-camp/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await popularCollection.findOne(query)
            res.send(result)
        })

        app.get('/popular-detail/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await popularCollection.findOne(query)
            res.send(result)
        })



        app.post('/popular-medical-camp', async (req, res) => {
            const item = req.body
            const result = await popularCollection.insertOne(item)
            res.send(result)

        })

        app.patch('/popular-medical-camp/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
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

        app.patch('/manage-update/:id', async (req, res) => {
            const manage = req.body
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    camp_name: manage.camp_name,
                    healthcare_professional: manage.managehealthcare_professional,
                    date_and_time: manage.date_and_time,
                    location: manage. location,
                    camp_fees: manage.camp_fees,
                    description: manage.description,
                    image: manage.image
                    
                }
            }
            const result = await popularCollection.updateOne(filter, updateDoc)
            res.send(result)
        })


        app.delete('/popular-medical-camp/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await popularCollection.deleteOne(query)
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
