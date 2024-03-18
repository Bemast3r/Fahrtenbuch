import { useEffect, useState } from "react"
import { FahrtResource, UserResource } from "../util/Resources"
import { getLoginInfo } from "./Logincontext"
import { getFahrt, getUser } from "../Api/api"
import Loading from "./LoadingIndicator"
import ExpandFahrt from "./ExpandFahrt"

const UserFahrten: React.FC = () => {
    const [user, setUser] = useState<UserResource | null>(null);
    const [meineFahrten, setMeineFahrten] = useState<FahrtResource[] | []>([]);

    async function getU() {
        const id = getLoginInfo();
        const userData = await getUser(id!.userID);
        setUser(userData);
        const fahrten = await getFahrt(id!.userID);
        console.log(fahrten);
        setMeineFahrten(fahrten);
    }

    useEffect(() => {
        getU();
    }, []);

    return (
        <>
            {user ? (
                <>
                    <h1>Hallo, {user.vorname + " " + user.name}</h1>
                    <p>Hier sind ihre Statistiken</p>
                    {meineFahrten.length > 0 ? (
                        <>
                            {meineFahrten.map((fahrt) => (
                                <ExpandFahrt fahrt={fahrt}></ExpandFahrt>
                            ))}
                        </>
                    ) : (
                        <p>Keine Fahrten gefunden</p>
                    )}
                </>
            ) : (
                <Loading />
            )}
        </>
    );

};

export default UserFahrten