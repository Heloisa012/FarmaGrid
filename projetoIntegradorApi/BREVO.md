# Recuperação de senha com Brevo

BREVO_API_KEY=SUA_CHAVE_API_BREVO
BREVO_SENDER_EMAIL=equipe.farmagrid@gmail.com

Use uma chave de API, não uma chave SMTP. Verifique o remetente no Brevo.
Não coloque a chave no Desktop/Electron/.env: o aplicativo é distribuído aos usuários.
O Spring lê as variáveis do ambiente; não carrega um arquivo .env automaticamente.

Publique a API atualizada antes de testar o Desktop. API_BASE_URL no Desktop deve apontar
para essa API. Solicite o código na tela Esqueceu sua senha, informe os 6 dígitos e a nova senha.
O envio real depende das credenciais e da configuração do remetente no Brevo.

Os códigos duram 10 minutos, permitem 5 tentativas e têm intervalo de reenvio de 1 minuto.
São guardados como hash na memória do servidor: reiniciar a API invalida os códigos.
Esta implementação exige uma única instância da API. Antes de escalar para múltiplas
instâncias, migre os desafios e limites para armazenamento compartilhado (por exemplo Redis).
Contas com o mesmo e-mail compartilham a recuperação e recebem a mesma senha nova.
A recuperação exige conexão e não entra na fila offline.
A sessão offline deste Desktop é removida após a redefinição; outros dispositivos
com sessões offline ou tokens já emitidos não são revogados por esta implementação.

Documentação: https://developers.brevo.com/docs/send-a-transactional-email