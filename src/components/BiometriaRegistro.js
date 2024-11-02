import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { verificarHorarioPermitido } from '../utils/horarios';
import { registrarAlmoco } from '../services/api';

export default function BiometriaRegistro({ funcionario }) {
  const [biometriaDisponivel, setBiometriaDisponivel] = useState(false);

  useEffect(() => {
    verificarBiometria();
  }, []);

  const verificarBiometria = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setBiometriaDisponivel(compatible);
  };

  const registrarRefeicao = async () => {
    const horario = verificarHorarioPermitido();
    
    if (!horario.permitido) {
      Alert.alert('Aviso', horario.mensagem);
      return;
    }

    try {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique sua digital para registrar refeição',
        disableDeviceFallback: true
      });

      if (auth.success) {
        const agora = new Date();
        const registro = {
          id: funcionario.id111,
          data: agora.toLocaleDateString(),
          hora: agora.toLocaleTimeString(),
          loja: funcionario.Loja,
          nome: funcionario.Nome,
          departamento: funcionario.Departamento,
          statusAutorizacao: funcionario['Status Autorização'],
          quantidade: 1,
          periodo: horario.periodo,
          senha: funcionario['Senha Digital']
        };

        const resultado = await registrarAlmoco(registro);
        
        if (resultado.success) {
          Alert.alert('Sucesso', 'Refeição registrada com sucesso!');
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao registrar refeição');
    }
  };

  if (!biometriaDisponivel) {
    return (
      <View style={styles.container}>
        <Text style={styles.aviso}>
          Seu dispositivo não suporta autenticação biométrica
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.botao}
      onPress={registrarRefeicao}
    >
      <Text style={styles.textoBotao}>Registrar Refeição</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  aviso: {
    textAlign: 'center',
    color: 'red',
  },
  botao: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 