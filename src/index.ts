import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { MongoHelper } from "./infra/helpers/mongo-helper"

const main = async () => {
  dotenv.config()
  const PORT = process.env.PORT || 3000

  const URL =
    process.env.MONGO_URL || "mongodb://localhost:27017/todo-crud-node"

  await MongoHelper.connect(URL)

  const app = express()
  app.use(cors())
  app.use(express.json())

  app.get("/", (req, res) => {
    res.send("Hello World mango")
  })

  app.listen(PORT, () => {
    console.log("Server is running on port 3000")
  })
}

main()
