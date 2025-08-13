// Funções utilitárias para uso em toda a aplicação

/**
 * Formata uma data para o formato brasileiro
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};

/**
 * Formata um valor monetário para o formato brasileiro
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Capitaliza a primeira letra de cada palavra
 */
export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}; 