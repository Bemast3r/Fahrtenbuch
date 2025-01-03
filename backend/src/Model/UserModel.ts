import { Model, model, Schema, Types } from "mongoose";
import { hash, compare } from "bcryptjs";

/**
 * Interface with the appointed properties
 */
export interface IUser {
    vorname: string
    name: string
    username: string
    email: string
    password: string
    admin?: boolean
    createdAt?: Date
    modUser: {
        users: string
        name: string
    }[];
    mod?: boolean
    abwesend: string
}

export interface IUserMethods {
    isPasswordCorrect(c: string): Promise<boolean>
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel>({
    vorname: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    mod: { type: Boolean, default: false },
    createdAt: { type: Date },
    modUser: [
        {
            users: { type: String },
            name: { type: String }
        }
    ],
    abwesend: { type: String }
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
