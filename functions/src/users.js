import { db } from "./dbConnect.js";
import jwt  from "jsonwebtoken";
import { ObjectId } from "mongodb"
import { secrets } from "../creds.js";

const coll = db.collection('users')

export async function signup(req,res){
  const { email, password } = req.body
  await coll.insertOne({ email: email.toLowerCase(), password }) //password stored as plain text (deal with this later)
  login(req,res)
}

export async function login(req, res){
  const { email, password } = req.body
  const user = await coll.findOne({ email: email.toLowerCase(), password })
  delete user.password //strip out password 
const token = jwt.sign(user, secrets)
  res.send({ user, token })
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