import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import BiometriaRegistro from './BiometriaRegistro';
import { limparDados } from '../services/storage';

export default function HomeScreen({ funcionario, onLogout }) {
  const fazerLogout = async () => {
    await limparDados();
    onLogout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem-vindo(a)</Text>
      <View style={styles.card}>
        <Text style={styles.info}>Nome: {funcionario.Nome}</Text>
        <Text style={styles.info}>Loja: {funcionario.Loja}</Text>
        <Text style={styles.info}>Departamento: {funcionario.Departamento}</Text>
        <Text style={styles.info}>
          Status: {funcionario['Status Autorização']}
        </Text>
      </View>

      <BiometriaRegistro funcionario={funcionario} />

      <TouchableOpacity 
        style={[styles.botao, styles.botaoSair]} 
        onPress={fazerLogout}
      >
        <Text style={styles.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoSair: {
    backgroundColor: '#FF3B30',
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 