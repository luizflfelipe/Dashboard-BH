# People Analytics --- Especificação do MVP para Codex

## 1. Objetivo

Construir uma aplicação web moderna, executiva e minimalista para
**gestão de pessoas / People Analytics**.

A aplicação substituirá a visualização pouco legível atualmente feita
dentro de uma planilha Google Sheets, mantendo a planilha como **fonte
oficial dos dados** nesta primeira versão.

O foco do MVP é leitura e análise. Não criar funcionalidades de edição
de colaboradores pelo dashboard.

## 2. Princípios

-   Visual moderno, corporativo e executivo.
-   Priorizar clareza e leitura rápida.
-   A tela inicial deve conter o mínimo possível de informação.
-   Evitar excesso de cards, gráficos e indicadores.
-   Não transformar a aplicação em uma cópia visual do Excel/Google
    Sheets.
-   Separar visão executiva de exploração detalhada.
-   Design responsivo.
-   Não expor dados pessoais desnecessários no frontend.
-   Implementação simples, testável e fácil de evoluir.

## 3. Stack desejada

Frontend:

-   React
-   Vite
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   Recharts

Fonte de dados:

-   Google Sheets
-   Google Apps Script como camada de leitura/API

Não adicionar Supabase, Express ou outro banco/backend nesta primeira
versão sem necessidade técnica comprovada.

## 4. Fonte de dados

Existe um Google Sheets com quatro abas relevantes.

### 4.1. Mapa Operacional

Representa principalmente a posição atual do quadro.

Colunas existentes:

-   Matrícula
-   ID Rede
-   Login CMS/Hosanna
-   Grupo
-   Nome
-   Equipe
-   Site
-   Canal
-   Célula
-   Status
-   Entrada
-   Saída
-   Jornada
-   Turno
-   Coordenador
-   Gerente
-   Função
-   Sexo
-   Admissão
-   RG
-   CPF
-   Data de nasc.
-   Endereço
-   Bairro
-   Cidade
-   Telefone 1
-   Telefone 2
-   Código Vendedor
-   Início Férias
-   Fim Férias
-   Motivo Desligamento
-   Data da Demissão/Transferência
-   Centro de Custo
-   Área
-   Tipo de Custo
-   E-mail Corporativo
-   E-mail Acesso Workplace
-   Setor
-   Grupo Consolidado
-   ID Beedoo

Uso esperado: fonte principal para o quadro atual.

### 4.2. Transferidos e Desligados

Representa principalmente registros históricos de transferências e
desligamentos.

Possui estrutura semelhante ao Mapa Operacional, com algumas diferenças,
incluindo:

-   Atendimento no lugar de Grupo
-   Seção
-   Senioridade

Também contém:

-   Status
-   Admissão
-   Motivo Desligamento
-   Data da Demissão/Transferência
-   Site
-   Canal
-   Equipe
-   Função
-   Coordenador
-   Gerente
-   Área
-   Setor
-   Grupo Consolidado

Não assumir que os schemas das duas abas são idênticos. Criar
normalização explícita.

### 4.3. Distribuição

É a consolidação/dashboard atualmente existente dentro da própria
planilha.

Contém tabelas dinâmicas e agregações como:

-   Total Geral
-   Ativos
-   Afastados
-   Férias
-   Desligados
-   Distribuição por canal
-   Distribuição por função
-   Cruzamentos entre função e status

Esta aba **não deve ser a fonte primária da nova aplicação**.

Usá-la como referência para validar se os cálculos realizados pela
aplicação correspondem às regras atualmente utilizadas pela operação.

### 4.4. Consolidando Jan--Dez 2025

Contém histórico mensal consolidado.

Há blocos por mês com dados como:

-   Função
-   Afastado
-   Ativo
-   Desligado
-   Total Geral

Uso esperado: alimentar a visualização histórica e evolução mensal.

## 5. Segurança e privacidade

Não retornar para o frontend campos que não sejam necessários para o
dashboard.

Por padrão, excluir da API de visualização:

-   CPF
-   RG
-   Endereço
-   Bairro
-   Telefones
-   Data de nascimento
-   demais dados pessoais sem necessidade funcional

O Google Sheets não deve ser publicado publicamente apenas para permitir
leitura direta pelo frontend.

O Apps Script deve funcionar como camada intermediária e retornar
somente os dados necessários.

Nunca colocar credenciais, tokens ou secrets no código-fonte.

## 6. Navegação do MVP

A sidebar deve possuir apenas:

1.  Visão Geral
2.  Quadro Atual
3.  Movimentações
4.  Histórico

Evitar novas páginas no MVP sem necessidade.

------------------------------------------------------------------------

# 7. Tela --- Visão Geral

