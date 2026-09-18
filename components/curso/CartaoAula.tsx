import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CapaCurso } from './CapaCurso';
import { BarraProgresso } from '@/components/ui/BarraProgresso';
import { Botao } from '@/components/ui/Botao';
import { Relogio } from '@/components/ui/Icones';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import type { Aula } from '@/lib/tipos';

type Props = {
  aula: Aula;
  cor: string;
  aoAssistir: (aula: Aula) => void;
};

const ROTULO: Record<Aula['status'], string> = {
  'nao-assistido': 'Não assistido',
  'em-andamento': 'Em andamento',
  assistido: 'Assistido',
};

export function CartaoAula({ aula, cor, aoAssistir }: Props) {
  const concluida = aula.status === 'assistido';
  const emAndamento = aula.status === 'em-andamento';

  return (
    <Pressable
      onPress={() => aoAssistir(aula)}
      accessibilityRole="button"
      accessibilityLabel={`Assistir ${aula.titulo}`}
      style={({ pressed }) => [estilos.cartao, pressed && estilos.pressionado]}
    >
      <View>
        <CapaCurso cor={cor} larga estilo={estilos.capa} />

        <View style={estilos.assunto}>
          <Text style={estilos.assuntoTexto}>{aula.assunto}</Text>
        </View>

        <View
          style={[
            estilos.status,
            concluida && estilos.statusConcluida,
            emAndamento && estilos.statusAndamento,
          ]}
        >
          <Text
            style={[
              estilos.statusTexto,
              concluida && estilos.statusTextoConcluida,
              emAndamento && estilos.statusTextoAndamento,
            ]}
          >
            {ROTULO[aula.status]}
          </Text>
        </View>
      </View>

      <View style={estilos.corpo}>
        <Text style={estilos.titulo}>{aula.titulo}</Text>

        <View style={estilos.linha}>
          <Relogio />
          <Text style={estilos.duracao}>{aula.duracaoMin} min</Text>
          <View style={estilos.ramo}>
            <Text style={estilos.ramoTexto}>{aula.ramo}</Text>
          </View>
        </View>

        <View style={estilos.progresso}>
          <BarraProgresso valor={aula.progresso} cor={cor} altura={4} />
        </View>

        <Botao
          titulo={concluida ? 'Revisar' : emAndamento ? 'Continuar' : 'Assistir'}
          variante={concluida ? 'secundario' : 'primario'}
          aoPressionar={() => aoAssistir(aula)}
          estilo={estilos.botao}
        />
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    borderWidth: 1,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.lg,
    backgroundColor: Cores.fundo,
    overflow: 'hidden',
    marginBottom: Espaco.lg,
  },
  pressionado: {
    borderColor: Cores.borda,
  },
  capa: {
    borderRadius: 0,
  },
  assunto: {
    position: 'absolute',
    left: Espaco.md,
    bottom: Espaco.md,
    backgroundColor: 'rgba(18, 26, 44, 0.72)',
    paddingVertical: Espaco.xs + 1,
    paddingHorizontal: Espaco.sm + 1,
    borderRadius: Raio.sm,
  },
  assuntoTexto: {
    color: Cores.textoInverso,
    fontSize: Fonte.minuscula - 0.5,
    fontWeight: '600',
  },
  status: {
    position: 'absolute',
    right: Espaco.md,
    top: Espaco.md,
    backgroundColor: 'rgba(18, 26, 44, 0.72)',
    paddingVertical: Espaco.xs + 1,
    paddingHorizontal: Espaco.sm + 1,
    borderRadius: Raio.sm,
  },
  statusConcluida: {
    backgroundColor: Cores.sucessoFundo,
  },
  statusAndamento: {
    backgroundColor: Cores.alertaFundo,
  },
  statusTexto: {
    color: Cores.textoInverso,
    fontSize: Fonte.minuscula - 0.5,
    fontWeight: '700',
  },
  statusTextoConcluida: {
    color: Cores.sucesso,
  },
  statusTextoAndamento: {
    color: '#7A5C12',
  },
  corpo: {
    padding: Espaco.md + 1,
  },
  titulo: {
    fontSize: Fonte.corpo + 0.5,
    fontWeight: '700',
    color: Cores.texto,
    lineHeight: 19,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm - 2,
    marginTop: Espaco.sm,
  },
  duracao: {
    fontSize: Fonte.pequena - 0.5,
    color: Cores.textoApagado,
  },
  ramo: {
    marginLeft: 'auto',
    backgroundColor: '#EEF3F8',
    paddingVertical: Espaco.xs,
    paddingHorizontal: Espaco.sm + 1,
    borderRadius: Raio.sm,
  },
  ramoTexto: {
    fontSize: Fonte.minuscula - 0.5,
    fontWeight: '700',
    color: Cores.petroleo,
  },
  progresso: {
    marginTop: Espaco.md - 1,
  },
  botao: {
    marginTop: Espaco.md,
    height: 44,
  },
});
