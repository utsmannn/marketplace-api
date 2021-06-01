import * as v1 from './routes/app-v1';
import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/v1', v1.seller)
app.use('/v1', v1.customer)


app.listen(port, () => {
    console.log('restart..')
    console.log(`\n`)
    console.log(`---------`)
    console.log(`success..`)
    console.log(`\n`)
})