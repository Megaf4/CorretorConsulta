import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CapaCurso } from './CapaCurso';
import { Etiqueta } from './Etiqueta';
import { BarraProgresso } from '@/components/ui/BarraProgresso';
import { Seta } from '@/components/ui/Icones';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import type { CursoResumo } from '@/lib/tipos';

type Props = {
  curso: CursoResumo;
  aoAbrir: (curso: CursoResumo) => void;
  /** Mostra o selo "Em alta" ou "Favorito" no topo. */
  selo?: 'alta' | 'favorito';
};

export function CartaoCurso({ curso, aoAbrir, selo }: Props) {
  const progresso = curso.totalAulas
    ? Math.round((curso.aulasConcluidas / curso.totalAulas) * 100)
    : 0;

  return (
    <View style={estilos.envolucro}>
      {selo ? (
        <Etiqueta texto={selo === 'alta' ? 'EM ALTA' : 'FAVORITO'} tipo={selo} />
      ) : null}

      <Pressable
        onPress={() => aoAbrir(curso)}
        accessibilityRole="button"
        accessibilityLabel={`Abrir curso ${curso.nome}`}
        style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado]}
      >
        <CapaCurso cor={curso.cor} sigla={curso.sigla} />

        <View style={estilos.texto}>
          <View>
            <Text style={estilos.nome} numberOfLines={2}>
              {curso.nome}
            </Text>
            <Text style={estilos.meta}>{curso.categoria}</Text>
            <Text style={estilos.meta}>
              {curso.totalAulas} {curso.totalAulas === 1 ? 'aula' : 'aulas'} ·{' '}
              {curso.duracaoMin} min
            </Text>

            {progresso > 0 ? (
              <View style={estilos.progresso}>
                <BarraProgresso valor={progresso} cor={curso.cor} altura={4} />
              </View>
            ) : null}
          </View>

          <View style={[estilos.botao, { backgroundColor: curso.cor }]}>
            <Text style={estilos.botaoTexto}>Ver curso</Text>
            <Seta tamanho={13} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  envolucro: {
    marginBottom: Espaco.md,
  },
  cartao: {
    flexDirection: 'row',
    gap: Espaco.md,
    padding: Espaco.md,
    borderWidth: 1,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.lg,
    backgroundColor: Cores.fundo,
  },
  pressionado: {
    backgroundColor: Cores.fundoSuave,
  },
  texto: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 104,
  },
  nome: {
    fontSize: Fonte.medio + 0.5,
    fontWeight: '700',
    color: Cores.texto,
    lineHeight: 20,
  },
  meta: {
    fontSize: Fonte.pequena - 0.5,
    color: Cores.textoApagado,
    marginTop: 3,
  },
  progresso: {
    marginTop: Espaco.sm,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm,
    height: 42,
    borderRadius: Raio.md,
    marginTop: Espaco.sm,
  },
  botaoTexto: {
    color: Cores.textoInverso,
    fontSize: Fonte.corpo - 0.5,
    fontWeight: '700',
  },
});
