import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CadastroScreen from './src/screens/CadastroScreen';
import BiometriaVerificacaoScreen from './src/screens/BiometriaVerificacaoScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Cadastro">
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroScreen}
          options={{ title: 'Cadastro de Funcionário' }}
        />
        <Stack.Screen 
          name="BiometriaVerificacao" 
          component={BiometriaVerificacaoScreen}
          options={{ title: 'Verificação de Digital' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 