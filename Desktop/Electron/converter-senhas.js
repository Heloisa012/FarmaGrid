const bcrypt = require('bcrypt');
const db = require('./src/db/conexao');

async function converterSenhas() {
    try {
        const [usuarios] = await db.promise().query(
            'SELECT id, senha FROM login'
        );

        for (const usuario of usuarios) {

            // Evita converter senhas já criptografadas
            if (usuario.senha.startsWith('$2b$')) {
                console.log(`Usuário ${usuario.id} já convertido`);
                continue;
            }

            const hash = await bcrypt.hash(usuario.senha, 10);

            await db.promise().query(
                'UPDATE login SET senha = ? WHERE id = ?',
                [hash, usuario.id]
            );

            console.log(`Usuário ${usuario.id} convertido`);
        }

        console.log('Conversão concluída!');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

converterSenhas();