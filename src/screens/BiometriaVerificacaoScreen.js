import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://script.google.com/macros/s/AKfycbxnohC-muudoEmMxJ3AhfspBqtFZtHFJXTqsfufbOsQgdzo6C5ZAhc269Mhtezx2wg/exec';

export default function BiometriaVerificacaoScreen() {
  const [carregando, setCarregando] = useState(false);
  const [funcionario, setFuncionario] = useState(null);

  useEffect(() => {
    carregarDadosFuncionario();
  }, []);

  const carregarDadosFuncionario = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('funcionarioBiometria');
      if (dadosSalvos) {
        setFuncionario(JSON.parse(dadosSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const verificarHorario = () => {
    const agora = new Date();
    const hora = agora.getHours();

    if (hora >= 11 && hora < 14) {
      return { permitido: true, periodo: 'Almoço' };
    }
    if (hora >= 19 && hora < 21) {
      return { permitido: true, periodo: 'Janta' };
    }
    return { 
      permitido: false, 
      mensagem: 'Fora do horário permitido para refeições' 
    };
  };

  const verificarBiometria = async () => {
    if (!funcionario) {
      Alert.alert('Erro', 'Biometria não cadastrada');
      return;
    }

    const horario = verificarHorario();
    if (!horario.permitido) {
      Alert.alert('Aviso', horario.mensagem);
      return;
    }

    try {
      setCarregando(true);

      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique sua digital para registrar refeição',
        disableDeviceFallback: true
      });

      if (auth.success) {
        await registrarRefeicao(horario.periodo);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na verificação biométrica');
    } finally {
      setCarregando(false);
    }
  };

  const registrarRefeicao = async (periodo) => {
    try {
      const agora = new Date();
      const dados = {
        id: funcionario.id111,
        data: agora.toLocaleDateString(),
        hora: agora.toLocaleTimeString(),
        loja: funcionario.Loja,
        nome: funcionario.Nome,
        departamento: funcionario.Departamento,
        statusAutorizacao: funcionario['Status Autorização'],
        quantidade: 1,
        periodo: periodo,
        senha: funcionario['Senha Digital']
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'registrarAlmoco',
          data: dados
        })
      });

      const resultado = await response.json();
      
      if (resultado.success) {
        Alert.alert('Sucesso', 'Refeição registrada com sucesso!');
      } else {
        throw new Error('Falha ao registrar refeição');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a refeição');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Verificação de Biometria</Text>

      {funcionario && (
        <View style={styles.infoCard}>
          <Text style={styles.label}>Funcionário:</Text>
          <Text style={styles.valor}>{funcionario.Nome}</Text>
          <Text style={styles.label}>Status:</Text>
          <Text style={[
            styles.valor,
            { color: funcionario['Status Autorização'] === 'Liberado' ? '#34C759' : '#FF3B30' }
          ]}>
            {funcionario['Status Autorização']}
          </Text>
        </View>
      )}

      {carregando ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity 
          style={styles.botao}
          onPress={verificarBiometria}
        >
          <Text style={styles.textoBotao}>Verificar Digital</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  valor: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  botao: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  }
}); 