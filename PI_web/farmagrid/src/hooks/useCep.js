import { useState, useRef, useCallback } from 'react';
import { buscarEnderecoPorCep } from '../services/cepService.js';

/**
 * Hook para preenchimento automático de endereço a partir do CEP.
 *
 * Uso:
 *   const { buscandoCep, erroCep, handleCepChange } = useCep(atualizar);
 *
 *   <input
 *     value={form.cep}
 *     onChange={e => handleCepChange(e.target.value)}
 *   />
 *
 * @param {function} setField  Função (campo, valor) => void para atualizar os campos do form.
 * @param {object}   [fieldMap] Mapeamento opcional { logradouro, bairro, cidade, estado }.
 *                              Padrão: { logradouro:'rua', bairro:'bairro', cidade:'cidade', estado:'estado' }
 */
export function useCep(setField, fieldMap = {}) {
  const mapa = {
    cep:       fieldMap.cep       ?? 'cep',
    logradouro: fieldMap.logradouro ?? 'rua',
    bairro:    fieldMap.bairro    ?? 'bairro',
    cidade:    fieldMap.cidade    ?? 'cidade',
    estado:    fieldMap.estado    ?? 'estado',
  };

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState('');
  const debounceRef = useRef(null);

  const handleCepChange = useCallback((valorBruto, mascara) => {
    // Aplica máscara se fornecida (ex.: mascararCEP do maskUtils)
    const valorMascarado = mascara ? mascara(valorBruto) : valorBruto;
    setField(mapa.cep, valorMascarado);
    setErroCep('');

    const cepLimpo = valorMascarado.replace(/\D/g, '');

    if (cepLimpo.length < 8) return; // aguarda completar

    // Debounce de 400 ms para evitar requisições a cada tecla
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setBuscandoCep(true);
      setErroCep('');
      try {
        const dados = await buscarEnderecoPorCep(cepLimpo);
        if (dados.logradouro) setField(mapa.logradouro, dados.logradouro);
        if (dados.bairro)     setField(mapa.bairro,    dados.bairro);
        if (dados.cidade)     setField(mapa.cidade,    dados.cidade);
        if (dados.estado)     setField(mapa.estado,    dados.estado);
      } catch (err) {
        setErroCep(err.message || 'CEP não encontrado.');
      } finally {
        setBuscandoCep(false);
      }
    }, 400);
  }, [setField, mapa]);

  return { buscandoCep, erroCep, handleCepChange };
}
