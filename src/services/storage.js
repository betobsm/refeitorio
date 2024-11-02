import * as SecureStore from 'expo-secure-store';

export const salvarFuncionario = async (funcionario) => {
  try {
    await SecureStore.setItemAsync('funcionario', JSON.stringify(funcionario));
  } catch (error) {
    console.error('Erro ao salvar funcionário:', error);
  }
};

export const getFuncionarioSalvo = async () => {
  try {
    const funcionario = await SecureStore.getItemAsync('funcionario');
    return funcionario ? JSON.parse(funcionario) : null;
  } catch (error) {
    console.error('Erro ao recuperar funcionário:', error);
    return null;
  }
};

export const limparDados = async () => {
  try {
    await SecureStore.deleteItemAsync('funcionario');
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
}; 