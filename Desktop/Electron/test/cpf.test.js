const test = require('node:test');
const assert = require('node:assert/strict');

const { somenteDigitos, validarCPF } = require('../src/utils/cpf');

test('aceita CPFs com dígitos verificadores válidos', () => {
  assert.equal(validarCPF('529.982.247-25'), true);
  assert.equal(validarCPF('111.444.777-35'), true);
});

test('rejeita dígitos verificadores incorretos', () => {
  assert.equal(validarCPF('529.982.247-24'), false);
  assert.equal(validarCPF('123.456.789-00'), false);
});

test('rejeita sequências repetidas, valores incompletos e vazios', () => {
  assert.equal(validarCPF('000.000.000-00'), false);
  assert.equal(validarCPF('111.111.111-11'), false);
  assert.equal(validarCPF('123'), false);
  assert.equal(validarCPF(''), false);
});

test('remove máscara e caracteres não numéricos', () => {
  assert.equal(somenteDigitos('529.982.247-25'), '52998224725');
});
