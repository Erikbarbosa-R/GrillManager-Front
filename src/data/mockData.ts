import type { Restaurant, Category } from '../types';

export const restaurantData: Restaurant = {
  name: "Boteco da Maminha",
  description: "Seja bem vindo(a) ao Boteco da Maminha. Faça seu pedido abaixo e ganhe desconto no seu pedido!",
  bannerImage: "",
  logo: "",
  rating: 4.6,
  whatsapp: "+55 11 99999-9999",
  address: "Rua das Flores, 123 - Centro"
};

export const categories: Category[] = [
  {
    id: "marmita-promocao",
    name: "Marmita com Super Promoção",
    description: "Pratos completos com preços especiais",
    products: [
      {
        id: "marmita-maminha",
        name: "Marmita de Maminha",
        description: "Saborosa maminha grelhada, acompanhada de arroz, feijão, salada e fritas. Opção perfeita para quem busca sabor e praticidade.",
        price: 22.90,
        image: "",
        category: "marmita-promocao",
        isPopular: true,
        detailedDescription: "Nossa marmita de maminha é preparada com carinho, usando cortes selecionados de carne bovina grelhados no ponto perfeito. Acompanha arroz soltinho, feijão temperado, salada fresca com tomate, alface e cebola, além de batata frita crocante.",
        preparationTime: "15-20 minutos",
        allergens: ["Glúten"],
        customizations: [
          {
            id: "size",
            name: "Tamanho",
            type: "size",
            required: true,
            description: "Escolha o tamanho da sua marmita",
            options: [
              { id: "small", name: "Pequena", price: 0, isDefault: true, description: "Ideal para 1 pessoa" },
              { id: "medium", name: "Média", price: 3.00, description: "Ideal para 1-2 pessoas" },
              { id: "large", name: "Grande", price: 6.00, description: "Ideal para 2-3 pessoas" }
            ]
          },
          {
            id: "side-dish",
            name: "Acompanhamentos",
            type: "side-dish",
            required: true,
            description: "Escolha seus acompanhamentos preferidos",
            options: [
              { id: "rice-only", name: "Só Arroz", price: 0, isDefault: true, description: "Apenas arroz branco" },
              { id: "rice-beans", name: "Arroz + Feijão", price: 0, description: "Arroz branco e feijão temperado" },
              { id: "rice-pasta", name: "Arroz + Macarrão", price: 2.00, description: "Arroz branco e macarrão" },
              { id: "rice-beans-pasta", name: "Arroz + Feijão + Macarrão", price: 3.00, description: "Todos os acompanhamentos" }
            ]
          },
          {
            id: "extras",
            name: "Extras",
            type: "extra",
            required: false,
            description: "Adicione extras ao seu pedido",
            options: [
              { id: "extra-meat", name: "Carne Extra", price: 8.00, description: "Porção adicional de carne" },
              { id: "cheese", name: "Queijo Ralado", price: 2.00, description: "Queijo parmesão ralado" },
              { id: "bacon", name: "Bacon", price: 3.00, description: "Bacon crocante" },
              { id: "salad", name: "Salada Extra", price: 2.50, description: "Salada fresca adicional" }
            ]
          }
        ]
      },
      {
        id: "marmita-carne-sol",
        name: "Marmita de Carne do Sol",
        description: "Deliciosa marmita de carne do sol grelhada, acompanhada de arroz, feijão tropeiro, mandioca e salada.",
        price: 22.99,
        image: "",
        category: "marmita-promocao",
        isPopular: true,
        detailedDescription: "Carne do sol grelhada no ponto perfeito, acompanhada de arroz soltinho, feijão tropeiro tradicional, mandioca cozida e salada fresca.",
        preparationTime: "15-20 minutos",
        allergens: ["Glúten"],
        customizations: [
          {
            id: "size",
            name: "Tamanho",
            type: "size",
            required: true,
            description: "Escolha o tamanho da sua marmita",
            options: [
              { id: "small", name: "Pequena", price: 0, isDefault: true, description: "Ideal para 1 pessoa" },
              { id: "medium", name: "Média", price: 3.00, description: "Ideal para 1-2 pessoas" },
              { id: "large", name: "Grande", price: 6.00, description: "Ideal para 2-3 pessoas" }
            ]
          },
          {
            id: "side-dish",
            name: "Acompanhamentos",
            type: "side-dish",
            required: true,
            description: "Escolha seus acompanhamentos preferidos",
            options: [
              { id: "rice-only", name: "Só Arroz", price: 0, isDefault: true, description: "Apenas arroz branco" },
              { id: "rice-beans", name: "Arroz + Feijão Tropeiro", price: 0, description: "Arroz branco e feijão tropeiro" },
              { id: "rice-cassava", name: "Arroz + Mandioca", price: 2.00, description: "Arroz branco e mandioca cozida" },
              { id: "rice-beans-cassava", name: "Arroz + Feijão + Mandioca", price: 3.00, description: "Todos os acompanhamentos" }
            ]
          }
        ]
      },
      {
        id: "marmita-linguica",
        name: "Marmita de Linguiça",
        description: "Marmita especial com linguiça artesanal, arroz soltinho, feijão temperadinho e legumes frescos.",
        price: 20.99,
        image: "",
        category: "marmita-promocao"
      },
      {
        id: "frango-parmegiana",
        name: "Frango Parmegiana & Legumes",
        description: "Frango Parmegiana suculento com queijo derretido e molho caseiro, servido com legumes frescos e arroz.",
        price: 20.99,
        image: "",
        category: "marmita-promocao"
      }
    ]
  },
  {
    id: "frango-assado",
    name: "Frango Assado na Churrasqueira",
    description: "Frango assado na hora, temperado com especiarias especiais",
    products: [
      {
        id: "frango-assado-simples",
        name: "Frango Assado",
        description: "Frango inteiro assado na churrasqueira com tempero especial da casa.",
        price: 22.00,
        image: "",
        category: "frango-assado",
        isPopular: true
      },
      {
        id: "galeto-baiao",
        name: "1 Galeto + 1 Baião",
        description: "Galeto assado acompanhado de baião de dois tradicional.",
        price: 30.00,
        image: "",
        category: "frango-assado",
        isPopular: true
      }
    ]
  },
  {
    id: "combos-carne",
    name: "Combos de Carne para 2-3 Pessoas",
    description: "Pratos generosos para compartilhar",
    products: [
      {
        id: "combo-churrasco",
        name: "Combo Churrasco Completo",
        description: "Picanha, linguiça, frango e costela assados na churrasqueira. Serve 2-3 pessoas.",
        price: 89.90,
        image: "",
        category: "combos-carne"
      },
      {
        id: "combo-familia",
        name: "Combo Família",
        description: "Misto de carnes, acompanhamentos e bebidas. Ideal para família de 3 pessoas.",
        price: 75.00,
        image: "",
        category: "combos-carne"
      }
    ]
  },
  {
    id: "entradinhas",
    name: "Entradinhas",
    description: "Petiscos para começar bem",
    products: [
      {
        id: "coxinha",
        name: "Coxinha da Casa",
        description: "Coxinha artesanal recheada com frango desfiado e catupiry.",
        price: 4.50,
        image: "",
        category: "entradinhas",
        isPopular: true
      },
      {
        id: "pastel",
        name: "Pastel de Carne",
        description: "Pastel crocante recheado com carne moída temperada.",
        price: 3.50,
        image: "",
        category: "entradinhas"
      }
    ]
  },
  {
    id: "guarnicoes",
    name: "Guarnições",
    description: "Acompanhamentos especiais",
    products: [
      {
        id: "arroz-feijao",
        name: "Arroz e Feijão",
        description: "Arroz soltinho e feijão temperado da casa.",
        price: 8.00,
        image: "",
        category: "guarnicoes"
      },
      {
        id: "farofa",
        name: "Farofa da Casa",
        description: "Farofa crocante com bacon e temperos especiais.",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
        category: "guarnicoes"
      }
    ]
  },
  {
    id: "bebidas",
    name: "Bebidas",
    description: "Refrigerantes, sucos e cervejas",
    products: [
      {
        id: "coca-cola",
        name: "Coca-Cola 350ml",
        description: "Refrigerante gelado.",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=200&fit=crop",
        category: "bebidas",
        isPopular: true
      },
      {
        id: "cerveja",
        name: "Cerveja Skol 350ml",
        description: "Cerveja gelada.",
        price: 5.50,
        image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=200&fit=crop",
        category: "bebidas"
      }
    ]
  },
  {
    id: "marmita-proteinas",
    name: "Marmita com 2 Proteínas",
    description: "Marmitas com dupla proteína",
    products: [
      {
        id: "marmita-dupla",
        name: "Marmita Dupla Proteína",
        description: "Frango grelhado + carne bovina, acompanhado de arroz, feijão e salada.",
        price: 28.90,
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop",
        category: "marmita-proteinas"
      },
      {
        id: "marmita-mista",
        name: "Marmita Mista",
        description: "Linguiça + frango, com arroz, feijão tropeiro e legumes.",
        price: 26.90,
        image: "",
        category: "marmita-proteinas"
      }
    ]
  }
];
