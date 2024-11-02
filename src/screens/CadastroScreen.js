import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const API_URL = 'https://script.google.com/macros/s/AKfycbxnohC-muudoEmMxJ3AhfspBqtFZtHFJXTqsfufbOsQgdzo6C5ZAhc269Mhtezx2wg/exec';

export default function CadastroScreen({ navigation }) {
  const [dados, setDados] = useState({
    id: '',
    nome: '',
    loja: '',
    departamento: '',
    senhaDigital: '',
  });
  const [carregando, setCarregando] = useState(false);

  const validarCampos = () => {
    for (let campo in dados) {
      if (!dados[campo]) {
        Alert.alert('Erro', `Por favor, preencha o campo ${campo}`);
        return false;
      }
    }
    return true;
  };

  const cadastrarBiometria = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert('Erro', 'Seu dispositivo não suporta biometria');
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert(
          'Biometria não configurada',
          'Por favor, configure a biometria nas configurações do seu dispositivo primeiro'
        );
        return;
      }

      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Cadastre sua digital',
        disableDeviceFallback: true,
      });

      if (auth.success) {
        return true;
      }
      
      return false;
    } catch (error) {
      Alert.alert('Erro', 'Falha ao verificar biometria');
      return false;
    }
  };

  const salvarCadastro = async () => {
    if (!validarCampos()) return;

    try {
      setCarregando(true);

      // Primeiro cadastra a biometria
      const biometriaOk = await cadastrarBiometria();
      if (!biometriaOk) {
        Alert.alert('Erro', 'Falha no cadastro da biometria');
        return;
      }

      // Envia dados para o Google Sheets
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cadastrarBiometria',
          ...dados
        })
      });

      const resultado = await response.json();

      if (resultado.success) {
        Alert.alert(
          'Sucesso',
          'Cadastro realizado com sucesso!',
          [{ text: 'OK', onPress: () => navigation.navigate('BiometriaVerificacao') }]
        );
      } else {
        throw new Error(resultado.message || 'Erro ao cadastrar');
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao realizar cadastro');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Funcionário</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ID</Text>
          <TextInput
            style={styles.input}
            value={dados.id}
            onChangeText={(text) => setDados({...dados, id: text})}
            keyboardType="numeric"
            placeholder="Digite seu ID"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={dados.nome}
            onChangeText={(text) => setDados({...dados, nome: text})}
            placeholder="Digite seu nome completo"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Loja</Text>
          <TextInput
            style={styles.input}
            value={dados.loja}
            onChangeText={(text) => setDados({...dados, loja: text})}
            placeholder="Digite sua loja"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Departamento</Text>
          <TextInput
            style={styles.input}
            value={dados.departamento}
            onChangeText={(text) => setDados({...dados, departamento: text})}
            placeholder="Digite seu departamento"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha Digital</Text>
          <TextInput
            style={styles.input}
            value={dados.senhaDigital}
            onChangeText={(text) => setDados({...dados, senhaDigital: text})}
            keyboardType="numeric"
            secureTextEntry
            placeholder="Digite sua senha digital"
          />
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />
        ) : (
          <TouchableOpacity 
            style={styles.botao}
            onPress={salvarCadastro}
          >
            <Text style={styles.textoBotao}>Cadastrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loading: {
    marginTop: 20,
  }
}); 