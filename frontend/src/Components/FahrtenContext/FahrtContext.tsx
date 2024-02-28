import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FahrtResource } from '../../util/Resources';

export type FahrtContextType = {
    fahrten: FahrtResource[];
    setFahrten:Function
};

export const FahrtContext = React.createContext<FahrtContextType>({
    fahrten: [],
    setFahrten: () => {} // Placeholder function
});
