import { NextFunction, Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing){
            res.status(400).json({ msg: "Email already exists" });
            return 
        }

        const hashed = await bcrypt.hash(password, 10)
        const newUser = await User.create({ username, email, password: hashed });

        res.status(201).json({ msg: "User registered", user: newUser });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}

export const login = async (req: Request, res:Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user){
            res.status(400).json({ msg: "Email not found"});
            return
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            res.status(400).json({ msg: "Invalid credentials" });
            return
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d'});
        res.json({token});
    } catch (err) {
        res.status(500).json({ msg: 'Server error'});
    }
};