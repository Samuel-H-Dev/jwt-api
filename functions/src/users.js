import { db } from "./dbConnect.js";
import jwt  from "jsonwebtoken";
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