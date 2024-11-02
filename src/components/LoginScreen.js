import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { getFuncionarios } from '../services/api';
import { salvarFuncionario } from '../services/storage';

export default function LoginScreen({ onLogin }) {
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      setCarregando(true);
      const dados = await getFuncionarios();
      setFuncionarios(dados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a lista de funcionários');
    } finally {
      setCarregando(false);
    }
  };

  const fazerLogin = async () => {
    const funcionario = funcionarios.find(f => f['Senha Digital'] === senha);
    
    if (funcionario) {
      if (funcionario['Status Autorização'] === 'Liberado') {
        await salvarFuncionario(funcionario);
        onLogin(funcionario);
      } else {
        Alert.alert('Acesso Negado', 'Seu acesso não está liberado');
      }
    } else {
      Alert.alert('Erro', 'Senha inválida');
    }
  };

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login Refeitório</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        keyboardType="numeric"
        secureTextEntry
      />
      <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 