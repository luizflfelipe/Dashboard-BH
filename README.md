# Dashboard-BH

Aplicação de leitura executiva para People Analytics. As telas incluem Visão geral, Quadro atual, Movimentações e Histórico.

## Modo demonstração

Sem configuração de API, o dashboard usa registros inventados incluídos em `src/data/demoPeopleData.ts`. Um aviso persistente identifica a demonstração. Nomes, equipes, movimentações e valores não representam pessoas nem indicadores reais.

## Desenvolvimento

Requer Node.js 20 ou superior.

```sh
npm install
npm run dev
```

Para gerar a compilação de produção:

```sh
npm run build
npm run preview
```

## Componentes de UI

O projeto está configurado com shadcn/ui sobre Vite, React, Tailwind CSS v4 e Base UI. Os componentes instalados ficam em `src/components/ui`; para adicionar outros, use `npx shadcn@latest add <componente>`, por exemplo `npx shadcn@latest add dialog`. O tema VTRON do tweakcn foi aplicado e adaptado à identidade do site em `src/index.css`, preservando DM Sans, bordas compactas e a paleta executiva. O alias `@/` aponta para `src/`.

## Integração com Apps Script

Defina `VITE_PEOPLE_API_URL` no ambiente de build apontando para a URL de leitura do Apps Script. Sem essa variável, a aplicação permanece no modo demonstrativo. O frontend espera JSON seguindo o contrato de `DashboardData` em `src/types/people.ts`:

```json
{
  "source": "apps-script",
  "isFictional": false,
  "updatedAt": "2025-12-31T12:00:00.000Z",
  "employees": [],
  "history": [],
  "movements": []
}
```

`employees` usa o modelo normalizado privacy-safe: `employeeId`, `name`, `team`, `site`, `channel`, `cell`, `status`, `shift`, `coordinator`, `manager`, `role`, `admissionDate`, `area` e `sector`. Não inclua CPF, RG, endereço, telefones ou data de nascimento na resposta. `history` usa `month`, `monthShort`, `year`, `total`, `active`, `leave`, `vacation` e `dismissed`. `movements` usa `id`, `date`, `employeeName`, `type`, `role` e `site`.

A planilha deve permanecer privada. A normalização, filtragem de campos e agregação devem acontecer no Apps Script. Os rótulos e cálculos demonstrativos da interface não são validação das regras reais; valide os status, datas, duplicidades, indicadores e eventos contra as abas oficiais antes de trocar os dados demonstrativos pela fonte real.
