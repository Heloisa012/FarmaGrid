export function aplicarMascara(valor, padrao) {
  const apenasDigitos = String(valor ?? '').replace(/\D/g, '');
  let resultado = '';
  let indice = 0;

  for (const caractere of padrao) {
    if (caractere === '#') {
      if (indice < apenasDigitos.length) {
        resultado += apenasDigitos[indice];
        indice += 1;
      } else {
        break;
      }
    } else if (indice < apenasDigitos.length) {
      resultado += caractere;
    }
  }

  return resultado;
}

export function mascararCPF(valor) {
  return aplicarMascara(valor, '###.###.###-##');
}

export function mascararCEP(valor) {
  return aplicarMascara(valor, '#####-###');
}

export function mascararCNPJ(valor) {
  return aplicarMascara(valor, '##.###.###/####-##');
}

export function mascararTelefone(valor) {
  const apenasDigitos = String(valor ?? '').replace(/\D/g, '');
  if (apenasDigitos.length <= 10) {
    return aplicarMascara(apenasDigitos, '(##) ####-####');
  }
  return aplicarMascara(apenasDigitos, '(##) #####-####');
}

export function validarCPF(valor) {
  const cpf = String(valor ?? '').replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // rejeita 111.111.111-11 etc.

  const digito = (base) => {
    let soma = 0;
    for (let i = 0; i < base; i++) soma += Number(cpf[i]) * (base + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

