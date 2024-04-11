import { Model, model, Schema, Types } from "mongoose";
import { User } from "./UserModel";

export interface IFahrt {
    fahrer: Types.ObjectId; // User
    vollname?: string;
    kennzeichen: string; // Referenz auf das Kennzeichenmodell
    kilometerstand: number; // Kilometerstand
    kilometerende?: number; // Kilometerstand am Ende 
    lenkzeit?: Date[]; // Arbeit mit Fahren
    pause?: Date[]; // Pausen
    arbeitszeit?: Date[]; // Arbeitszeiten ohne Fahren
    createdAt: Date; // Wann es gestartet wurde
    startpunkt: string;
    endpunkt?: string;
    beendet: boolean;
    ruhezeit?: { start: Date; stop?: Date }[];
    abwesend?: string;
    totalLenkzeit?: number;
    totalArbeitszeit?: number;
    totalPause?: number;
    totalRuhezeit?: number;
}

type FahrtModel = Model<IFahrt>;

const fahrtSchema = new Schema<IFahrt>({
    fahrer: { type: Schema.Types.ObjectId, ref: User, required: true },
    vollname: { type: String },
    kennzeichen: { type: String, required: true },
    kilometerstand: { type: Number },
    kilometerende: { type: Number },
    lenkzeit: [{ type: Date }], // Array von Datumswerten für Lenkzeit
    arbeitszeit: [{ type: Date }], // Array von Datumswerten für Arbeitszeit ohne Fahren
    pause: [{ type: Date }], // Array von Datumswerten für Pausen
    createdAt: { type: Date },
    startpunkt: { type: String, required: true },
    endpunkt: { type: String },
    beendet: { type: Boolean, default: false },
    ruhezeit: [{
        start: { type: Date },
        stop: { type: Date, required: false }
    }],
    abwesend: { type: String },
    totalLenkzeit: { type: Number },
    totalArbeitszeit: { type: Number },
    totalPause: { type: Number },
    totalRuhezeit: { type: Number }
}, { timestamps: true });

export const Fahrt = model<IFahrt, FahrtModel>("Fahrt", fahrtSchema);
