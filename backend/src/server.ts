import app from './app'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || ''
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected")
        app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))
    })
    .catch((err) => console.error('DB connection error', err))