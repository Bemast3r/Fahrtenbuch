import { User } from "db/UserModel";

// Admin kann alle User holen
export async function getUsers(){}
// Admin kann user ändern
export async function changeUser(){}
// User kann sein Auto wechseln
export async function createUser(){}

// Erstelle User nur admin
// export async function createUser(userResource: UserResource): Promise<UserResource> {
//     const user = await User.create({
//         name: userResource.name,
//         email: userResource.email.toLowerCase(),
//         admin: userResource.admin,
//         password: userResource.password
//     });
//     return { id: user.id, name: user.name, email: user.email, admin: user.admin! }
// }

// deleteUser
export async function deleteUser(){}


