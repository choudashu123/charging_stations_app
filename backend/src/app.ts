import express from "express";
import cors from 'cors';
import authRoutes from './routes/auth.routes';
// import chargerRoutes from './routes/charger.routes';

const app = express()
app.use(cors())
app.use(express.json());

app.use('/api/auth', authRoutes);
// app.use('/api/chargers', chargerRoutes);

export default app;


