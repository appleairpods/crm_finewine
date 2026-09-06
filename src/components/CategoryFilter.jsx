import { useLanguage } from '../i18n/LanguageContext';
import './CategoryFilter.css';

export default function CategoryFilter({ filters, activeFilters, onChange }) {
  const { t } = useLanguage();

  const groups = [
    {
      key: 'alcohol',
      label: t.catalog.filters,
      options: [
        { id: 'all', label: t.catalog.all },
        { id: 'alcoholic', label: t.catalog.alcoholic },
        { id: 'nonAlcoholic', label: t.catalog.nonAlcoholic },
      ],
    },
    {
      key: 'category',
      label: t.catalog.wine + ' / ' + t.catalog.whisky,
      options: [
        { id: 'all', label: t.catalog.all },
        { id: 'wine', label: t.catalog.wine },
        { id: 'whisky', label: t.catalog.whisky },
      ],
      hidden: activeFilters.alcohol === 'nonAlcoholic',
    },
    {
      key: 'wineType',
      label: t.catalog.wine,
      options: [
        { id: 'all', label: t.catalog.all },
        { id: 'red', label: t.catalog.red },
        { id: 'white', label: t.catalog.white },
        { id: 'rose', label: t.catalog.rose },
        { id: 'sparkling', label: t.catalog.sparkling },
        { id: 'dry', label: t.catalog.dry },
        { id: 'sweet', label: t.catalog.sweet },
      ],
      hidden: activeFilters.alcohol === 'nonAlcoholic' || activeFilters.category === 'whisky',
    },
  ];

  return (
    <div className="category-filter">
      {groups
        .filter((g) => !g.hidden)
        .map((group) => (
          <div key={group.key} className="category-filter__group">
            <div className="category-filter__scroll">
              {group.options.map((opt) => {
                const isActive = (activeFilters[group.key] || 'all') === opt.id;
                return (
                  <button
                    key={opt.id}
                    className={`category-filter__chip ${isActive ? 'active' : ''}`}
                    onClick={() => onChange(group.key, opt.id)}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}

export function filterProducts(products, filters, search, lang) {
  return products.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      const name = p.name[lang]?.toLowerCase() || p.name.ru.toLowerCase();
      if (!name.includes(q)) return false;
    }

    if (filters.alcohol === 'alcoholic' && !p.alcoholic) return false;
    if (filters.alcohol === 'nonAlcoholic' && p.alcoholic) return false;

    if (filters.category && filters.category !== 'all') {
      if (p.category !== filters.category) return false;
    }

    if (filters.wineType && filters.wineType !== 'all') {
      if (filters.wineType === 'dry' || filters.wineType === 'sweet') {
        if (p.sweetness !== filters.wineType) return false;
      } else {
        if (p.wineType !== filters.wineType) return false;
      }
    }

    return true;
  });
}
