export const verificarHorarioPermitido = () => {
  const agora = new Date();
  const hora = agora.getHours();
  const minutos = agora.getMinutes();
  
  // Horário de almoço: 11:00 às 14:00
  if (hora >= 11 && hora < 14) {
    return {
      permitido: true,
      periodo: 'Almoço'
    };
  }
  
  // Horário de janta: 19:00 às 21:00
  if (hora >= 19 && hora < 21) {
    return {
      permitido: true,
      periodo: 'Janta'
    };
  }

  return {
    permitido: false,
    mensagem: 'Fora do horário permitido para refeições'
  };
}; 