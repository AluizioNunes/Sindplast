import { Variants } from 'framer-motion';

// Animações reutilizáveis do Framer Motion - Otimizadas para performance
export const animations: Record<string, Variants> = {
  // Container principal - Mais suave
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        ease: "easeOut"
      }
    }
  },

  // Cards - Animação mais simples e rápida
  card: {
    hidden: { 
      opacity: 0, 
      y: 10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    }
  },

  // Títulos - Mais suave
  title: {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },

  // Botões - Mais responsivo
  button: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.15 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  },

  // Lista - Mais rápida
  list: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        duration: 0.2
      }
    }
  },

  // Item de lista - Mais simples
  listItem: {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Modal - Mais suave
  modal: {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.2, 
        ease: "easeOut" 
      }
    }
  },

  // Fade in - Mais rápido
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  },

  // Slide in from left - Mais suave
  slideInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    }
  },

  // Slide in from right - Mais suave
  slideInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    }
  },

  // Slide in from top - Mais suave
  slideInTop: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    }
  },

  // Slide in from bottom - Mais suave
  slideInBottom: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    }
  },

  // Scale in - Mais simples
  scaleIn: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  },

  // Bounce - Mais suave
  bounce: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }
};

// Configurações de transição otimizadas
export const transitions = {
  default: { duration: 0.2, ease: "easeOut" },
  fast: { duration: 0.15, ease: "easeOut" },
  slow: { duration: 0.3, ease: "easeOut" },
  spring: { type: "spring", stiffness: 400, damping: 25 }
}; 