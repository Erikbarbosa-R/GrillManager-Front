import LocalApi from '../api/localApi';
import { categories, restaurantData } from '../data/mockData';

// Função para inicializar dados padrão se não existirem
export const initializeDefaultData = () => {
  const api = LocalApi.getInstance();
  
  // Verifica se já existem dados salvos
  const existingData = localStorage.getItem('grillmanager-data');
  
  if (!existingData) {
    // Inicializa com dados padrão
    api.updateCategories(categories);
    api.updateRestaurant(restaurantData);
    console.log('Dados padrão inicializados');
  }
};

// Função para resetar dados para padrão
export const resetToDefaultData = () => {
  const api = LocalApi.getInstance();
  api.updateCategories(categories);
  api.updateRestaurant(restaurantData);
  console.log('Dados resetados para padrão');
};

// Função para exportar dados atuais
export const exportCurrentData = () => {
  const api = LocalApi.getInstance();
  const data = api.exportData();
  
  // Cria um blob com os dados
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Cria um link para download
  const link = document.createElement('a');
  link.href = url;
  link.download = `grillmanager-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Função para importar dados
export const importData = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const api = LocalApi.getInstance();
        const result = api.importData(e.target?.result as string);
        
        if (result.success) {
          resolve(true);
        } else {
          reject(new Error(result.error || 'Erro ao importar dados'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsText(file);
  });
};