Objetivo:

Responder rapidamente:

> Qual é a situação atual do quadro?

A home deve ser extremamente limpa.

## KPIs

Exibir somente:

-   Total Geral
-   Ativos
-   Afastados
-   Férias
-   Desligados
-   Transferidos

Cada card deve priorizar o número.

Evitar badges, comparações e textos excessivos.

Pode mostrar uma porcentagem discreta do total quando fizer sentido.

## Conteúdo abaixo dos KPIs

Somente dois componentes:

### Evolução do quadro

Gráfico de linha com histórico mensal do headcount.

### Distribuição atual

Resumo simples da composição por status:

-   Ativos
-   Férias
-   Afastados
-   Desligados

Não adicionar na home:

-   headcount por função;
-   headcount por canal;
-   headcount por site;
-   listas extensas;
-   tabelas de colaboradores;
-   múltiplos alertas;
-   dezenas de gráficos.

Essas informações pertencem às outras telas.

------------------------------------------------------------------------

# 8. Tela --- Quadro Atual

Objetivo:

Permitir explorar a composição atual do quadro sem reproduzir a planilha
inteira.

## Filtros

Inicialmente:

-   busca por colaborador;
-   Site;
-   Canal;
-   Equipe;
-   Status.

A arquitetura deve permitir adicionar futuramente:

-   Área;
-   Gerente;
-   Coordenador;
-   Função;
-   Setor.

## Resumos

Exibir dois blocos simples:

### Por Site

Distribuição de colaboradores por site.

### Por Canal

Distribuição por canal.

Preferir barras horizontais simples.

## Tabela de colaboradores

Exibir somente dados organizacionais úteis.

Campos iniciais:

-   Nome
-   Função
-   Equipe
-   Site
-   Coordenador
-   Status

Não mostrar CPF, RG, endereço, telefone etc.

Preparar a estrutura para futuramente abrir um painel lateral com
detalhes organizacionais do colaborador.

------------------------------------------------------------------------

# 9. Tela --- Movimentações

Objetivo:

Responder:

> O que entrou, saiu ou mudou no quadro?

## KPIs

-   Admissões
-   Desligamentos
-   Transferências
-   Saldo

Saldo inicial:

`admissões - desligamentos`

Não incluir transferências no saldo sem antes validar a regra de
negócio.

## Gráfico

Exibir evolução mensal de:

-   admissões;
-   desligamentos.

## Férias

Resumo pequeno:

-   pessoas atualmente em férias;
-   férias iniciando no período;
-   retornos no período.

## Movimentações recentes

Tabela simples:

-   Data
-   Colaborador
-   Tipo de movimentação
-   Função
-   Site

Os tipos podem incluir:

-   Admissão
-   Desligamento
-   Transferência
-   Início de férias
-   Retorno de férias

Não inventar regras para identificar eventos. Implementar somente quando
o mapeamento da planilha estiver validado.

------------------------------------------------------------------------

# 10. Tela --- Histórico

Objetivo:

Responder:

> Como o quadro evoluiu ao longo do tempo?

## Filtro

Seletor de ano.

Começar utilizando os dados disponíveis em `Consolidando Jan–Dez 2025`.

## Gráfico principal

Evolução mensal do headcount.

Permitir visualizar séries como:

-   Total
-   Ativos
-   Afastados
-   Desligados

Não mostrar todas obrigatoriamente ao mesmo tempo se prejudicar a
leitura.

## Tabela mensal

Estrutura:

  Mês     Quadro   Ativos   Afastados   Desligados
  ----- -------- -------- ----------- ------------

Ao selecionar um mês, preparar a arquitetura para futuramente mostrar
composição por função.

------------------------------------------------------------------------

# 11. Arquitetura de dados

Fluxo esperado:

``` text
Google Sheets
    |
    +-- Mapa Operacional
    +-- Transferidos e Desligados
    +-- Consolidando Jan-Dez 2025
    |
    v
Google Apps Script
    |
    +-- leitura
    +-- normalização
    +-- filtragem de campos
    +-- agregações necessárias
    |
    v
API JSON
    |
    v
React + TypeScript
```

A aba `Distribuição` deve ser utilizada inicialmente para validação dos
resultados, e não como dependência principal da aplicação.

## Normalização

Criar uma camada clara entre os nomes das colunas do Sheets e o modelo
utilizado pelo frontend.

Exemplo conceitual:

``` ts
interface Employee {
  employeeId: string;
  name: string;
  team: string | null;
  site: string | null;
  channel: string | null;
  cell: string | null;
  status: string;
  shift: string | null;
  coordinator: string | null;
  manager: string | null;
  role: string | null;
  admissionDate: string | null;
  area: string | null;
  sector: string | null;
}
```

