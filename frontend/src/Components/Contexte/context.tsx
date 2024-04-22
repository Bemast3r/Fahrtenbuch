import React, { useContext } from 'react';
import { useFahrten } from '../Context/FahrtenContext';
import { FahrtResource } from '../../util/Resources';

// Importe und andere Teile...

const FahrtenContent = () => {
  const fahrten = useFahrten();

  return (
    <div>
      <h2>Contexte</h2>
      {fahrten && fahrten.fahrten ? (
        <div>
          <h1>Hello</h1>
          {fahrten.fahrten.map((fahrt) => (
            <div key={fahrt.id}>
              {Object.entries(fahrt).map(([key, value], index) => (
                <p key={`${fahrt.id}-${key}-${index}`}>
                  {key}: {renderValue(value)}
                </p>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>Fahrten nicht verfügbar</p>
      )}
    </div>
  );
};

const renderValue = (value: any): React.ReactNode => {
  if (Array.isArray(value)) {
    if (value.length > 0 && value[0] instanceof Date) {
      return value.map((date, index) => (
        <span key={index}>{date.toLocaleString()}{index !== value.length - 1 && ', '}</span>
      ));
    }
    return value.join(', ');
  } else if (value instanceof Date) {
    return value.toLocaleString();
  }
  return value;
};

export default FahrtenContent;
