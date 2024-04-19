import { User } from "../../Model/UserModel"

/**
 * Checks email and password and upon success returns the user's ID and name, with success set to true. 
 * If no user with the given email exists or the password is incorrect, only success is returned as false. 
 */
export async function login(username: string, password: string): Promise<{ success: boolean, id?: string, username?: string, role?: "u" | "a"  }> {
    if (!password) {
        throw new Error("password is not defined");
    }
    const user = await User.findOne({ username: username }).exec();
    // Check if user exists
    if (!user) {
        return { success: false };
    }
    // Check if password is correct
    if (!(await user.isPasswordCorrect(password))) {
        return { success: false };
    }
    
    if (user.admin) {
        // If admin give role "a"
        return { success: true, id: user._id.toString(), username: user.username, role: "a" };
    } else {
        // If not admin give role "u" for normal user
        return { success: true, id: user._id.toString(), username: user.username, role: "u" };
    }
};

