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
        const ids = selectedUsers.map(user => user.id);
        try {
            if (selectedMod && ids.length > 0) {
                const newModUser: UserResource = {
                    ...selectedMod,
                    id: selectedMod._id!, // Umbenennen von _id zu id
                    modUser: [
                        {
                            users: ids.join(',')
                        }
                    ]
                };
                // Fügen Sie hier die Logik hinzu, um das neue Mod-Benutzer-Objekt zu verwenden
                await updateUser(newModUser);
                // console.log(sendmod);
                fetchMods()
                fetchUsers()
            }
        } catch (error) {

        }

    };



    return (
        <div className="form-wrapper-loesch">
            <div className="form-container-loesch">
                <div style={{ float: 'left', width: '50%' }}>
                    <h2>Moderatoren</h2>
                    <ul>
                        {mods.map(mod => (
                            <ol key={mod.id}>
                                <input type="checkbox" checked={selectedMod?.email === mod.email ? true : false} onChange={() => handleModSelect(mod)} />
                                <label style={{ marginLeft: '5px' }}>{mod.name}</label>
                            </ol>
                        ))}

                    </ul>
                </div>
                <div style={{ float: 'right', width: '50%' }}>
                    <h2>Benutzer</h2>
                    <ul>
                        {users.map(user => (
                            <ul key={user.id}>
                                <input type="checkbox" checked={selectedUsers.some(selectedUser => selectedUser.id === user.id)} disabled={user.id ? isUserDisabled(user.id!) : false} onChange={() => handleUserSelect(user)} />
                                <label style={{ marginLeft: '5px', color: selectedUsers.some(selectedUser => selectedUser.id === user.id) ? 'gray' : 'black' }}>{user.name}</label>
                            </ul>
                        ))}
                    </ul>
                </div>
                <button disabled={!selectedMod || (selectedMod && selectedUsers.length === 0)} onClick={handleAddUsersToMod}>
                    Ausgewählte Benutzer hinzufügen
                </button>

            </div>
        </div>
    );
};

export default ModBenutzer;
