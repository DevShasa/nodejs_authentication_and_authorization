const express = require('express')
const Datastore = require('nedb-promises')
const bcrypt = require('bcryptjs')

const app = express()
app.use(express.json())


// simulat euser table
const users = Datastore.create('Users.db')

app.get('/', (req, res)=>{
    res.send("REST API Authentication and Authorization")
})

app.post('/api/auth/register', async(req, res)=>{
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password){
            return res.status(422).json(({
                message: "Please fill in all fields"
            }))
        }

        // check if curent user exist
        if(await users.findOne({email:email})) return res.status(409).json({message:"Email already exists"})

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await users.insert({
            name, 
            password: hashedPassword, 
            email
        })

        // new user created
        return res.status(201).json({
            message: "User registered successfuly",  
            id: newUser._id,
        });

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
})


app.post('/api/auth/login', async(req, res)=>{
    try {
        const {email, password} = req.body
        const user = await users.findOne({email})
    } catch (error) {
        return res.status(500).json({message:error.message})

    }
})

app.listen(3000, ()=>console.log("Server started on port 3000"))