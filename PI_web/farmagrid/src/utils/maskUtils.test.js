import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mascararCPF,
  mascararCEP,
  mascararCNPJ,
  mascararTelefone,
} from './maskUtils.js';

test('mascara CPF', () => {
  assert.equal(mascararCPF('12345678909'), '123.456.789-09');
  assert.equal(mascararCPF('123'), '123');
});

test('mascara CEP', () => {
  assert.equal(mascararCEP('13010100'), '13010-100');
  assert.equal(mascararCEP('13010'), '13010');
});

test('mascara CNPJ', () => {
  assert.equal(mascararCNPJ('12345678000195'), '12.345.678/0001-95');
});

test('mascara telefone', () => {
  assert.equal(mascararTelefone('19999999999'), '(19) 99999-9999');
  assert.equal(mascararTelefone('1933334444'), '(19) 3333-4444');
});
