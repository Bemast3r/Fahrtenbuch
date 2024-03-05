import { Model, model, Schema, Types } from "mongoose";
import { User } from "./UserModel";

export interface IFahrt {
    fahrer: Types.ObjectId; // User
    kennzeichen: string; // Referenz auf das Kennzeichenmodell
    kilometerstand: number; //kilometerstand
    kilometerende: number; //Kilometerstand am Ende 
    lenkzeit: {
        start: Date;
        stop: Date;
    }[]; // Arbeit mit Fahren
    pause: {
        start: Date;
        stop: Date;
    }[] // Normal Pause
    arbeitszeit: {
        start: Date;
        stop: Date;
    }[]; // Arbeiten ohne Fahren
    createdAt: Date; // Wann es gestartet worden ist
    startpunkt: string
    beendet: Boolean
}

type FahrtModel = Model<IFahrt>;

const fahrtSchema = new Schema<IFahrt>({
    fahrer: { type: Schema.Types.ObjectId, ref: User, required: true },
    kennzeichen: { type: String, required: true },
    kilometerstand: { type: Number, required: true },
    kilometerende: { type: Number },
    lenkzeit: [{
        start: { type: Date },
        stop: { type: Date }
    }],
    arbeitszeit: [{
        start: { type: Date },
        stop: { type: Date }
    }],
    pause: [{
        start: { type: Date },
        stop: { type: Date }
    }], // weiß nicht ob das Sinnvoll ist aber mal sehen.
    createdAt: { type: Date },
    startpunkt: { type: String, required: true },
    beendet: { type: Boolean, default: false }
}, { timestamps: true });

export const Fahrt = model<IFahrt, FahrtModel>("Fahrt", fahrtSchema);

