import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import { StyleSheet } from "react-native";
import { ProjetoContext } from "../context/ProjetoContext";
import showToastError from "../components/toast/toastError";

const EditarProjeto = ({ route, navigation }) => {

  const { addProjeto } = useContext(ProjetoContext);

    const { projeto } = route.params;
  
    const [tituloBotao, setTituloBotao] = useState('Escolher arquivo');
    const [nomeProjeto, setNomeProjeto] = useState(projeto.nome);
    const [descricaoProjeto, setDescricaoProjeto] = useState(projeto.descricao);
    const [arquivo, setArquivo] = useState(projeto.arquivo);
  
    const handleNomeProjetoChange = (text) => {
      setNomeProjeto(text);
    }
  
    const handleDescricaoProjetoChange = (text) => {
      setDescricaoProjeto(text);
    }
  
    const handleArquivoChange = async () => {
      try
      {
        const arquivoSelecionado = await DocumentPicker.getDocumentAsync();
        console.log('Arquivo selecionado:', arquivoSelecionado);
        setArquivo(arquivoSelecionado);
        setTituloBotao('Alterar arquivo');
      }
      catch (error)
      {
        console.error('Erro ao selecionar arquivo:', error);
      }
    }
  
    const handleDelete = async () => {
      try {
        const projetos = JSON.parse(await AsyncStorage.getItem('projetos')) || [];
        const index = projetos.findIndex((p) => p.nome === projeto.nome);

        if (index !== -1) {
          projetos.splice(index, 1);
        }

        await AsyncStorage.setItem('projetos', JSON.stringify(projetos));
        navigation.goBack();
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
      }
    }
    
  
    const handleSalvar = async () => {
  
      if (nomeProjeto === '') {
        showToastError('Erro', 'Informe o nome do projeto');
        return;
      }
  
      if (descricaoProjeto === '') {
        showToastError('Erro', 'Informe a descrição do projeto');
        return;
      }
  
      if (!arquivo || !arquivo.assets || !arquivo.assets[0]) {
        showToastError('Erro', 'Selecione um arquivo');
        return;
      }
  
      const novoProjeto = {
        nome: nomeProjeto,
        descricao: descricaoProjeto,
        arquivo: arquivo,
      };
    
      try {
        const projetos = JSON.parse(await AsyncStorage.getItem('projetos')) || [];
        const index = projetos.findIndex((p) => p.nome === projeto.nome);
    
        if (index !== -1) {
          projetos[index] = novoProjeto;
        } else {
          projetos.push(novoProjeto);
        }
    
        await AsyncStorage.setItem('projetos', JSON.stringify(projetos));
        addProjeto(novoProjeto);
        navigation.goBack();
      } catch (error) {
        console.error('Erro ao salvar projeto:', error);
      }
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Editar projeto</Text>
        <View style={styles.inputs}>
          <TextInput
            style={styles.input}
            placeholder="Nome do projeto"
            value={nomeProjeto}
            onChangeText={handleNomeProjetoChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição do projeto"
            value={descricaoProjeto}
            onChangeText={handleDescricaoProjetoChange}
          />
          <TouchableOpacity style={styles.botao} onPress={handleArquivoChange}>
            <Text style={styles.textoBotao}>{tituloBotao}</Text>
          </TouchableOpacity>
          {arquivo && arquivo.assets && arquivo.assets[0] && (
            <TouchableOpacity onPress={() => {
              console.log('Arquivo selecionado:', arquivo);
            }}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Arquivo selecionado:</Text>
                <Text style={styles.cardText}>Nome: {arquivo.assets[0].name}</Text>
                <Text style={styles.cardText}>Tipo: {arquivo.assets[0].mimeType}</Text>
                <Text style={styles.cardText}>Tamanho: {arquivo.assets[0].size} bytes</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>Salvar projeto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoExcluir} onPress={handleDelete}>
    <Text style={styles.textoBotaoExcluir}>Excluir projeto</Text>
  </TouchableOpacity>
  <Toast />
      </View>
    );
  };
  
  export const styles = StyleSheet.create({
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
    inputs: {
      marginBottom: 16,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    card: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      padding: 10,
      marginTop: 10,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    cardText: {
      fontSize: 14,
    },
    botaoExcluir: {
      marginTop: 10,
      backgroundColor: '#f00',
      padding: 10,
      alignItems: 'center',
      borderRadius: 5,
    },
    textoBotaoExcluir: {
      color: '#fff',
      fontSize: 16,
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

  export default EditarProjeto;