import { StyleSheet, Text, View } from 'react-native';

import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';

type Tom = 'neutro' | 'sucesso' | 'alerta' | 'erro';

const TONS: Record<Tom, { fundo: string; borda: string; texto: string }> = {
  neutro: { fundo: Cores.fundoSuave, borda: Cores.bordaSuave, texto: Cores.textoSecundario },
  sucesso: { fundo: Cores.sucessoFundo, borda: Cores.sucessoFundo, texto: Cores.sucesso },
  alerta: { fundo: Cores.alertaFundo, borda: '#F0E0B8', texto: '#7A5C12' },
  erro: { fundo: Cores.erroFundo, borda: Cores.erroFundo, texto: Cores.erro },
};

/** Caixa de recado no meio do conteúdo. */
export function Aviso({ texto, tom = 'neutro' }: { texto: string; tom?: Tom }) {
  const cor = TONS[tom];
  return (
    <View style={[estilos.caixa, { backgroundColor: cor.fundo, borderColor: cor.borda }]}>
      <Text style={[estilos.texto, { color: cor.texto }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    borderWidth: 1,
    borderRadius: Raio.md,
    paddingVertical: Espaco.md - 1,
    paddingHorizontal: Espaco.md,
    marginBottom: Espaco.lg,
  },
  texto: {
    fontSize: Fonte.pequena + 0.5,
    lineHeight: 18,
  },
});
