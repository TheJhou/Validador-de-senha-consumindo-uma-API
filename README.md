# Validador de Senhas Seguras

Validador de senhas em tempo real com verificação de força, integração com API Have I Been Pwned e penalização por dados pessoais.

## 🚀 Funcionalidades

- ✅ Validação em tempo real de 5 requisitos:
  - Mínimo 8 caracteres
  - Letra maiúscula (A-Z)
  - Letra minúscula (a-z)
  - Número (0-9)
  - Caractere especial (!@#$%...)
- 📊 Score de 0 a 100 com cores dinâmicas
- 📈 Barra de progresso visual (fraca/média/forte)
- 🔍 Integração com API Have I Been Pwned (verifica senhas comprometidas)
- 👁️ Toggle para mostrar/ocultar senha
- 🚫 Campo de senha sem espaços
- ⚠️ Toggle switches para:
  - Dados pessoais (reduz 20 pontos)
  - Senha comprometida/compartilhada (reduz 30 pontos)
- 🎨 Design minimalista com fundo preto e card centralizado
- 📱 Interface responsiva

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)
- Web Crypto API (SHA-1)
- Have I Been Pwned API

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/validador-senhas.git
```

2. Navegue para o diretório:
```bash
cd validador-senhas
```

3. Abra o arquivo `index.html` em seu navegador

## 🎯 Como Usar

1. Digite sua senha no campo de entrada
2. Veja a validação em tempo real:
   - Score de 0 a 100
   - Barra de progresso de força
   - Lista de requisitos atendidos
3. Marque os toggles se aplicável:
   - **Dados pessoais**: Se a senha contém nome, data de nascimento, etc.
   - **Senha comprometida**: Se a senha já foi compartilhada ou vazada
4. A API Have I Been Pwned verifica automaticamente se a senha foi comprometida
5. Use o botão 👁️ para mostrar/ocultar a senha

## 📊 Sistema de Pontuação

- Cada requisito vale 20 pontos (total: 100)
- **Dados pessoais**: -20 pontos
- **Senha comprometida**: -30 pontos

**Cores do score:**
- 🟢 Verde (80+): Senha forte
- 🟡 Amarelo (50-79): Senha média
- 🔴 Vermelho (1-49): Senha fraca
- ⚫ Cinza (0): Senha vazia

## 🔒 Segurança

- A senha nunca é enviada completa para a API
- Apenas os 5 primeiros caracteres do hash SHA-1 são enviados (k-anonymity)
- Validação ocorre localmente no navegador
- Senhas com dados pessoais são penalizadas
- Integração com Have I Been Pwned para verificar vazamentos

## 📁 Estrutura do Projeto

```
validador-senhas/
├── index.html          # Estrutura HTML
├── styles.css          # Estilização CSS
├── script.js           # Lógica JavaScript
└── README.md           # Documentação
```

## 🎨 Customização

### Alterar cores
Edite as variáveis CSS em `styles.css`:
```css
:root {
    --success: #22c55e;
    --error: #ef4444;
    --warning: #f59e0b;
    --black: #000000;
    --card-bg: #1a1a1a;
}
```

### Alterar requisitos mínimos
Edite as funções em `script.js`:
```javascript
function checkLength(password) {
    return password.length >= 8; // Altere o valor
}
```

## 🌐 API Have I Been Pwned

O validador integra com a API pública Have I Been Pwned para verificar se a senha foi comprometida em vazamentos de dados. A API usa k-anonymity para proteger a privacidade do usuário.

Mais informações: https://haveibeenpwned.com/API/v3

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir novas funcionalidades
- Fazer pull requests

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com HTML, CSS e JavaScript puro.

---

**Nota**: Este validador é uma ferramenta educacional. Para produção, considere usar bibliotecas de validação de senhas estabelecidas e seguir as melhores práticas de segurança da sua organização.
