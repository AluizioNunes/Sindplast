import { 
  format, 
  formatDistanceToNow, 
  parseISO, 
  isValid, 
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de datas
export const dateFormats = {
  // Data completa
  full: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  },

  // Data simples
  short: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
  },

  // Data com mês por extenso
  long: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  },

  // Hora
  time: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'HH:mm', { locale: ptBR });
  },

  // Data e hora
  dateTime: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  },

  // Dia da semana
  weekday: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'EEEE', { locale: ptBR });
  },

  // Mês e ano
  monthYear: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMMM yyyy', { locale: ptBR });
  }
};

// Tempo relativo
export const relativeTime = {
  // Tempo desde agora
  fromNow: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { locale: ptBR, addSuffix: true });
  },

  // Tempo até agora
  toNow: (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { locale: ptBR, addSuffix: false });
  },

  // Dias de diferença
  daysDifference: (date1: Date | string, date2: Date | string) => {
    const dateObj1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return differenceInDays(dateObj1, dateObj2);
  },

  // Horas de diferença
  hoursDifference: (date1: Date | string, date2: Date | string) => {
    const dateObj1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return differenceInHours(dateObj1, dateObj2);
  },

  // Minutos de diferença
  minutesDifference: (date1: Date | string, date2: Date | string) => {
    const dateObj1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const dateObj2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return differenceInMinutes(dateObj1, dateObj2);
  }
};

// Validação de datas
export const dateValidation = {
  // Verifica se é uma data válida
  isValid: (date: Date | string) => {
    if (typeof date === 'string') {
      return isValid(parseISO(date));
    }
    return isValid(date);
  },

  // Converte string para Date com validação
  parse: (dateString: string) => {
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : null;
  }
};

// Operações com datas
export const dateOperations = {
  // Início do dia
  startOfDay: (date: Date) => startOfDay(date),

  // Fim do dia
  endOfDay: (date: Date) => endOfDay(date),

  // Início da semana
  startOfWeek: (date: Date) => startOfWeek(date, { locale: ptBR }),

  // Fim da semana
  endOfWeek: (date: Date) => endOfWeek(date, { locale: ptBR }),

  // Início do mês
  startOfMonth: (date: Date) => startOfMonth(date),

  // Fim do mês
  endOfMonth: (date: Date) => endOfMonth(date),

  // Adicionar dias
  addDays: (date: Date, days: number) => addDays(date, days),

  // Subtrair dias
  subDays: (date: Date, days: number) => subDays(date, days),

  // Adicionar meses
  addMonths: (date: Date, months: number) => addMonths(date, months),

  // Subtrair meses
  subMonths: (date: Date, months: number) => subMonths(date, months),

  // Adicionar anos
  addYears: (date: Date, years: number) => addYears(date, years),

  // Subtrair anos
  subYears: (date: Date, years: number) => subYears(date, years)
};

// Funções específicas para o sistema
export const systemDates = {
  // Formata data de cadastro
  formatCadastro: (date: Date | string) => {
    if (!date) return 'N/A';
    return dateFormats.full(date);
  },

  // Formata data de contribuição
  formatContribuicao: (date: Date | string) => {
    if (!date) return 'N/A';
    return dateFormats.short(date);
  },

  // Tempo desde o cadastro
  tempoCadastro: (date: Date | string) => {
    if (!date) return 'N/A';
    return relativeTime.fromNow(date);
  },

  // Verifica se é recente (últimos 7 dias)
  isRecent: (date: Date | string) => {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const daysDiff = differenceInDays(new Date(), dateObj);
    return daysDiff <= 7;
  },

  // Verifica se é hoje
  isToday: (date: Date | string) => {
    if (!date) return false;
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    return format(dateObj, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  }
}; 