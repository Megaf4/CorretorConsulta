# Como colocar as telas no repositório

Este pacote substitui os quatro zips anteriores (login, perfil, cursos e
telas-restantes). Ele já é o **estado final**, com tudo mesclado na ordem certa.

**Não use mais os zips antigos.** Alguns arquivos (`lib/api.ts`, `lib/tipos.ts`,
`components/ui/Cabecalho.tsx`, entre outros) apareciam em mais de uma entrega, e
descompactar fora de ordem faz uma versão antiga sobrescrever a nova. Este pacote
resolve isso.

Testado contra o `main` atual do repositório (commit `20c7b8f`, o do Supabase):
`tsc --noEmit` limpo, build gerado e navegação conferida no navegador.

---

## Antes de começar: o `lib/supabase.ts` do Franco

O repositório já tem o cliente Supabase. **Este pacote não encosta nesse
arquivo** — ele continua exatamente como está.

Mas tem um detalhe que vale avisar ao Franco: hoje o `createClient` roda assim
que o arquivo é importado, e com as variáveis de ambiente vazias ele estoura
`supabaseUrl is required`. Testei e confirmei. Enquanto ninguém importa esse
arquivo, nada acontece; no dia em que uma tela importar sem o `.env` pronto, o
app não abre. Um `if` antes do `createClient`, ou um valor padrão, resolve.

---

## Passo a passo

### 1. Crie uma branch

```bash
git checkout main
git pull
git checkout -b telas-app
```

Nunca direto no `main`: se algo der errado, você só apaga a branch.

### 2. Copie os arquivos

Cole o conteúdo desta pasta na raiz do repositório, mantendo os caminhos.
São 47 arquivos novos e 5 que substituem os atuais:

| Substitui | Por quê |
|---|---|
| `app/_layout.tsx` | Passa a ter a guarda de rotas (sem sessão, só o login existe) |
| `app/+not-found.tsx` | Traduzido e usando as cores da marca |
| `app.json` | Ganha a permissão de fotos do seletor de imagem |
| `.env.example` | Agora cobre Supabase e a API das telas |

### 3. Apague o template do Expo

```bash
git rm -r "app/(tabs)" app/modal.tsx components/EditScreenInfo.tsx \
  components/StyledText.tsx components/ExternalLink.tsx \
  components/useClientOnlyValue.ts components/useClientOnlyValue.web.ts
```

Esse é o passo que mais gera confusão se for esquecido: são as telas de exemplo
do template. Se ficarem, viram rotas acessíveis **sem login**, e o app abre no
"Tab One" em vez do nosso.

Podem ficar: `components/Themed.tsx`, `components/useColorScheme.ts`,
`constants/Colors.ts` e `app/+html.tsx`. Não atrapalham.

### 4. Instale a dependência que falta

```bash
npx expo install expo-image-picker
```

É a única. O `expo-secure-store` já está no `package.json`.

### 5. Crie o `.env`

```bash
cp .env.example .env
```

Deixe as variáveis vazias por enquanto: o app roda em **modo simulado**, com
dados de exemplo, e dá para testar tudo sem back-end. O `.env` já está no
`.gitignore`, então não vai subir.

### 6. Teste antes de commitar

```bash
npx tsc --noEmit     # não pode aparecer nada
npm start
```

Entre com `christian.ricarth@gmail.com` e senha `corretor2026`. Confira: login,
Início com os cursos, abrir um curso, abrir uma aula, marcar como concluída, e o
menu do hambúrguer com os seis itens.

### 7. Commit e PR

```bash
git add -A
git commit -m "feat: telas do app (login, inicio, cursos, aulas, perfil, biblioteca, planos, faq e contato)"
git push -u origin telas-app
```

Abra o PR para o `main` e peça uma olhada do Franco antes de mesclar, por causa
do ponto do Supabase logo abaixo.

---

## O ponto que precisa de conversa com o Franco

Este é o único conflito real, e ele não é de arquivo — é de arquitetura.

Hoje existem **dois caminhos de autenticação** no projeto:

- `lib/supabase.ts` (Franco) — autentica pelo Supabase Auth
- `lib/api.ts` + `lib/sessao.tsx` (este pacote) — autentica contra uma API REST

Eles não colidem por nome de arquivo e o app compila com os dois juntos, então
pode mesclar sem medo. Mas os dois não devem viver assim para sempre.

A boa notícia é que a troca é pequena, e foi de propósito. **Nenhuma tela chama
`fetch` direto**: tudo passa pelo `lib/api.ts`. Para ligar no Supabase, o Franco
reescreve só o corpo das funções daquele arquivo. Por exemplo:

```ts
// hoje
async entrar(identificador, senha) {
  return requisicao<Sessao>('/auth/entrar', {
    metodo: 'POST',
    corpo: { identificador, senha },
  });
}

// depois
async entrar(identificador, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: identificador,
    password: senha,
  });
  if (error) throw new FalhaApi('Senha incorreta.', 'senha');
  // monta e devolve o mesmo objeto Sessao de sempre
}
```

Enquanto a assinatura da função e o formato do retorno continuarem iguais,
**nenhuma tela precisa mudar**. É exatamente a sessão de "encaixe" que estava
prevista no plano: eu construo com dado de exemplo, o Franco troca por dado real.

Dois detalhes para ele:

1. O login aceita **e-mail ou CPF/CNPJ**. O Supabase Auth só entende e-mail, então
   quando vier um documento é preciso buscar o e-mail correspondente antes
   (uma consulta na tabela de usuários) e só depois chamar o `signInWithPassword`.
2. O `lib/armazenamento.ts` guarda o token no SecureStore. Se o Supabase passar a
   cuidar da sessão, esse arquivo perde a função e pode sair.

---

## O que ainda não está no app

- **Tema claro/escuro** — o seletor não existe. Precisa da paleta escura montada
  no `constants/theme.ts` e de uma passada nas telas.
- **Favoritar** — o endpoint `POST /cursos/:id/favorito` está pronto no
  `lib/api.ts`, falta decidir onde fica o botão.
- **Player de vídeo** — o lugar está marcado com comentário em
  `app/(app)/cursos/[id]/aula/[aulaId].tsx`. A função `gravarProgresso(valor)` já
  existe: o player do Panda só precisa chamá-la com a porcentagem assistida.
- **Cadastro** — a tela não existe, por decisão sua. O botão "Crie uma agora!" no
  login hoje só avisa que a criação de conta é feita no site.
