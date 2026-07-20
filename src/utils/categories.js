export const CATEGORIES = ['SUV', 'Berline', 'Citadine', 'Coupe', 'Break', 'Monospace', 'Utilitaire', '4x4'];

export const CAT_LABELS = {
  fr: { SUV: 'SUV', Berline: 'Berline', Citadine: 'Citadine', Coupe: 'Coupé', Break: 'Break', Monospace: 'Monospace', Utilitaire: 'Utilitaire', '4x4': '4x4' },
  en: { SUV: 'SUV', Berline: 'Saloon', Citadine: 'City Car', Coupe: 'Coupé', Break: 'Estate', Monospace: 'MPV', Utilitaire: 'Van', '4x4': '4x4' },
  de: { SUV: 'SUV', Berline: 'Limousine', Citadine: 'Kleinwagen', Coupe: 'Coupé', Break: 'Kombi', Monospace: 'Van', Utilitaire: 'Nutzfahrzeug', '4x4': '4x4' },
  ar: { SUV: 'دفع رباعي', Berline: 'سيدان', Citadine: 'مدينة', Coupe: 'كوبيه', Break: 'عائلية', Monospace: 'موносبيس', Utilitaire: 'تجاري', '4x4': '4x4' },
  es: { SUV: 'SUV', Berline: 'Berlina', Citadine: 'Utilitario', Coupe: 'Cupé', Break: 'Familiar', Monospace: 'Monovolumen', Utilitaire: 'Furgoneta', '4x4': '4x4' },
  it: { SUV: 'SUV', Berline: 'Berlina', Citadine: 'Utilitaria', Coupe: 'Coupé', Break: 'Station wagon', Monospace: 'Monovolume', Utilitaire: 'Furgone', '4x4': '4x4' },
  pt: { SUV: 'SUV', Berline: 'Sedan', Citadine: 'Utilitário', Coupe: 'Coupé', Break: 'Perua', Monospace: 'Monovolume', Utilitaire: 'Furgão', '4x4': '4x4' },
};

export const CATEGORY_ICONS = {
  SUV: '🚙',
  Berline: '🚗',
  Citadine: '🏙️',
  Coupe: '🏎️',
  Break: '🧳',
  Monospace: '👨‍👩‍👧‍👦',
  Utilitaire: '🚐',
  '4x4': '🏔️',
};

export function getCategoryLabel(lang, category) {
  return (CAT_LABELS[lang] || CAT_LABELS.fr)[category] || category;
}
