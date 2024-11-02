document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://script.google.com/macros/s/AKfycbxnohC-muudoEmMxJ3AhfspBqtFZtHFJXTqsfufbOsQgdzo6C5ZAhc269Mhtezx2wg/exec';
    
    // Botões de ação
    const btnCadastrar = document.getElementById('btnCadastrar');
    const btnVerificar = document.getElementById('btnVerificar');

    // Cadastra digital
    const cadastrarDigital = async () => {
        try {
            const nome = document.getElementById('nome').value;
            if (!nome) {
                alert('Digite seu nome');
                return;
            }

            // Ativa o sensor biométrico para cadastro
            if (window.navigator.getBiometric) {
                const digital = await window.navigator.getBiometric({
                    type: 'fingerprint',
                    mode: 'enroll'
                });

                if (digital) {
                    // Salva no Google Sheets
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: 'cadastrarDigital',
                            nome: nome,
                            digital: digital.id
                        })
                    });

                    if (response.ok) {
                        alert('Digital cadastrada com sucesso!');
                        document.getElementById('nome').value = '';
                    }
                }
            } else {
                alert('Seu dispositivo não suporta biometria');
            }
        } catch (error) {
            alert('Erro ao cadastrar digital');
            console.error(error);
        }
    };

    // Verifica digital
    const verificarDigital = async () => {
        try {
            // Ativa o sensor biométrico para verificação
            if (window.navigator.getBiometric) {
                const digital = await window.navigator.getBiometric({
                    type: 'fingerprint',
                    mode: 'verify'
                });

                if (digital) {
                    // Verifica no Google Sheets
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: 'verificarDigital',
                            digital: digital.id
                        })
                    });

                    if (response.ok) {
                        const resultado = await response.json();
                        alert(resultado.mensagem);
                    }
                }
            } else {
                alert('Seu dispositivo não suporta biometria');
            }
        } catch (error) {
            alert('Erro ao verificar digital');
            console.error(error);
        }
    };

    // Event Listeners
    btnCadastrar?.addEventListener('click', cadastrarDigital);
    btnVerificar?.addEventListener('click', verificarDigital);
});