Não acoplar os componentes React diretamente aos nomes e posições das
colunas do Google Sheets.

------------------------------------------------------------------------

# 12. Regras de negócio

Não assumir valores de `Status` antes de inspecionar os dados reais.

Antes de implementar cálculos definitivos, identificar:

-   todos os valores distintos de Status;
-   como a planilha atual determina Ativo;
-   como determina Afastado;
-   como determina Férias;
-   como determina Desligado;
-   como determina Transferido;
-   como evita duplicidade entre Mapa Operacional e
    Transferidos/Desligados;
-   como o Total Geral é calculado;
-   como são tratadas datas vazias ou inválidas.

Usar a aba `Distribuição` como controle de validação.

Exemplo de validação:

``` text
Indicador       Distribuição    Aplicação
Total Geral          X              X
Ativos               X              X
Afastados            X              X
Férias               X              X
Desligados           X              X
```

Não considerar a implementação correta enquanto os números não forem
explicáveis.

------------------------------------------------------------------------

# 13. Histórico

O histórico consolidado permite análises mensais, mas não assumir que
ele representa todas as alterações organizacionais individuais.

Se uma pessoa mudou de equipe e o dado original foi sobrescrito, essa
movimentação pode não estar disponível historicamente.

Não fabricar histórico ausente.

No futuro poderá existir mecanismo de snapshots, mas isso está fora do
MVP inicial.

------------------------------------------------------------------------

# 14. UI/UX

Direção visual:

-   moderna;
-   executiva;
-   minimalista;
-   corporativa;
-   bastante espaço em branco;
-   hierarquia tipográfica forte;
-   poucos elementos por tela;
-   cores utilizadas principalmente para status;
-   cards com bordas discretas;
-   sidebar compacta;
-   responsivo.

A Visão Geral deve poder ser entendida em poucos segundos.

Evitar:

-   gradients excessivos;
-   glassmorphism exagerado;
-   animações chamativas;
-   cards desnecessários;
-   gráficos 3D;
-   excesso de cores;
-   dashboards extremamente densos.

------------------------------------------------------------------------

# 15. Desenvolvimento

Implementar incrementalmente.

Ordem sugerida:

1.  estrutura React/Vite/TypeScript;
2.  layout global e sidebar;
3.  Visão Geral com dados mockados;
4.  Quadro Atual;
5.  Movimentações;
6.  Histórico;
7.  modelagem da camada de dados;
8.  Apps Script;
9.  integração frontend/API;
10. validação dos indicadores contra a aba Distribuição.

Não começar pela integração antes de estabilizar os componentes e
contratos de dados.

## Qualidade

-   TypeScript strict.
-   Evitar `any`.
-   Componentes pequenos e reutilizáveis somente quando houver
    reutilização real.
-   Não criar abstrações prematuras.
-   Tratar loading, erro e ausência de dados.
-   Evitar dependências desnecessárias.
-   Rodar lint e typecheck.
-   Executar testes relevantes.
-   Validar responsividade.

------------------------------------------------------------------------

# 16. Restrições importantes

-   Não alterar a planilha existente.
-   Não alterar o processo de atualização utilizado pela equipe.
-   Dashboard somente leitura no MVP.
-   Não criar banco paralelo no MVP.
-   Não expor PII desnecessária.
-   Não implementar regras de negócio por suposição.
-   Não utilizar números mockados como se fossem dados reais após a
    integração.
-   Não adicionar funcionalidades fora deste escopo sem necessidade.

------------------------------------------------------------------------

# 17. Critério de conclusão do MVP

O MVP estará funcional quando:

1.  As quatro telas estiverem navegáveis e responsivas.
2.  Os dados forem lidos de forma segura do Google Sheets.
3.  Os campos forem normalizados antes de chegar aos componentes.
4.  A Visão Geral apresentar os KPIs corretos.
5.  Quadro Atual permitir busca e filtros.
6.  Movimentações utilizar datas/eventos reais.
7.  Histórico reproduzir corretamente os consolidados disponíveis.
8.  Os principais totais forem validados contra a aba Distribuição.
9.  Nenhum dado pessoal desnecessário for exposto no frontend.
10. Lint, typecheck e testes relevantes passarem.

## Observação para o Codex

Antes de alterar um projeto existente:

1.  inspecione a estrutura atual;
2.  identifique ferramentas, convenções e dependências já utilizadas;
3.  reutilize o que já existe quando adequado;
4.  apresente mudanças arquiteturais relevantes antes de executá-las;
5.  não adicione dependências sem necessidade;
6.  preserve funcionalidades existentes;
7.  ao final, informe arquivos modificados, decisões tomadas, testes
    executados e limitações pendentes.
