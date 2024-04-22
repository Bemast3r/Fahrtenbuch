import React from 'react';
import { FahrtResource } from '../../util/Resources';

interface ModalProps {
    fahrt: FahrtResource;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ fahrt, onClose }) => {
    console.log("Modal rendered with fahrt:", fahrt);
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Fahrzeugdetails</h2>
                <p>Fahrer: {fahrt.vollname}</p>
                <p>Dauer der Fahrt: {fahrt.totalArbeitszeit! + fahrt.totalLenkzeit! + fahrt.totalRuhezeit!}</p>
                <p>Status: {fahrt.beendet ? 'Beendet' : 'Läuft noch'}</p>
            </div>
        </div>
    );
}


export default Modal;
