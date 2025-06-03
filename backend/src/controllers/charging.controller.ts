import { Request, Response } from 'express';
import ChargingStation from '../models/ChargingStation';

// create a new station
export const createChargingStation = async (req: Request, res: Response) => {
    try {
        const newStation = await ChargingStation.create(req.body)
        res.status(201).json(newStation);
    } catch (err) {
        res.status(400).json({ msg: 'Failed to create Station', error: err });
    }
};

// get all station with basic filterign
export const getAllChargingStations = async (req: Request, res: Response) => {
    try {
        const query: any = {}
        if (req.query.status) query.status = req.query.status;
        if (req.query.connectorType) query.connectorType = req.query.connectorType;
        if (req.query.minPowerOutput) query.powerOutput = { $gte: Number(req.query.minPowerOutput) };

        const stations = await ChargingStation.find(query);
        res.json(stations);
    } catch (err) {
        res.status(500).json({ msg: 'Failed to fetch stations' });
    }
}

// get a single station
export const getSingleStation = async (req: Request, res: Response) => {
    try {
        const query = req.params.id
        const station = await ChargingStation.findById(query)
        if (!station){
            res.status(404).json({ msg: 'Station not found'})
            return
        }
        res.json(station)
    } catch (err) {
        res.status(400).json({ msg: 'Failed to find station'})
    }
}

// Update Station
export const updateStation = async (req: Request, res: Response) => {
    try {
        const query = req.params.id;
        const updated = await ChargingStation.findByIdAndUpdate(query, req.body, {new: true});
        if (!updated) {
            res.status(404).json({ msg: 'Station does not exists'})
            return
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ msg: 'Failed to update the station'})
    }
}

// Deleting a Station
export const deleteStation = async (req: Request, res: Response) => {
    try {
        const query = req.params.id
        const deleted = await ChargingStation.findByIdAndDelete(query)
        if (!deleted) {
            res.status(404).json({ msg: 'Station could not be found'})
        }
        res.json({ msg: 'Station successfully deleted'})
    } catch (err) {
        res.status(500).json({ msg: 'Failed to delete the dictionary'})
    }
}