import express, { json } from 'express' 
import router from './routes/router.js'


const app = express()

app.use("/api", router)


const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})