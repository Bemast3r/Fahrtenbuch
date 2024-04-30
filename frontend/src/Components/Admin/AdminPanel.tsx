import BenutzerRegistrieren from './BenutzerRegistrieren';
import Benutzerbearbeiten from './BenutzerBearbeiten';
import Benutzerloeschen from './Benutzerloeschen';
import ModBenutzer from './ModBenutzer';

const AdminFormular = () => {

    return (
        <>
            <BenutzerRegistrieren />
            <Benutzerbearbeiten />
            <Benutzerloeschen />
            <ModBenutzer />
        </>
    );
}

export default AdminFormular;
