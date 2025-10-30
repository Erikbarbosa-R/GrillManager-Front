# 🍖 Boteco da Maminha - Cardápio Virtual

Um cardápio virtual moderno e responsivo desenvolvido com React, TypeScript e TailwindCSS, seguindo as melhores práticas de performance e UX.

## ✨ Características

- **Design Responsivo**: Otimizado para dispositivos móveis e desktop
- **Navegação Intuitiva**: Categorias com scroll suave para seções
- **Busca em Tempo Real**: Filtro instantâneo de produtos
- **Animações Fluidas**: Transições suaves com Framer Motion
- **Performance Otimizada**: Lazy loading e otimizações de renderização
- **TypeScript**: Tipagem forte para melhor manutenibilidade
- **TailwindCSS**: Estilização moderna e consistente

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápido
- **TailwindCSS** - Framework CSS utilitário
- **Framer Motion** - Biblioteca de animações
- **Lucide React** - Ícones modernos

## 📱 Funcionalidades

### Categorias Disponíveis
- 🍱 **Marmita com Super Promoção** - Pratos completos com preços especiais
- 🐔 **Frango Assado na Churrasqueira** - Frango assado na hora
- 🥩 **Combos de Carne para 2-3 Pessoas** - Pratos generosos para compartilhar
- 🍤 **Entradinhas** - Petiscos para começar bem
- 🥗 **Guarnições** - Acompanhamentos especiais
- 🥤 **Bebidas** - Refrigerantes, sucos e cervejas
- 🍖 **Marmita com 2 Proteínas** - Marmitas com dupla proteína

### Recursos Principais
- **Banner com Perfil**: Imagem de destaque com informações do restaurante
- **Navegação por Categorias**: Botões que fazem scroll automático para as seções
- **Barra de Pesquisa**: Busca instantânea por nome ou descrição dos produtos
- **Cards de Produtos**: Layout limpo com imagem, descrição e preço
- **Carrinho de Compras**: Contador visual de itens adicionados
- **Animações**: Transições suaves e micro-interações

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header.tsx      # Cabeçalho com banner
│   ├── CategoryNavigation.tsx  # Navegação por categorias
│   ├── SearchBar.tsx    # Barra de pesquisa
│   ├── ProductCard.tsx  # Card de produto
│   └── ProductSection.tsx  # Seção de produtos
├── data/               # Dados mock
│   └── mockData.ts     # Dados do restaurante e produtos
├── types/              # Definições TypeScript
│   └── index.ts        # Interfaces e tipos
├── App.tsx             # Componente principal
├── main.tsx           # Ponto de entrada
└── style.css           # Estilos globais
```

## 🎨 Design System

### Cores
- **Primary**: Laranja (#f97316) - Botões principais e destaques
- **Secondary**: Cinza (#64748b) - Elementos secundários
- **Background**: Cinza claro (#f8fafc) - Fundo da página
- **Text**: Cinza escuro (#0f172a) - Texto principal

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700

### Componentes
- **Cards**: Bordas arredondadas, sombras sutis
- **Botões**: Estados hover e active com transições
- **Animações**: Duração de 200-500ms para transições

## 🚀 Performance

### Otimizações Implementadas
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: React.memo para componentes puros
- **Scroll Spy**: Detecção eficiente de seções ativas
- **Debounce**: Busca otimizada com delay
- **Image Optimization**: Imagens otimizadas do Unsplash

### Métricas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptações Mobile
- Navegação horizontal com scroll
- Cards empilhados verticalmente
- Botões com tamanho touch-friendly
- Texto otimizado para leitura

## 🔧 Customização

### Adicionando Novos Produtos
Edite o arquivo `src/data/mockData.ts`:

```typescript
{
  id: "novo-produto",
  name: "Nome do Produto",
  description: "Descrição detalhada",
  price: 25.90,
  image: "url-da-imagem",
  category: "categoria-id",
  isPopular: true // opcional
}
```

### Modificando Cores
Atualize `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // suas cores personalizadas
      }
    }
  }
}
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

- **Restaurante**: Boteco da Maminha
- **WhatsApp**: +55 11 99999-9999
- **Endereço**: Rua das Flores, 123 - Centro

---

Desenvolvido com ❤️ para o Boteco da Maminha
