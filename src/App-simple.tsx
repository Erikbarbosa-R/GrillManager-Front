import { useState } from 'react';
import { restaurantData, categories } from './data/mockData';
import type { Product } from './types';

function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setActiveCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile-First */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sticky top-0 z-50">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-center">{restaurantData.name}</h1>
          <p className="text-sm text-center mt-1 opacity-90">{restaurantData.description}</p>
        </div>
      </header>

      {/* Navegação Mobile */}
      <nav className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Conteúdo Mobile */}
      <main className="max-w-md mx-auto px-4 py-4">
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{category.name}</h2>
            
            <div className="space-y-3">
              {category.products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex">
                    {/* Imagem do produto */}
                    <div className="w-20 h-20 flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs font-medium">Sem foto</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Info do produto */}
                    <div className="flex-1 p-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-600 font-bold text-sm">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        <button
                          onClick={() => setCart(prev => [...prev, product])}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Pedir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Carrinho Mobile */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
          <span className="text-sm font-bold">{cart.length}</span>
        </div>
      )}
    </div>
  );
}

export default App;
