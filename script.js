document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://script.google.com/macros/s/AKfycbxnohC-muudoEmMxJ3AhfspBqtFZtHFJXTqsfufbOsQgdzo6C5ZAhc269Mhtezx2wg/exec';
    
    // Botões de ação
    const btnCadastrar = document.getElementById('btnCadastrar');
    const btnVerificar = document.getElementById('btnVerificar');

    // Verifica suporte à biometria
    const verificarBiometria = async () => {
        try {
            const biometrico = await window.navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array([1, 2, 3, 4]),
                    userVerification: "required",
                }
            });
            return true;
        } catch (error) {
            console.error('Erro biometria:', error);
            return false;
        }
    };

    // Cadastra digital
    const cadastrarDigital = async () => {
        try {
            const nome = document.getElementById('nome').value;
            if (!nome) {
                alert('Digite seu nome');
                return;
            }

            const digital = await window.navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array([1, 2, 3, 4]),
                    rp: { name: 'Refeitório', id: window.location.hostname },
                    user: {
                        id: new Uint8Array(16),
                        name: nome,
                        displayName: nome
                    },
                    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "required"
                    },
                    timeout: 60000
                }
            });

            if (digital) {
                const dados = {
                    nome: nome,
                    digitalId: Array.from(new Uint8Array(digital.rawId))
                };

                // Salva no Google Sheets
                const response = await fetch(API_URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        action: 'cadastrarDigital',
                        dados: dados
                    })
                });

                if (response.ok) {
                    alert('Digital cadastrada com sucesso!');
                    document.getElementById('nome').value = '';
                }
            }
        } catch (error) {
            alert('Erro ao cadastrar digital');
            console.error(error);
        }
    };

    // Verifica digital
    const verificarDigital = async () => {
        try {
            const digital = await window.navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array([1, 2, 3, 4]),
                    userVerification: "required",
                    timeout: 60000
                }
            });

            if (digital) {
                const dados = {
                    digitalId: Array.from(new Uint8Array(digital.rawId))
                };

                // Verifica no Google Sheets
                const response = await fetch(API_URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        action: 'verificarDigital',
                        dados: dados
                    })
                });

                if (response.ok) {
                    const resultado = await response.json();
                    alert(resultado.mensagem);
                }
            }
        } catch (error) {
            alert('Erro ao verificar digital');
            console.error(error);
        }
    };

    // Event Listeners
    btnCadastrar?.addEventListener('click', async () => {
        if (await verificarBiometria()) {
            cadastrarDigital();
        } else {
            alert('Seu dispositivo não suporta biometria');
        }
    });

    btnVerificar?.addEventListener('click', async () => {
        if (await verificarBiometria()) {
            verificarDigital();
        } else {
            alert('Seu dispositivo não suporta biometria');
        }
    });
});