# ViaJuntos - Viaje Sempre Acompanhado

Um aplicativo web simples e eficiente para conectar pessoas que querem viajar juntas. Encontre companhia para suas próximas aventuras de forma segura e rápida.

## 🌟 Funcionalidades

### 👤 Sistema de Usuários
- Cadastro completo com perfil personalizado
- Sistema de login seguro
- Avatares automáticos baseados no e-mail
- Perfil editável com estatísticas de viagens

### 🗺️ Viagens e Eventos
- Crie e anuncie suas viagens
- Busque viagens por destino, título ou descrição
- Filtre por categorias (Praia, Montanha, Cidade, Evento, etc.)
- Sistema de favoritos para salvar viagens interessantes

### 💬 Chat Integrado
- Chat em tempo real para cada viagem
- Acesso restrito aos participantes aprovados
- Interface limpa e responsiva

### 👥 Sistema de Participação
- Organizador pode aprovar ou rejeitar participantes
- Visualização de interessados e confirmados
- Limite de vagas configurável

### 🎨 Design e Experiência
- Interface moderna e clean com Tailwind CSS
- Totalmente responsivo para mobile e desktop
- Navegação intuitiva
- Design minimalista e fácil de usar

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Manipulação de Datas**: date-fns
- **Roteamento**: React Router
- **Armazenamento**: LocalStorage (simulação de banco de dados)

## 📱 Como Usar

### 1. Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/viajar-juntos.git
cd viajar-juntos

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

### 2. Passo a Passo

1. **Cadastre-se**: Crie sua conta com informações básicas
2. **Explore**: Navegue pelas viagens disponíveis ou use a busca
3. **Participe**: Solicite participação em viagens que te interessam
4. **Crie**: Anuncie suas próprias viagens se for o organizador
5. **Converse**: Use o chat para combinar detalhes com os participantes
6. **Gerencie**: Acompanhe suas viagens e estatísticas no perfil

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Login.js        # Tela de login
│   ├── Register.js     # Tela de cadastro
│   ├── Dashboard.js    # Dashboard principal
│   ├── CreateTrip.js   # Formulário de criação
│   ├── TripList.js     # Lista de viagens
│   ├── TripDetails.js  # Detalhes da viagem
│   ├── Chat.js         # Chat em tempo real
│   └── Profile.js      # Perfil do usuário
├── App.js              # Componente principal
├── index.js            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🔧 Funcionalidades Técnicas

### Armazenamento de Dados
- **LocalStorage**: Simulação de banco de dados para desenvolvimento
- **Dados Persistidos**: Usuários, viagens, mensagens do chat
- **Limpeza Automática**: Eventos expirados são removidos automaticamente

### Segurança
- Validação de formulários no cliente
- Sistema de aprovação de participantes
- Acesso restrito ao chat
- Dados sensíveis não expostos

### Responsividade
- Design mobile-first
- Menu inferior para dispositivos móveis
- Layout adaptativo para diferentes telas

## 🌐 Demonstração

O aplicativo já inclui dados de exemplo para demonstração:
- 3 usuários de exemplo
- Viagens em diferentes categorias
- Sistema completo de interação

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adicionando nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🚀 Próximos Passos

- [ ] Integração com banco de dados real (Firebase/Supabase)
- [ ] Sistema de notificações
- [ ] Avaliações e feedbacks entre usuários
- [ ] Integração com APIs de mapas
- [ ] Sistema de pagamentos para compartilhamento de custos
- [ ] Aplicativo mobile nativo

## 📞 Contato

Desenvolvido com ❤️ para conectar viajantes!

Se você tiver alguma sugestão ou encontrar algum problema, por favor abra uma issue no GitHub.
