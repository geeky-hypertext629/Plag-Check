import express from 'express'
import cors from 'cors'
import http from 'http'
import cookieParser from "cookie-parser";


const app = express()

app.use(cors({
    origin: '*'
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser());

const server = http.createServer(app)

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'This is plag check server' });
});



export default app