import 'express-async-errors'
import express from 'express'
import dotenv from 'dotenv'
const app = express()
dotenv.config()
import morgan from 'morgan'

import {dirname} from 'path'
import {fileURLToPath} from 'url'
import path from 'path'

import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'


const __dirname = dirname(fileURLToPath(import.meta.url))


// db and authenticateUser
import connectDB from './db/connect.js';

//routers
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

//middleware
import errorHandlerMiddleware from './middleware/error-handler.js';
import notFoundMiddleWare from './middleware/not-found.js';
import authenticateUser from "./middleware/auth.js"
import cookieParser from 'cookie-parser'


if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'))
}

app.use(express.static(path.resolve(__dirname,'./client/build')))
app.use(express.json());

app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.send("Welcome!")
});

app.get('/api/v1',(req,res)=>{
    res.json({ msg: 'hello!'})
});


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs',authenticateUser, jobsRouter)


app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'./client/build','index.html'))
})

app.use(notFoundMiddleWare)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000;

const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () =>{
            console.log('Server is listening on port '+ port)
        })
    }catch(error){
        console.log(error)
    }
}

start()