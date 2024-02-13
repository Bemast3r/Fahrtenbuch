import { Model, model, Schema } from "mongoose";
import { hash, compare } from "bcryptjs";

/**
 * Interface with the appointed properties
 */
export interface IUser {
    name: string
    nachname: string
    username:string
    password: string
    admin?: boolean
    createdAt?: Date
    fahrzeuge: {
        datum: Date;
        kennzeichen: string;
    }[];
}

export interface IUserMethods {
    isPasswordCorrect(c: string): Promise<boolean>
}

type UserModel = Model<IUser, {}, IUserMethods>;


const userSchema = new Schema<IUser, IUserMethods>({
    name: { type: String, required: true },
    username: { type: String, required: true, unique:true },
    nachname: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    createdAt: { type: Date },
    fahrzeuge: [{
        datum: { type: Date, required: true, default: Date.now },
        kennzeichen: { type: String, required: true }
    }]
}, { timestamps: true });

userSchema.method("isPasswordCorrect", async function (passwordCandidate: string): Promise<boolean> {
    if (this.isModified()) {
        throw new Error("User has been modified");
    }
    const result = await compare(passwordCandidate, this.password);
    return result;
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashedPassword = await hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
});

export const User = model<IUser, UserModel>("User", userSchema);
