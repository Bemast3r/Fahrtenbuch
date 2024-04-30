import { useState, useEffect } from 'react';
import { getAlleModUser, getMods, getUsers, updateUser } from '../../Api/api';
import { UserResource } from '../../util/Resources';
import { ListGroup } from 'react-bootstrap';

const ModBenutzer = () => {
    const [mods, setMods] = useState<UserResource[]>([]);
    const [users, setUsers] = useState<UserResource[]>([]);
    const [selectedMod, setSelectedMod] = useState<UserResource | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<UserResource[]>([]);
    const [modListe, setModListe] = useState<{ users: string, name: string }[]>([])
    const [payload, setPayload] = useState<{ users: string, name: string }[]>([])


    useEffect(() => {
        fetchMods();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedMod) {
            updateModList(selectedMod)
        }
    }, [selectedMod, mods])

    useEffect(() => {
        const transformedData = selectedUsers.map(user => ({
            users: user.id!,
            name: user.vorname + " " + user.name
        }));
        setPayload(transformedData);
    }, [selectedUsers]);


    useEffect(() => {
        if (modListe.length > 0) {
            const modUserIds = modListe.map(user => user.users);
            const filteredUsers = users.filter(user => modUserIds.includes(user.id!));
            setSelectedUsers(filteredUsers);
        }
    }, [modListe]);


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

    async function updateModList(mod: UserResource) {
        if (mod.modUser) {
            setModListe(mod.modUser);
        } else {
            console.log("Keine Id bei dem Moderator.")
        }
    }

    const handleModSelect = (mod: UserResource) => {
        if (selectedMod && selectedMod.id === mod.id) {
            setSelectedMod(mod)
            setSelectedUsers([])
            updateModList(mod)
        } else {
            setSelectedMod(mod);
            updateModList(mod)
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



    const addUserToMod = async () => {
        try {
            if (!selectedMod || selectedUsers.length === 0) {
                // Kein ausgewählter Moderator oder keine ausgewählten Benutzer
                return;
            }

            const modId = selectedMod._id!;

            // Ersetze das Mod-User-Array des ausgewählten Moderators durch den Payload
            const updatedModData: UserResource = {
                ...selectedMod,
                id: modId,
                modUser: payload
            };

            const response = await updateUser(updatedModData);
            if (response !== null) {
                // Aktualisiere die Liste der Moderatoren
                const index = mods.findIndex(mod => mod._id === selectedMod._id)
                mods[index] = response
                updateModList(response)
            }
        } catch (error) {
            // Fehlerbehandlung
        }
    };



    return (
        <div className="form-wrapper-loesch">
            <div className="form-container-loesch">
                <h1 className="form-header2">Benutzer einem Supervisor zuweisen</h1>
                <div className="containerModBen">
                    <span className="Moderatordiv">
                        <h2>Supervisor</h2>
                        <ListGroup>
                            {mods.map(mod => (
                                <ListGroup.Item key={mod.id} action active={selectedMod?.email === mod.email} onClick={() => handleModSelect(mod)}>
                                    <input type="checkbox" checked={selectedMod?.email === mod.email} readOnly />
                                    <label className="moderatoritems" style={{ margin: "5px" }}>{mod.name}</label>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </span>
                    <span className="Benutzerdiv">
                        <h2>Fahrer</h2>
                        <ListGroup>
                            {selectedMod && users.map(user => (
                                <ListGroup.Item key={user.id} action onClick={() => handleUserSelect(user)}>
                                    <input type="checkbox" checked={selectedUsers.some(modUser => modUser.id === user.id)} readOnly />
                                    <label className="benutzeritems" style={{ color: selectedUsers.some(selectedUser => selectedUser.id === user.id) ? 'gray' : 'black' , margin: "5px"}}> {user.vorname +  " " + user.name}</label>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </span>
                    <span className="Benutzerdiv">
                        <h2>Bereits hinzugefügt</h2>
                        <ListGroup>
                            {modListe.map((user, index) => (
                                <ListGroup.Item key={index}>
                                    <label className="benutzeritems"  style={{ margin: "5px" }}> {user.name}</label>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </span>
                </div>
                <br></br>
                <br></br>
                <br /><br />
                <button className="submit-button-beginnen" onClick={addUserToMod}>
                    Fahrer zuweisen
                </button>

            </div>
            <br></br>
            <br></br>
            <br></br>

        </div>
    );
};

export default ModBenutzer;
