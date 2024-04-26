import { useState, useEffect } from 'react';
import { getMods, getUsers, updateUser } from '../../Api/api';
import { UserResource } from '../../util/Resources';

const ModBenutzer = () => {
    const [mods, setMods] = useState<UserResource[]>([]);
    const [users, setUsers] = useState<UserResource[]>([]);
    const [selectedMod, setSelectedMod] = useState<UserResource | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<UserResource[]>([]);

    useEffect(() => {
        fetchMods();
        fetchUsers();
    }, []);

    const fetchMods = async () => {
        try {
            const response = await getMods();
            setMods(response);
        } catch (error) {
            console.error('Fehler beim Abrufen der Moderatoren:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            // Filtere die Benutzer, um nur diejenigen zu behalten, die weder Admins noch Mods sind
            const normalUsers = response.filter(user => !user.admin && !user.mod);
            setUsers(normalUsers);
        } catch (error) {
            console.error('Fehler beim Abrufen der Benutzer:', error);
        }
    };


    const handleModSelect = (mod: UserResource) => {
        if (selectedMod && selectedMod.id === mod.id) {
            // Wenn der ausgewählte Mod bereits der aktuelle Mod ist, füge die ausgewählten Benutzer hinzu
            setSelectedMod(mod)
            setSelectedUsers([])
        } else {
            // Setze den ausgewählten Mod und lösche die ausgewählten Benutzer
            setSelectedMod(mod);
            setSelectedUsers([]);
        }
    };


    const handleUserSelect = (user: UserResource) => {
        setSelectedUsers(prevSelectedUsers => {
            const userIndex = prevSelectedUsers.findIndex(prevUser => prevUser.id === user.id);
            if (userIndex !== -1) {
                return prevSelectedUsers.filter((_, index) => index !== userIndex);
            } else {
                return [...prevSelectedUsers, user];
            }
        });
    };

    const isUserDisabled = (userId: string) => {
        if (selectedMod && selectedMod.modUser && selectedMod.modUser.length > 0 && selectedMod.modUser[0].users) {
            return selectedMod.modUser[0].users.includes(userId);
        } else {
            return false;
        }
    };


    const handleAddUsersToMod = async () => {
        const ids = selectedUsers.map(user => user.id).filter(id => typeof id === 'string');
        try {
            if (selectedMod && ids.length > 0) {
                // Kopiere die vorherigen Mod-Benutzer
                const existingModUsers = selectedMod.modUser || [];
                const newModUsers = [
                    ...existingModUsers,
                    ...ids.map(userId => ({ users: userId as string }))
                ];
    
                const newModUser: UserResource = {
                    ...selectedMod,
                    id: selectedMod._id!, // Umbenennen von _id zu id
                    modUser: newModUsers
                };
    
                // Fügen Sie hier die Logik hinzu, um das neue Mod-Benutzer-Objekt zu verwenden
                await updateUser(newModUser);
                // console.log(sendmod);
                fetchMods();
                fetchUsers();
            }
        } catch (error) {
            // Handle error
        }
    };
    
    

    return (
        <div className="form-wrapper-loesch">
    <div className="form-container-loesch">
        <h1 className="form-header2">Moderator zuweisen</h1>
        <div className="containerModBen">
            <span className="Moderatordiv">
                <h2>Moderatoren</h2>
                <ul>
                    {mods.map(mod => (
                        <li key={mod.id}>
                            <input type="checkbox" checked={selectedMod?.email === mod.email} onChange={() => handleModSelect(mod)} />
                            <label className="moderatoritems">{mod.name}</label>
                        </li>
                    ))}
                </ul>
            </span>
            <span className="Benutzerdiv">
                <h2>Benutzer</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            <input type="checkbox" checked={selectedUsers.some(selectedUser => selectedUser.id === user.id)} disabled={user.id ? isUserDisabled(user.id!) : false} onChange={() => handleUserSelect(user)} />
                            <label className="benutzeritems" style={{ color: selectedUsers.some(selectedUser => selectedUser.id === user.id) ? 'gray' : 'black' }}>{user.name}</label>
                        </li>
                    ))}
                </ul>
            </span>
        </div>
        <br></br>
        <br></br>
        <button className="submit-button-beginnen" disabled={!selectedMod || (selectedMod && selectedUsers.length === 0)} onClick={handleAddUsersToMod}>
            Fahrer zuweisen
        </button>
    </div>
</div>

    
    );
};

export default ModBenutzer;
