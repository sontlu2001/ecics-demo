'use client';

import { createContext, useContext } from 'react';

interface InsuranceLayoutContextProps {
  handleBack: () => void;
}

export const InsuranceLayoutContext = createContext<
  InsuranceLayoutContextProps | undefined
>(undefined);

export const useInsurance = () => {
  const context = useContext(InsuranceLayoutContext);
  if (!context) {
    throw new Error('useInsurance must be used within an InsuranceProvider');
  }
  return context;
};
