import BenutzerRegistrieren from './BenutzerRegistrieren';
import Benutzerbearbeiten from './BenutzerBearbeiten';
import Benutzerloeschen from './Benutzerloeschen';
import ModBenutzer from './ModBenutzer';

const AdminFormular = () => {

    return (
        <>
            <BenutzerRegistrieren></BenutzerRegistrieren>
            <Benutzerbearbeiten></Benutzerbearbeiten>
            <Benutzerloeschen></Benutzerloeschen>
            <ModBenutzer></ModBenutzer>
        </>
    );
}

export default AdminFormular;
