import { Model, model, Schema, Types } from "mongoose";
import { User } from "./UserModel";

interface IFahrt {
    fahrer: Types.ObjectId; // User
    kennzeichen: Types.ObjectId; // Referenz auf das Kennzeichenmodell
    kilometerstand: number; //kilometerstand    
    kilometerende: number; //Kilometerstand am Ende 
    lenkzeit: number; // Arbeit mit Fahren
    pause: number // Normal Pause
    arbeitszeit: number; // Arbeiten ohne Fahren
    createdAt: Date; // Wann es gestartet worden ist
}

type FahrtModel = Model<IFahrt>;

const fahrtSchema = new Schema<IFahrt>({
    fahrer: { type: Schema.Types.ObjectId, ref: User, required: true },
    kennzeichen: { type: Schema.Types.ObjectId, ref: User, required: true },
    kilometerstand: { type: Number, required: true },
    kilometerende: { type: Number, required: true },
    lenkzeit: { type: Number, required: true },
    arbeitszeit: { type: Number, required: true },
    pause: { type: Number, required: true },
    createdAt: { type: Date },
}, { timestamps: true });

export const Fahrt = model<IFahrt, FahrtModel>("Fahrt", fahrtSchema);
