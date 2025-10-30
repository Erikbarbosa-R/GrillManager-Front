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
      } catch (err) {
        setError('Erro de conexão');
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
    } catch (err) {
      setError('Erro ao atualizar dados');
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
