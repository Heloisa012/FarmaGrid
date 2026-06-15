# FarmaGrid — React App

Plataforma de saúde digital para pacientes, médicos e farmácias.

## 🚀 Como rodar

```bash
# 1. Instale as dependências
npm install

# 2. Rode em modo desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

## 📁 Estrutura do projeto

```
src/
├── App.jsx                        # Raiz — controla navegação entre páginas
├── main.jsx                       # Ponto de entrada React
│
├── styles/
│   ├── global.css                 # Variáveis CSS, botões, cards, tabelas...
│   ├── landing.css                # Estilos da landing page
│   ├── login.css                  # Estilos do login/cadastro
│   └── sidebar.css                # Estilos da sidebar do dashboard
│
├── components/
│   ├── Icons.jsx                  # Todos os ícones SVG como componentes React
│   ├── Logo.jsx                   # Componente do logo FarmaGrid
│   ├── Sidebar.jsx                # Sidebar de navegação dos dashboards
│   └── UI.jsx                     # Componentes reutilizáveis (SBadge, StatCard, PageHeader)
│
├── pages/
│   ├── Landing.jsx                # Landing page com hero, serviços, planos, footer
│   └── Login.jsx                  # Tela de login e cadastro
│
├── dashboards/
│   ├── PatientDashboard.jsx       # Dashboard do paciente (consultas, receitas, loja, clube)
│   ├── ProviderDashboard.jsx      # Dashboard do médico (agenda, pacientes, prontuários)
│   └── PharmacyDashboard.jsx      # Dashboard da farmácia (pedidos, estoque, relatórios)
│
└── data/
    └── mockData.js                # Dados simulados para toda a aplicação
```

## 👤 Tipos de usuário

Ao fazer login, selecione o tipo para acessar o dashboard correspondente:

| Tipo | Dashboard |
|------|-----------|
| **Paciente** | Consultas, exames, receitas, loja, clube de descontos |
| **Médico/Clínica** | Agenda, gestão de pacientes, prontuários, receitas |
| **Farmácia** | Pedidos, estoque com alertas, relatórios, clientes |

## 🛠 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção em `/dist` |
| `npm run preview` | Visualiza o build de produção |
