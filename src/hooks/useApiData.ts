import { useState, useEffect } from 'react';
import LocalApi from '../api/localApi';
import type { ProductData } from '../api/localApi';

export const useApiData = () => {
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const api = LocalApi.getInstance();
    
    // Carrega dados iniciais
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, restaurantResponse] = await Promise.all([
          api.getCategories(),
          api.getRestaurant()
        ]);

        if (categoriesResponse.success && restaurantResponse.success) {
          setData({
            categories: categoriesResponse.data || [],
            restaurant: restaurantResponse.data || {}
          });
        } else {
          setError('Erro ao carregar dados');
        }
      } catch (err) {
        setError('Erro de conexão');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Inscreve-se para atualizações em tempo real
    const unsubscribe = api.subscribe((newData) => {
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refreshData = async () => {
    const api = LocalApi.getInstance();
    try {
      setLoading(true);
      const [categoriesResponse, restaurantResponse] = await Promise.all([
        api.getCategories(),
        api.getRestaurant()
      ]);

      if (categoriesResponse.success && restaurantResponse.success) {
        setData({
          categories: categoriesResponse.data || [],
          restaurant: restaurantResponse.data || {}
        });
      }
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
