import express from "express";
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import chargerRoutes from './routes/charger.routes';
import { setupSwagger } from "./utils/swagger";

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_ORIGIN
];
const app = express()
app.use(cors({
    origin: (origin, callback) => {
        console.log("cors incoming request", origin)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chargers', chargerRoutes);

//Swagger Docs
setupSwagger(app)

export default app;


