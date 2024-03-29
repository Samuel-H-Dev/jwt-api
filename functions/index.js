import express from 'express'
import { onRequest } from "firebase-functions/v2/https"
import cors from 'cors'
import { signup, login, getProfile } from './src/users.js'

const app = express()

app.use(cors())
app.use(express.json())


//routes
app.post("/signup", signup)    
app.post("/login", login)



//protected (authenticated users only)
 app.get("/profile", getProfile)
// app.patch("/profile")


export const api = onRequest(app)