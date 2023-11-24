import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const getStatusColor = (status) => {
  switch (status) {
    case 'Em atraso':
      return styles.projetoAtrasado;
    case 'Em andamento':
      return styles.projetoAndamento;
    case 'Concluído':
      return styles.projetoConcluido;
    default:
      return styles.projeto;
  }
};

const Home = ({ navigation }) => {
  const [projetos, setProjetos] = useState([]);
  const [name, setName] = useState('');

  const getProjetos = useCallback(async () => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem('projetos')) || [];
      setProjetos(data);
    } catch (error) {
      console.error('Erro ao obter projetos:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getProjetos();
      getUser();
    }, [])
  );

  const getUser = async () => {
    const name = await AsyncStorage.getItem('name');
    if (!name) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
    setName(name);
  };

  const handleStatusChange = async (status, projeto) => {
    projeto.status = status;

    setProjetos(prevProjetos => {
      const updatedProjetos = prevProjetos.map(p =>
        p.nome === projeto.nome ? { ...p, status } : p
      );
      return updatedProjetos;
    });

    try {
      await AsyncStorage.setItem('projetos', JSON.stringify(updatedProjetos));
    } catch (error) {
      console.error('Error saving project status:', error);
    }
  };

  const criarProjeto = () => {
    navigation.navigate('CriarProjeto', {
      onGoBack: () => getProjetos(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Olá, <Text style={styles.nameText}>{name}</Text>!</Text>
      <Text style={styles.titulo}>Gerenciamento de projetos</Text>

      {projetos.length === 0 ? (
        <View style={styles.semProjetosContainer}>
          <Text style={styles.semProjetosTexto}>Nenhum projeto encontrado :(</Text>
          <Text style={styles.semProjetosTextoCinza}>Crie um novo projeto</Text>
          <Text style={styles.semProjetosTextoCinza}> clicando no botão 
          <Text style={{ color: '#34aeeb' }}> Criar projeto!</Text></Text>
        </View>
      ) : (
        <FlatList
          data={projetos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              navigation.navigate('EditarProjeto', {
                projeto: item,
              });
            }}>
              <View style={getStatusColor(item.status)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.nomeProjeto}>{item.nome}</Text>
                  {item.status && (
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.status}</Text>
                  )}
                </View>
                <Text style={styles.descricaoProjeto}>{item.descricao}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <TouchableOpacity onPress={() => handleStatusChange('Em atraso', item)}>
                    <Icon name="close-circle" size={20} color="red" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleStatusChange('Em andamento', item)}>
                    <Icon name="time" size={20} color="yellow" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleStatusChange('Concluído', item)}>
                    <Icon name="checkmark-circle" size={20} color="green" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 3, marginRight: 10 }}>
          <TouchableOpacity style={styles.botao} onPress={criarProjeto}>
            <Text style={styles.textoBotao}>Criar projeto</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <TouchableOpacity style={styles.botaoSair} onPress={async () => {
            await AsyncStorage.removeItem('name');
            navigation.navigate('Login', {
              name: '',
            });
          }}>
            <Icon name="exit-outline" size={20} color="#fff" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  semProjetosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  semProjetosTexto: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  semProjetosTextoCinza: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  criarProjetoTexto: {
    color: '#34aeeb',
  },
  projeto: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#34aeeb',
  },
  nomeProjeto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  descricaoProjeto: {
    fontSize: 14,
    color: '#fff',
  },
  botao: {
    marginTop: 10,
    backgroundColor: '#34aeeb',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  botaoSair: {
    marginTop: 10,
    backgroundColor: '#f00',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
  },
  nameText: {
    color: '#34aeeb',
    fontWeight: 'bold',
  },
  projetoAtrasado: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fc2848',
  },
  projetoAndamento: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5c52a',
  },
  projetoConcluido: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4CB944',
  },
});

export default Home;
