const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
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
        const registerCampCollection = client.db("MedicalDB").collection("register-camp")
        const usersCollcetion = client.db("MedicalDB").collection("users")
        const feedbackCollection = client.db("MedicalDB").collection("feedback-and-rating")
        const paymentHistroy = client.db("MedicalDB").collection("payment-history")

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


        app.get('/analytics/:email', async(req, res) =>{
            const email = req.email
            const query = {email: email}
            const result  = await registerCampCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/payment-history/:email', async (req, res) => {
            const email = req.email
            const query = {email: email}
            const result = await paymentHistroy.find(query).toArray()
            res.send(result)
        })




        // Organizer
        app.patch('/register-camp/:id', async (req, res) => {
            const camp = req.body
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    confirmmation_status: "Comfirmed",
                    feedback: "Feedback"
                }
            }
            const result = await registerCampCollection.updateOne(filter, updateDoc)
            res.send(result)
        })


        app.patch('/update-status/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    payment_status: "Paid"
                }
            }
            const result = await registerCampCollection.updateOne(filter, updateDoc)
            res.send(result)
        })


        app.patch('/payment-history/:id', async (req, res) => {
            const id = req.params.id
            const filter = { camp_id: id }
            const updateDoc = {
                $set: {
                    confirmation_status: "Comfirmed"
                }
            }
            const result = await paymentHistroy.updateOne(filter, updateDoc)
            res.send(result)
        })


        // participent 
        app.get('/register-camp/:email', async (req, res) => {
            const email = req.email
            const query = { email: email }
            const result = await registerCampCollection.find(query).toArray()
            res.send(result)
        })


        app.get('/camp-register/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await registerCampCollection.findOne(query)
            res.send(result)
        })



        app.post('/popular-medical-camp', async (req, res) => {
            const item = req.body
            const result = await popularCollection.insertOne(item)
            res.send(result)

        })

        app.post('/rating-feedback', async (req, res) => {
            const feedback = req.body
            const result = await feedbackCollection.insertOne(feedback)
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
            const result = await registerCampCollection.insertOne(item)
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
                    location: manage.location,
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

        app.delete('/register-camp/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await registerCampCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/payment-history', async (req, res) => {
            const history = req.body
            const result = await paymentHistroy.insertOne(history)
            res.send(result)
        })

        // payment intent

        app.post("/create-payment-intent", async (req, res) => {
            const { price } = req.body;
            const amount = parseInt(price * 100);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types: ['card']
            })

            res.send({
                clientSecret: paymentIntent.client_secret
            })
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
