import { customerV1, sellerV1 } from './routes/app';
import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/v1', customerV1.routing('customer'))
app.use('/v1', sellerV1.routing('seller'))


app.listen(port, () => {
    console.log('success')
})