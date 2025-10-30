import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import CategoryNavigation from './components/CategoryNavigation';
import SearchBar from './components/SearchBar';
import ProductSection from './components/ProductSection';
import PopularSection from './components/PopularSection';
import ProductModal from './components/ProductModal';
import CartSummary from './components/CartSummary';
import { useApiData } from './hooks/useApiData';
import type { Product, ProductOption, CartItem } from './types';

function App() {
  const { data, loading, error } = useApiData();
  const [activeCategory, setActiveCategory] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Atualiza categorias quando dados da API mudam
  useEffect(() => {
    if (data?.categories) {
      setFilteredCategories(data.categories);
      if (data.categories.length > 0 && !activeCategory) {
        setActiveCategory(data.categories[0].id);
      }
    }
  }, [data, activeCategory]);

  // Handle search
  const handleSearch = (query: string) => {
    if (!data?.categories) return;
    
    if (query.trim() === '') {
      setFilteredCategories(data.categories);
    } else {
      const filtered = data.categories.map(category => ({
        ...category,
        products: category.products.filter((product: Product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        )
      })).filter(category => category.products.length > 0);
      setFilteredCategories(filtered);
    }
  };

  // Handle add to cart
  // Handle product click to open modal
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle add to cart from modal with customizations
  const handleAddToCartWithCustomizations = (
    product: Product, 
    customizations: Record<string, ProductOption[]>, 
    quantity: number
  ) => {
    // Create a customized product object
    const { customizations: _, ...productWithoutCustomizations } = product;
    const customizedProduct: CartItem = {
      ...productWithoutCustomizations,
      customizations: customizations,
      quantity: quantity
    };
    
    setCart(prev => [...prev, customizedProduct]);
    console.log(`Added ${product.name} with customizations to cart!`);
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter((_, i) => i !== index));
      return;
    }
    
    setCart(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Get all popular products
  const getAllPopularProducts = () => {
    if (!data?.categories) return [];
    return data.categories.flatMap(category => 
      category.products.filter((product: Product) => product.isPopular)
    );
  };

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    
    // Scroll to category with offset to show the title
    const element = document.getElementById(categoryId);
    if (element) {
      const headerHeight = 120; // Adjust this value based on your header height
      const offsetPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll spy for active category
  useEffect(() => {
    if (!data?.categories) return;
    
    const handleScroll = () => {
      const sections = data.categories.map(cat => document.getElementById(cat.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(data.categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar dados: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden max-w-full w-full">
      {/* Header with Banner */}
      <Header restaurant={data?.restaurant} />

      {/* Welcome Message */}
      <motion.div
        className="bg-black text-white py-4 px-6 mx-4 mt-4 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-semibold">Seja bem vindo(a) a Boteco da Maminha. Faça seu pedido abaixo! e ganhe desconto no seu pedido</p>
        </div>
      </motion.div>

      {/* Category Navigation */}
      {filteredCategories.length > 0 && (
        <CategoryNavigation
          categories={filteredCategories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Popular Section - Top of the page */}
          <PopularSection
            products={getAllPopularProducts()}
            onProductClick={handleProductClick}
          />

      {/* Main Content */}
      <main className="pb-20">
        <AnimatePresence mode="wait">
          {filteredCategories.map((category) => (
                <ProductSection
                  key={category.id}
                  category={category}
                  onProductClick={handleProductClick}
                />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente buscar por outros termos ou navegue pelas categorias acima.
              </p>
              <button
                onClick={() => handleSearch('')}
                className="btn-primary"
              >
                Limpar busca
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Cart Summary */}
      <CartSummary 
        cart={cart} 
        onClearCart={handleClearCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCartWithCustomizations}
      />
    </div>
  );
}

export default App;
