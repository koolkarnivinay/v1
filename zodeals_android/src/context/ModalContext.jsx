import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext({ pinModalVisible: false, openPinModal: () => {}, closePinModal: () => {} });

export function ModalProvider({ children }) {
  const [pinModalVisible, setPinModalVisible] = useState(false);
  return (
    <ModalContext.Provider value={{
      pinModalVisible,
      openPinModal: () => setPinModalVisible(true),
      closePinModal: () => setPinModalVisible(false),
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
