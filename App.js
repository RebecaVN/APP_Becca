import React, { createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EditarProjeto from './pages/EditarProjeto';
import CriarProjeto from './pages/NovoProjeto';
import Login from './pages/Login';
import Home from './pages/Home';
import { ProjetoProvider } from './context/ProjetoContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ProjetoProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ title: '' }}>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CriarProjeto" component={CriarProjeto} />
          <Stack.Screen name="EditarProjeto" component={EditarProjeto} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProjetoProvider>
  );
};

export default App;