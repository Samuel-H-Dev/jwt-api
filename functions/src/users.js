import { db } from "./dbConnect.js";
import { hash } from "bcrypt";
import jwt  from "jsonwebtoken";
import { ObjectId } from "mongodb"
import { secrets, salt } from "../creds.js";

const coll = db.collection('users')

export async function signup(req,res){
  const { email, password } = req.body

  const hashedPassword = await hash(password, salt) //hashing password
  await coll.insertOne({ email: email.toLowerCase(), password: hashedPassword }) 
  login(req,res)
}

export async function login(req, res){
  const { email, password } = req.body
  const hashedPassword = await hash(password, salt) //hased for login 
  const user = await coll.findOne({ email: email.toLowerCase(), password: hashedPassword }) //checks for hashed password 
  if(!user){
    res.status(401).send({ message: "invalid email or password" })
    return
  }
  delete user.password //strip out password 
const token = jwt.sign(user, secrets)     //json web tokens
  res.send({ user, token })     //json web tokens
}


export async function getProfile(req, res){
//make sure the user has sent jwt 
if(!req.headers || req.header.authorization){
  res.status(401).send({message: "Not authorized"})
  return
}
const decoded = jwt.verify(req.headers.authorization, secrets)
const user = await coll.findOne({ _id: new ObjectId(decoded._id) })
res.send({ user })
}