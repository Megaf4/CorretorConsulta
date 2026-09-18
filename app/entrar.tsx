import { useState } from 'react';
import {
  Keyboard,
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

import { Logo } from '@/components/marca/Logo';
import { Botao } from '@/components/ui/Botao';
import { Campo } from '@/components/ui/Campo';
import { Rodape } from '@/components/ui/Rodape';
import { Cores, Espaco, Fonte } from '@/constants/theme';
import { api, FalhaApi, MODO_SIMULADO } from '@/lib/api';
import { useSessao } from '@/lib/sessao';
import {
  formatarIdentificador,
  identificadorValido,
  normalizarIdentificador,
} from '@/lib/validacao';

export default function TelaEntrar() {
  const { entrar } = useSessao();

  const [identificador, definirIdentificador] = useState('');
  const [senha, definirSenha] = useState('');
  const [erros, definirErros] = useState<{ identificador?: string; senha?: string }>({});
  const [aviso, definirAviso] = useState<string | null>(null);
  const [enviando, definirEnviando] = useState(false);

  async function fazerLogin() {
    Keyboard.dismiss();
    definirAviso(null);

    const novosErros: typeof erros = {};
    if (!identificador.trim()) {
      novosErros.identificador = 'Informe seu e-mail ou CPF/CNPJ.';
    } else if (!identificadorValido(identificador)) {
      novosErros.identificador = 'E-mail ou CPF/CNPJ inválido.';
    }
    if (!senha) novosErros.senha = 'Informe sua senha.';

    definirErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    definirEnviando(true);
    try {
      await entrar(normalizarIdentificador(identificador), senha);
      // A navegação acontece sozinha: o guard do app/_layout.tsx
      // libera as rotas protegidas assim que a sessão existe.
    } catch (erro) {
      if (erro instanceof FalhaApi) {
        if (erro.campo === 'identificador' || erro.campo === 'senha') {
          definirErros({ [erro.campo]: erro.mensagem });
        } else {
          definirAviso(erro.mensagem);
        }
      } else {
        definirAviso('Algo deu errado. Tente novamente.');
      }
    } finally {
      definirEnviando(false);
    }
  }

  async function recuperarSenha() {
    Keyboard.dismiss();
    if (!identificador.trim()) {
      definirErros({ identificador: 'Informe o e-mail para receber o link.' });
      return;
    }
    definirErros({});
    try {
      await api.recuperarSenha(normalizarIdentificador(identificador));
      definirAviso('Se a conta existir, enviamos um link de redefinição para o e-mail.');
    } catch {
      definirAviso('Não foi possível enviar agora. Tente de novo em instantes.');
    }
  }

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={estilos.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={estilos.topo}>
            <Logo largura={168} />
          </View>

          <Campo
            rotulo="E-mail ou CPF/CNPJ"
            placeholder="voce@corretora.com.br"
            value={identificador}
            onChangeText={(texto) => definirIdentificador(formatarIdentificador(texto))}
            erro={erros.identificador}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="username"
            returnKeyType="next"
          />

          <Campo
            rotulo="Senha"
            placeholder="Sua senha"
            value={senha}
            onChangeText={definirSenha}
            erro={erros.senha}
            senha
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={fazerLogin}
          />

          <Pressable
            onPress={recuperarSenha}
            hitSlop={8}
            style={estilos.linkDireita}
            accessibilityRole="button"
          >
            <Text style={estilos.link}>Esqueci minha senha</Text>
          </Pressable>

          {aviso ? (
            <View style={estilos.aviso}>
              <Text style={estilos.avisoTexto}>{aviso}</Text>
            </View>
          ) : null}

          <Botao
            titulo="Entrar"
            aoPressionar={fazerLogin}
            carregando={enviando}
            estilo={estilos.botao}
          />

          <View style={estilos.criarConta}>
            <Text style={estilos.criarContaTexto}>Não possui uma conta? </Text>
            <Pressable
              hitSlop={8}
              accessibilityRole="button"
              onPress={() =>
                definirAviso(
                  'A criação de conta é feita no site corretorconsulta.com.br.'
                )
              }
            >
              <Text style={estilos.criarContaLink}>Crie uma agora!</Text>
            </Pressable>
          </View>

          {MODO_SIMULADO ? (
            <Text style={estilos.demo}>
              Modo de teste, sem API conectada. Use christian.ricarth@gmail.com com a
              senha corretor2026.
            </Text>
          ) : null}

          <View style={estilos.flex} />
          <Rodape />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  flex: {
    flex: 1,
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: Espaco.xl + Espaco.sm,
  },
  topo: {
    alignItems: 'center',
    paddingTop: Espaco.xxxl,
    paddingBottom: Espaco.xxxl,
  },
  linkDireita: {
    alignSelf: 'flex-end',
    marginTop: -Espaco.sm,
    marginBottom: Espaco.xl,
  },
  link: {
    fontSize: Fonte.corpo,
    color: Cores.petroleo,
    fontWeight: '500',
  },
  aviso: {
    backgroundColor: Cores.fundoSuave,
    borderRadius: 9,
    padding: Espaco.md,
    marginBottom: Espaco.lg,
  },
  avisoTexto: {
    fontSize: Fonte.pequena + 1,
    color: Cores.textoSecundario,
    lineHeight: 18,
  },
  botao: {
    marginTop: Espaco.xs,
  },
  criarConta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Espaco.xl,
    flexWrap: 'wrap',
  },
  criarContaTexto: {
    fontSize: Fonte.corpo,
    color: Cores.textoSecundario,
  },
  criarContaLink: {
    fontSize: Fonte.corpo,
    color: Cores.petroleo,
    fontWeight: '700',
  },
  demo: {
    marginTop: Espaco.xl,
    fontSize: Fonte.minuscula,
    color: Cores.placeholder,
    textAlign: 'center',
    lineHeight: 16,
  },
});
