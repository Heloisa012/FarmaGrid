import 'package:flutter/material.dart';

const medicoVerde = Color(0xFF59AA53);
const medicoVerdeEscuro = Color(0xFF136A48);
const medicoTeal = Color(0xFF7FC6BB);
const medicoFundo = Color(0xFFF5F5F5);
const medicoTexto = Color(0xFF2E2E2E);

class MedicoCabecalho extends StatelessWidget {
  final String titulo;
  final String? subtitulo;
  final Widget? rodape;

  const MedicoCabecalho({
    super.key,
    required this.titulo,
    this.subtitulo,
    this.rodape,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(24, 58, 24, 25),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [medicoVerde, Color(0xFF89C6B1)],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(40),
          bottomRight: Radius.circular(40),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              InkWell(
                onTap: () => Navigator.maybePop(context),
                borderRadius: BorderRadius.circular(30),
                child: const Padding(
                  padding: EdgeInsets.all(4),
                  child: Icon(Icons.arrow_back, color: Colors.white, size: 26),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  titulo,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          if (subtitulo != null) ...[
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.only(left: 42),
              child: Text(
                subtitulo!,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: .88),
                  fontSize: 13,
                ),
              ),
            ),
          ],
          if (rodape != null) ...[const SizedBox(height: 22), rodape!],
        ],
      ),
    );
  }
}

class MedicoCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final Color color;

  const MedicoCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(18),
    this.margin,
    this.color = Colors.white,
  });

  @override
  Widget build(BuildContext context) => Container(
    margin: margin,
    padding: padding,
    decoration: BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(22),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withValues(alpha: .055),
          blurRadius: 14,
          offset: const Offset(0, 5),
        ),
      ],
    ),
    child: child,
  );
}

class MedicoTituloSecao extends StatelessWidget {
  final String titulo;
  final String? legenda;
  const MedicoTituloSecao(this.titulo, {super.key, this.legenda});

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        titulo,
        style: const TextStyle(
          color: medicoTexto,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
      ),
      if (legenda != null) ...[
        const SizedBox(height: 4),
        Text(
          legenda!,
          style: const TextStyle(color: Colors.grey, fontSize: 12),
        ),
      ],
    ],
  );
}

String textoSeguro(dynamic valor, {String vazio = 'Não informado'}) {
  final texto = '${valor ?? ''}'.trim();
  return texto.isEmpty || texto == 'null' ? vazio : texto;
}
