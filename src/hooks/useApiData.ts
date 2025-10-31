import { useState, useEffect } from 'react';
import { listCategories } from '../services/categories';
import { listProducts } from '../services/products';
import { getRestaurant } from '../services/restaurant';

export type ProductData = {
  categories: Array<any>;
  restaurant: any;
};

export const useApiData = () => {
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [{ data: cats }, { data: prods }, { data: rest }] = await Promise.all([
          listCategories(),
          listProducts(),
          getRestaurant(),
        ]);

        // Agrupar produtos por categoria
        const productsByCategory: Record<string, any[]> = {};
        (prods || []).forEach((p: any) => {
          const key = p.category || 'uncategorized';
          if (!productsByCategory[key]) productsByCategory[key] = [];
          productsByCategory[key].push({
            ...p,
            isPopular: Boolean(p.popular),
          });
        });

        const categoriesWithProducts = (cats || []).map((c: any) => ({
          ...c,
          products: productsByCategory[c.id] || [],
        }));

        setData({
          categories: categoriesWithProducts,
          restaurant: rest || {},
        });
      } catch (err: any) {
        console.error('[useApiData] Erro ao carregar dados:', err);
        const errorMessage = err?.message || err?.error?.message || 'Erro de conexão';
        setError(errorMessage.includes('VITE_API_BASE_URL') 
          ? 'URL da API não configurada. Verifique as variáveis de ambiente.' 
          : errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [{ data: cats }, { data: prods }, { data: rest }] = await Promise.all([
        listCategories(),
        listProducts(),
        getRestaurant(),
      ]);

      const productsByCategory: Record<string, any[]> = {};
      (prods || []).forEach((p: any) => {
        const key = p.category || 'uncategorized';
        if (!productsByCategory[key]) productsByCategory[key] = [];
        productsByCategory[key].push({
          ...p,
          isPopular: Boolean(p.popular),
        });
      });

      const categoriesWithProducts = (cats || []).map((c: any) => ({
        ...c,
        products: productsByCategory[c.id] || [],
      }));

      setData({
        categories: categoriesWithProducts,
        restaurant: rest || {},
      });
    } catch (err: any) {
      console.error('[useApiData] Erro ao atualizar dados:', err);
      const errorMessage = err?.message || err?.error?.message || 'Erro ao atualizar dados';
      setError(errorMessage.includes('VITE_API_BASE_URL') 
        ? 'URL da API não configurada. Verifique as variáveis de ambiente.' 
        : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refreshData
  };
};
