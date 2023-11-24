import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showToastError from '../components/toast/toastError';

  const Login = ({navigation}) => {

    useEffect(() => {
      const getName = async () => {
        const name = await AsyncStorage.getItem('name');
        if (name) {
          navigation.navigate('Home');
        }
      };
      getName();
    }, []);
  
    const [name, setName] = useState('');
  
    const handleNameChange = (text) => {
      setName(text);
    };
  
    const handleClick = async () => {
        if (!name) {
          showToastError('Nome não informado', 'Informe seu nome para continuar');
          return;
        }
      
        await AsyncStorage.setItem('name', name);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Qual seu nome?</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={handleNameChange}
      />
      <TouchableOpacity style={styles.botao} onPress={handleClick}>
        <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>
        <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#34aeeb',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  botao: {
    marginTop: 10,
    backgroundColor: '#34aeeb',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;