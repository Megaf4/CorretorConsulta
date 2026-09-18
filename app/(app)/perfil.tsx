import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Aviso } from '@/components/ui/Aviso';
import { Botao } from '@/components/ui/Botao';
import { Cabecalho } from '@/components/ui/Cabecalho';
import { Campo } from '@/components/ui/Campo';
import { Confirmacao } from '@/components/ui/Confirmacao';
import { FotoPerfil } from '@/components/ui/FotoPerfil';
import { Rodape } from '@/components/ui/Rodape';
import { Secao } from '@/components/ui/Secao';
import { Selo } from '@/components/ui/Selo';
import { Cores, Espaco, Fonte, Raio } from '@/constants/theme';
import { api, FalhaApi } from '@/lib/api';
import {
  formatarData,
  podeTrocarNomeCertificado,
  proximaTrocaCertificado,
} from '@/lib/certificado';
import { useSessao } from '@/lib/sessao';
import { validarEmail } from '@/lib/validacao';

type Recado = { texto: string; tom: 'sucesso' | 'erro' | 'alerta' | 'neutro' } | null;

export default function TelaPerfil() {
  const { sessao, token, assinante, aplicarUsuario, sair } = useSessao();
  const usuario = sessao?.usuario;

  const [nome, definirNome] = useState(usuario?.nome ?? '');
  const [emailAdicional, definirEmailAdicional] = useState(usuario?.emailAdicional ?? '');
  const [nomeCertificado, definirNomeCertificado] = useState(
    usuario?.nomeCertificado ?? usuario?.nome ?? ''
  );

  const [erros, definirErros] = useState<{ nome?: string; emailAdicional?: string }>({});
  const [recado, definirRecado] = useState<Recado>(null);
  const [salvando, definirSalvando] = useState(false);
  const [enviandoFoto, definirEnviandoFoto] = useState(false);
  const [pedindoSenha, definirPedindoSenha] = useState(false);
  const [confirmarCertificado, definirConfirmarCertificado] = useState(false);
  const [confirmarSaida, definirConfirmarSaida] = useState(false);

  if (!usuario || !token) return null;

  const certificadoLiberado = podeTrocarNomeCertificado(usuario.certificadoAlteradoEm);
  const proximaTroca = proximaTrocaCertificado(usuario.certificadoAlteradoEm);

  const trocouCertificado =
    certificadoLiberado &&
    nomeCertificado.trim() !== (usuario.nomeCertificado ?? usuario.nome);

  const houveMudanca =
    nome.trim() !== usuario.nome ||
    (emailAdicional.trim() || null) !== (usuario.emailAdicional || null) ||
    trocouCertificado;

  async function trocarFoto() {
    definirRecado(null);

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      definirRecado({
        texto: 'Precisamos de acesso às suas fotos para trocar a imagem do perfil.',
        tom: 'alerta',
      });
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (resultado.canceled) return;

    definirEnviandoFoto(true);
    try {
      const atualizado = await api.enviarFoto(token!, resultado.assets[0].uri);
      aplicarUsuario(atualizado);
      definirRecado({ texto: 'Foto de perfil atualizada.', tom: 'sucesso' });
    } catch (erro) {
      definirRecado({
        texto: erro instanceof FalhaApi ? erro.mensagem : 'Não foi possível enviar a foto.',
        tom: 'erro',
      });
    } finally {
      definirEnviandoFoto(false);
    }
  }

  /** Valida e, se o nome do certificado mudou, pede confirmação antes. */
  function salvar() {
    definirRecado(null);

    const novosErros: typeof erros = {};
    if (nome.trim().split(/\s+/).length < 2) {
      novosErros.nome = 'Informe nome e sobrenome.';
    }
    if (emailAdicional.trim() && !validarEmail(emailAdicional)) {
      novosErros.emailAdicional = 'E-mail inválido.';
    }
    definirErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    if (trocouCertificado) {
      definirConfirmarCertificado(true);
      return;
    }
    void gravar();
  }

  async function gravar() {
    definirConfirmarCertificado(false);
    definirSalvando(true);
    try {
      const atualizado = await api.atualizarPerfil(token!, {
        nome: nome.trim(),
        emailAdicional: emailAdicional.trim() || null,
        ...(trocouCertificado ? { nomeCertificado: nomeCertificado.trim() } : {}),
      });
      aplicarUsuario(atualizado);
      definirRecado({
        texto: trocouCertificado
          ? 'Tudo salvo. O nome do certificado só poderá ser alterado daqui a 6 meses.'
          : 'Alterações salvas.',
        tom: 'sucesso',
      });
    } catch (erro) {
      definirRecado({
        texto: erro instanceof FalhaApi ? erro.mensagem : 'Não foi possível salvar agora.',
        tom: 'erro',
      });
    } finally {
      definirSalvando(false);
    }
  }

  async function pedirTrocaDeSenha() {
    definirRecado(null);
    definirPedindoSenha(true);
    try {
      await api.solicitarTrocaSenha(token!);
      definirRecado({
        texto: `Enviamos um link de troca de senha para ${usuario!.email}.`,
        tom: 'sucesso',
      });
    } catch {
      definirRecado({
        texto: 'Não conseguimos enviar o link agora. Tente de novo em instantes.',
        tom: 'erro',
      });
    } finally {
      definirPedindoSenha(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['bottom']}>
      <StatusBar style="light" />
      <Cabecalho titulo="Meu perfil" voltar destinoVoltar="/" />

      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          contentContainerStyle={estilos.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Identificação */}
          <View style={estilos.topo}>
            <FotoPerfil nome={usuario.nome} foto={usuario.foto} tamanho={78} raio={22} />
            <View style={estilos.topoTexto}>
              <Text style={estilos.nome} numberOfLines={1}>
                {usuario.nome}
              </Text>
              <Text style={estilos.email} numberOfLines={1}>
                {usuario.email}
              </Text>
              <View style={estilos.selo}>
                <Selo
                  texto={assinante ? 'Assinatura ativa' : 'Modo visualização'}
                  tom={assinante ? 'sucesso' : 'neutro'}
                />
              </View>
            </View>
          </View>

          <Botao
            titulo="Trocar foto de perfil"
            variante="secundario"
            aoPressionar={trocarFoto}
            carregando={enviandoFoto}
            estilo={estilos.botaoFoto}
          />

          {recado ? (
            <View style={estilos.recado}>
              <Aviso texto={recado.texto} tom={recado.tom} />
            </View>
          ) : null}

          {/* Dados da conta */}
          <Secao titulo="DADOS DA CONTA">
            <Campo
              rotulo="Nome completo"
              value={nome}
              onChangeText={definirNome}
              erro={erros.nome}
              autoCapitalize="words"
            />

            <Campo
              rotulo="CPF / CNPJ"
              value={usuario.documento}
              bloqueado
              dica="Não pode ser alterado."
            />

            <Campo
              rotulo="E-mail principal"
              value={usuario.email}
              bloqueado
              dica="É o e-mail que valida sua assinatura."
            />

            <Campo
              rotulo="E-mail adicional"
              placeholder="institucional ou de trabalho"
              value={emailAdicional}
              onChangeText={definirEmailAdicional}
              erro={erros.emailAdicional}
              dica="Opcional. Pode ser alterado quando quiser."
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </Secao>

          {/* Segurança */}
          <Secao titulo="SEGURANÇA">
            <View style={estilos.cartao}>
              <Text style={estilos.cartaoTitulo}>Alterar senha</Text>
              <Text style={estilos.cartaoTexto}>
                A troca é feita por e-mail. Enviamos um link seguro para {usuario.email}.
              </Text>
              <Botao
                titulo="Solicitar alteração"
                variante="secundario"
                aoPressionar={pedirTrocaDeSenha}
                carregando={pedindoSenha}
                estilo={estilos.botaoCartao}
              />
            </View>
          </Secao>

          {/* Certificados */}
          <Secao titulo="CERTIFICADOS">
            <Campo
              rotulo="Nome que aparece nos certificados"
              value={nomeCertificado}
              onChangeText={definirNomeCertificado}
              bloqueado={!certificadoLiberado}
              autoCapitalize="words"
            />
            <Aviso
              tom="alerta"
              texto={
                certificadoLiberado
                  ? 'Pode ser alterado uma vez a cada 6 meses. Confira antes de salvar.'
                  : `Alterado em ${formatarData(usuario.certificadoAlteradoEm)}. Nova alteração liberada em ${formatarData(proximaTroca)}.`
              }
            />
          </Secao>

          <Botao
            titulo="Salvar alterações"
            aoPressionar={salvar}
            carregando={salvando}
            desabilitado={!houveMudanca}
            estilo={estilos.salvar}
          />

          <Pressable
            onPress={() => definirConfirmarSaida(true)}
            hitSlop={10}
            accessibilityRole="button"
            style={estilos.sair}
          >
            <Text style={estilos.sairTexto}>Sair da conta</Text>
          </Pressable>

          <Rodape />
        </ScrollView>
      </KeyboardAvoidingView>

      <Confirmacao
        visivel={confirmarCertificado}
        titulo="Trocar o nome do certificado?"
        mensagem={`Os certificados passam a sair como "${nomeCertificado.trim()}". Só dá para alterar de novo daqui a 6 meses.`}
        textoConfirmar="Trocar o nome"
        aoConfirmar={() => void gravar()}
        aoCancelar={() => definirConfirmarCertificado(false)}
      />

      <Confirmacao
        visivel={confirmarSaida}
        titulo="Sair da conta"
        mensagem="Você precisará entrar de novo para acessar os cursos."
        textoConfirmar="Sair"
        destrutivo
        aoConfirmar={() => void sair()}
        aoCancelar={() => definirConfirmarSaida(false)}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  flex: { flex: 1 },
  conteudo: {
    paddingHorizontal: Espaco.lg + 2,
    paddingTop: Espaco.xl,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.lg,
  },
  topoTexto: { flex: 1 },
  nome: {
    fontSize: Fonte.grande + 1,
    fontWeight: '700',
    color: Cores.texto,
  },
  email: {
    fontSize: Fonte.pequena,
    color: Cores.textoApagado,
    marginTop: 3,
  },
  selo: { marginTop: Espaco.sm + 1 },
  botaoFoto: { marginTop: Espaco.lg, height: 46 },
  recado: { marginTop: Espaco.lg },
  cartao: {
    borderWidth: 1,
    borderColor: Cores.bordaSuave,
    borderRadius: Raio.lg,
    padding: Espaco.lg,
  },
  cartaoTitulo: {
    fontSize: Fonte.corpo,
    fontWeight: '700',
    color: Cores.texto,
  },
  cartaoTexto: {
    fontSize: Fonte.pequena,
    color: Cores.textoApagado,
    lineHeight: 18,
    marginTop: 5,
  },
  botaoCartao: { marginTop: Espaco.md, height: 44 },
  salvar: { marginTop: Espaco.xl },
  sair: {
    alignSelf: 'center',
    paddingVertical: Espaco.lg,
  },
  sairTexto: {
    fontSize: Fonte.corpo,
    color: Cores.textoApagado,
    fontWeight: '600',
  },
});
