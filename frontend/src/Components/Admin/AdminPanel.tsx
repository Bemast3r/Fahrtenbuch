import BenutzerRegistrieren from './BenutzerRegistrieren';
import Benutzerbearbeiten from './BenutzerBearbeiten';
import Benutzerloeschen from './Benutzerloeschen';
import ModBenutzer from './ModBenutzer';
import ProtectedComponent from '../../util/Components/PreotectComponent';

const AdminFormular = () => {

    return (
        <>
            <ProtectedComponent requiredRole='a'>
                <BenutzerRegistrieren />
                <Benutzerbearbeiten />
                <Benutzerloeschen />
                <ModBenutzer />
            </ProtectedComponent>
        </>
    );
}

export default AdminFormular;
