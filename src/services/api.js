const API_URL = 'https://script.google.com/macros/s/AKfycbxnohC-muudoEmMxJ3AhfspBqtFZtHFJXTqsfufbOsQgdzo6C5ZAhc269Mhtezx2wg/exec';

export const getFuncionarios = async () => {
  try {
    const response = await fetch(`${API_URL}?action=getFuncionarios`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Erro ao buscar funcionários');
  }
};

export const registrarAlmoco = async (dados) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'registrarAlmoco',
        data: dados
      })
    });
    return await response.json();
  } catch (error) {
    throw new Error('Erro ao registrar refeição');
  }
}; 