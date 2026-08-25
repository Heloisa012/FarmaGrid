String formatarDataBrasileira(String? valor) {
  final texto = (valor ?? '').trim();
  if (texto.isEmpty) return '';

  final partesIso = texto.split('-');
  if (partesIso.length == 3 && partesIso[0].length == 4) {
    return '${partesIso[2].padLeft(2, '0')}/${partesIso[1].padLeft(2, '0')}/${partesIso[0]}';
  }

  final data = DateTime.tryParse(texto);
  if (data == null) return texto;
  return '${data.day.toString().padLeft(2, '0')}/${data.month.toString().padLeft(2, '0')}/${data.year}';
}
