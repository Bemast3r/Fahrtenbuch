import { UserResource } from "db/Resources";

// // Admin kann alle Fahrten sehen.
export async function getFahrten() { }
// // User kann seine Fahrten sehen
export async function getMeineFahrten(user: UserResource) { }
// // Admin holt sich die Fahrten von einem User
export async function getUserFahrten(user: UserResource) { }
// // User erstellt eine Fahrt.
// export const createFahrt = async (req, res) => {}
export async function createUserFahrt(user: UserResource) { }
// // Admin kann im nachträglich sachen bearbeiten. 
export async function updateUserfahrt(user: UserResource) { }
// // Admin kann Fahrten löschen 
export async function deleteFahrt(userid: string) { }
