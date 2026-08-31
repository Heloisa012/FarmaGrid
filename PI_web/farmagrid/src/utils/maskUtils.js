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
