import React, { createContext, useContext, useMemo, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatProduct, setChatProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");

  const value = useMemo(
    () => ({
      chatProduct,
      setChatProduct,
      selectedColor,
      setSelectedColor,
    }),
    [chatProduct, selectedColor],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
