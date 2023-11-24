import React, { createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProjetoContext = createContext({
    addProjeto: async () => {},
  });

export const ProjetoProvider = ({ children }) => {
  const addProjeto = async (novoProjeto) => {
    const projetos = JSON.parse(await AsyncStorage.getItem('projetos')) || [];
    const index = projetos.findIndex((p) => p.nome === novoProjeto.nome);
  
    if (index !== -1) {
      projetos[index] = novoProjeto;
    } else {
      projetos.push(novoProjeto);
    }
  
    await AsyncStorage.setItem('projetos', JSON.stringify(projetos));
  };

  return (
    <ProjetoContext.Provider value={{ addProjeto }}>
      {children}
    </ProjetoContext.Provider>
  );
};