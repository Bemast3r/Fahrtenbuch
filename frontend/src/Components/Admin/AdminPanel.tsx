import BenutzerRegistrieren from './BenutzerRegistrieren';
import Benutzerloeschen from './Benutzerloeschen';
import ModBenutzer from './ModBenutzer';

const AdminFormular = () => {

    return (
        <>
            <BenutzerRegistrieren></BenutzerRegistrieren>
            <Benutzerloeschen></Benutzerloeschen>
            <ModBenutzer></ModBenutzer>
        </>
    );
}

export default AdminFormular;
