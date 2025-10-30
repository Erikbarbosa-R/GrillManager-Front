import { jsPDF } from 'jspdf';

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations?: any;
}

interface DeliveryInfo {
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  whatsapp: string;
}

interface OrderSummary {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  deliveryInfo: DeliveryInfo;
  timestamp: string;
  cashAmount?: number;
  change?: number;
  pixOrderId?: string;
}

export const generateOrderPDF = (order: OrderSummary) => {
  const doc = new jsPDF();
  
  // Configurações
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = 20;

  // Função para adicionar texto com quebra de linha
  const addText = (text: string, fontSize: number, isBold: boolean = false, align: 'left' | 'center' | 'right' = 'left') => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      
      let textX = margin;
      if (align === 'center') {
        textX = pageWidth / 2;
      } else if (align === 'right') {
        textX = pageWidth - margin;
      }
      
      doc.text(line, textX, yPosition, { align });
      yPosition += 7;
    });
  };

  // ==================== CABEÇALHO ====================
  addText('BOTECO DA MAMINHA', 16, true, 'center');
  yPosition += 5;
  addText('Rua do Comércio, 123 - Centro', 10, false, 'center');
  addText('📱 (11) 99999-9999', 10, false, 'center');
  yPosition += 5;
  addText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 10, false, 'center');

  // ==================== INFO DO PEDIDO ====================
  yPosition += 10;
  addText('📋 COMPROVANTE DE PEDIDO', 12, true);
  yPosition += 5;
  addText(`ID do Pedido: ${order.orderId}`, 10, false);
  addText(`Forma de Pagamento: ${order.paymentMethod}`, 10, false);
  
  // Extrair data e hora do timestamp
  const dateTime = new Date().toLocaleString('pt-BR');
  addText(`Data: ${dateTime}`, 10, true);

  // ==================== ITENS DO PEDIDO (TABELA NF) ====================
  yPosition += 10;
  addText('ITENS DO PEDIDO', 12, true);
  yPosition += 5;

  // Cabeçalho da tabela em formato de NF
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  
  // Definir posições das colunas
  const colQtd = margin;
  const colDesc = margin + 15;
  const colUnit = margin + 115;
  const colTotal = margin + 155;
  
  // Cabeçalho
  doc.text('Qtd', colQtd, yPosition);
  doc.text('Descrição', colDesc, yPosition);
  doc.text('Valor Unit.', colUnit, yPosition);
  doc.text('Total (R$)', colTotal, yPosition);
  
  yPosition += 5;
  addText('─────────────────────────────────────────────────────────────────', 8, false);
  yPosition -= 5;

  // Itens da tabela
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  order.items.forEach((item, index) => {
    yPosition += 6;
    
    // Quantidade
    doc.text(`${item.quantity}`, colQtd, yPosition);
    
    // Descrição (nome do item + customizações)
    let descricao = item.name;
    if (item.customizations) {
      Object.entries(item.customizations).forEach(([key, options]: [string, any]) => {
        if (Array.isArray(options) && options.length > 0) {
          const opts = options.map((opt: any) => opt.name).join(', ');
          descricao += ` - ${opts}`;
        }
      });
    }
    
    // Verificar se descrição cabe em uma linha
    const maxWidth = 95;
    const descLines = doc.splitTextToSize(descricao, maxWidth);
    
    // Primeira linha da descrição
    doc.text(descLines[0] || descricao.substring(0, 50), colDesc, yPosition);
    
    // Linhas adicionais se necessário
    if (descLines.length > 1) {
      for (let i = 1; i < descLines.length; i++) {
        yPosition += 3;
        doc.text(descLines[i], colDesc, yPosition);
      }
      // Voltar para alinhar com valores
      const returnY = yPosition - (descLines.length - 1) * 3;
      yPosition = returnY;
    }
    
    // Valor unitário
    const unitValue = item.unitPrice.toFixed(2).replace('.', ',');
    doc.text(unitValue, colUnit, yPosition);
    
    // Total
    const totalValue = item.totalPrice.toFixed(2).replace('.', ',');
    doc.text(totalValue, colTotal, yPosition);
    
    // Linha separadora entre itens
    if (index < order.items.length - 1) {
      yPosition += 4;
      addText('─────────────────────────────────────────────────────────────────', 7, false);
      yPosition -= 4;
    }
  });

  // ==================== RESUMO FINANCEIRO ====================
  yPosition += 10;
  addText('💵 RESUMO FINANCEIRO', 12, true);
  yPosition += 5;

  addText(`Subtotal:                                    R$ ${order.subtotal.toFixed(2)}`, 10, false);
  addText(`Taxa de Entrega:                            R$ ${order.deliveryFee.toFixed(2)}`, 10, false);
  addText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 10, false);
  addText(`TOTAL:                                      R$ ${order.total.toFixed(2)}`, 12, true);

  // Informações específicas do método de pagamento
  if (order.paymentMethod === 'Dinheiro' && order.cashAmount !== undefined) {
    yPosition += 5;
    addText(`Dinheiro Recebido:                          R$ ${order.cashAmount.toFixed(2)}`, 10, false);
    addText(`Troco:                                     R$ ${order.change?.toFixed(2) || '0.00'}`, 10, true);
  }

  if (order.pixOrderId) {
    yPosition += 5;
    addText(`ID PIX: ${order.pixOrderId}`, 9, true);
    addText('Status: Aguardando Aprovação', 9, false);
  }

  // ==================== ENDEREÇO DE ENTREGA ====================
  yPosition += 10;
  addText('📍 ENDEREÇO DE ENTREGA', 12, true);
  yPosition += 5;

  addText(`${order.deliveryInfo.street}, ${order.deliveryInfo.number}`, 10, false);
  addText(order.deliveryInfo.neighborhood, 10, false);
  if (order.deliveryInfo.complement) {
    addText(`Complemento: ${order.deliveryInfo.complement}`, 10, false);
  }
  addText(`WhatsApp Cliente: ${order.deliveryInfo.whatsapp}`, 10, false);

  // ==================== RODAPÉ ====================
  yPosition += 10;
  addText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 10, false);
  addText('OBRIGADO PELA SUA PREFERÊNCIA!', 11, true, 'center');
  addText('Seu pedido será preparado com muito carinho 💕', 9, false, 'center');
  
  // Adicionar QR Code se for PIX
  if (order.paymentMethod === 'PIX') {
    yPosition += 15;
    addText('⚠️ AGUARDE CONFIRMAÇÃO DO PAGAMENTO', 10, true, 'center');
    addText('O pedido só será confirmado após aprovação!', 9, false, 'center');
  }

  // ==================== SALVAR PDF ====================
  const fileName = `Pedido-${order.orderId}-${new Date().toISOString().replace(/[\/\\?%*:|"<>]/g, '_')}.pdf`;
  doc.save(fileName);

  // Também retornar o blob para poder abrir em nova aba
  return doc.output('blob');
};

