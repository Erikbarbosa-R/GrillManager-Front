// API Local para comunicação entre Admin e Frontend
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProductData {
  categories: any[];
  restaurant: any;
}

class LocalApi {
  private static instance: LocalApi;
  private data: ProductData;
  private listeners: ((data: ProductData) => void)[] = [];

  constructor() {
    // Carrega dados do localStorage ou usa dados padrão
    this.data = this.loadFromStorage();
  }

  static getInstance(): LocalApi {
    if (!LocalApi.instance) {
      LocalApi.instance = new LocalApi();
    }
    return LocalApi.instance;
  }

  private loadFromStorage(): ProductData {
    try {
      const stored = localStorage.getItem('grillmanager-data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
    
    // Retorna dados padrão se não houver dados salvos
    return {
      categories: [],
      restaurant: {
        name: "Boteco da Maminha",
        description: "Seja bem vindo(a) ao Boteco da Maminha. Faça seu pedido abaixo e ganhe desconto no seu pedido!",
        bannerImage: "",
        logo: "",
        rating: 4.6,
        whatsapp: "+55 11 99999-9999",
        address: "Rua das Flores, 123 - Centro"
      }
    };
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('grillmanager-data', JSON.stringify(this.data));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.data));
  }

  // Métodos da API
  async getCategories(): Promise<ApiResponse<any[]>> {
    return {
      success: true,
      data: this.data.categories
    };
  }

  async getRestaurant(): Promise<ApiResponse<any>> {
    return {
      success: true,
      data: this.data.restaurant
    };
  }

  async updateCategories(categories: any[]): Promise<ApiResponse<any[]>> {
    this.data.categories = categories;
    this.saveToStorage();
    this.notifyListeners();
    
    return {
      success: true,
      data: this.data.categories
    };
  }

  async updateRestaurant(restaurant: any): Promise<ApiResponse<any>> {
    this.data.restaurant = restaurant;
    this.saveToStorage();
    this.notifyListeners();
    
    return {
      success: true,
      data: this.data.restaurant
    };
  }

  async addProduct(categoryId: string, product: any): Promise<ApiResponse<any>> {
    const categoryIndex = this.data.categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return {
        success: false,
        error: 'Categoria não encontrada'
      };
    }

    this.data.categories[categoryIndex].products.push(product);
    this.saveToStorage();
    this.notifyListeners();

    return {
      success: true,
      data: product
    };
  }

  async updateProduct(categoryId: string, productId: string, updatedProduct: any): Promise<ApiResponse<any>> {
    const categoryIndex = this.data.categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return {
        success: false,
        error: 'Categoria não encontrada'
      };
    }

    const productIndex = this.data.categories[categoryIndex].products.findIndex((p: any) => p.id === productId);
    if (productIndex === -1) {
      return {
        success: false,
        error: 'Produto não encontrado'
      };
    }

    this.data.categories[categoryIndex].products[productIndex] = updatedProduct;
    this.saveToStorage();
    this.notifyListeners();

    return {
      success: true,
      data: updatedProduct
    };
  }

  async deleteProduct(categoryId: string, productId: string): Promise<ApiResponse<boolean>> {
    const categoryIndex = this.data.categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return {
        success: false,
        error: 'Categoria não encontrada'
      };
    }

    const initialLength = this.data.categories[categoryIndex].products.length;
    this.data.categories[categoryIndex].products = this.data.categories[categoryIndex].products.filter((p: any) => p.id !== productId);
    
    if (this.data.categories[categoryIndex].products.length === initialLength) {
      return {
        success: false,
        error: 'Produto não encontrado'
      };
    }

    this.saveToStorage();
    this.notifyListeners();

    return {
      success: true,
      data: true
    };
  }

  // Sistema de notificações em tempo real
  subscribe(listener: (data: ProductData) => void): () => void {
    this.listeners.push(listener);
    
    // Retorna função para cancelar a inscrição
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Método para sincronizar com dados externos (futuro)
  async syncWithExternalData(): Promise<ApiResponse<boolean>> {
    // Aqui você pode implementar sincronização com uma API externa
    // Por enquanto, apenas retorna sucesso
    return {
      success: true,
      data: true
    };
  }

  // Método para exportar dados
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  // Método para importar dados
  importData(jsonData: string): ApiResponse<boolean> {
    try {
      const importedData = JSON.parse(jsonData);
      this.data = importedData;
      this.saveToStorage();
      this.notifyListeners();
      
      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Dados inválidos'
      };
    }
  }
}

export default LocalApi;
