import 'dotenv/config'

import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'
import Knex from 'knex'
import Joi from '@hapi/joi'
export const DeviceSchema = Joi.object().keys({
  id: Joi.number(),
  name: Joi.string().required(),
  status: Joi.string().required(),
  type: Joi.string().required(),
  location: Joi.string().required(),
  color: Joi.string().required(),
})

const {PORT = 8000} = process.env
const knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
})

// interface Device {
//   id: number
//   name: string
//   state: string
//   type: string
//   location: string
//   color: string
// }
const app = express()

app.use(bodyParser())
// interface User {
//   name: string
//   email: string
//   age?: number
// }
// const users: User[] = [
//   {
//     name: 'mim',
//     email: 'cc',
//   },
// ]

app.get('/', (_: Request, res: Response) => {
  res.send({status: 'OK'})
})

app.get('/me', (_: Request, res: Response) => {
  res.send({name: 'mim', age: '32'})
})
app.get('/ip', async (_: Request, res: Response) => {
  const {data} = await axios.get('https://icanhazip.com')
  res.send(data)
})

app.get('/devices', async (_, res) => {
  const data = await knex.select('*').from('devices')
  await res.send({data: data})
})

app.get('/devices/:id', async (req, res) => {
  const {id} = req.params
  const data = await knex
    .select('*')
    .from('devices')
    .where('id', id)
    .first()
  await res.send({data: data})
})
app.put('/devices/:id', async (req, res) => {
  const device = req.body
  try {
    await DeviceSchema.validate(device)

    const {id} = req.params
    await knex('devices')
      .where('id', id)
      .update({
        status: req.body.status,
        location: req.body.location,
        color: req.body.color,
      })
    const data = await knex
      .select('*')
      .from('devices')
      .where('id', id)
      .first()
    res.send({data: data})
  } catch (error) {
    res.status(400).send({error: error.message})
  }
})
app.post('/devices', async (req, res) => {
  const device = req.body
  await knex.insert(device).into('devices')
  res.send({success: true})
})

app.delete('/devices/:id', async (req, res) => {
  await knex('devices')
    .where('id', req.params.id)
    .del()
  res.send({success: true})
})

app.listen(PORT, () => {
  console.log(`Server started at 0.0.0.0:${PORT}`)
})
