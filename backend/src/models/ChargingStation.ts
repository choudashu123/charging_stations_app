import mongoose, {Document, Schema} from "mongoose";

export interface IChargingStation extends Document {
    name: string, 
    location : {
        latitude: number;
        longitude: number;
    };
    status : 'Active' | 'Inactive';
    powerOutput: number;
    connectorType: string;
}

const ChargingStationSchema: Schema = new Schema<IChargingStation>({
    name: {type: String, required: true},
    location : {
        latitude : {type: Number, required: true},
        longitude : {type: Number, required: true},
    },
    status : { type: String, enum: ['Active', 'Inactive'], required: true},
    powerOutput : {type: Number, required: true},
    connectorType : { type: String, required: true},
});

export default mongoose.model<IChargingStation>("ChargingStation", ChargingStationSchema)