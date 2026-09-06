import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import CategoryFilter, { filterProducts } from '../components/CategoryFilter';
import './Catalog.css';

export default function Catalog() {
  const { t, lang } = useLanguage();
  const { products } = useCart();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    alcohol: 'all',
    category: 'all',
    wineType: 'all',
  });

  useEffect(() => {
    const alcohol = searchParams.get('alcohol');
    const category = searchParams.get('category');
    const wineType = searchParams.get('wineType');
    setFilters((prev) => ({
      ...prev,
      ...(alcohol && { alcohol }),
      ...(category && { category }),
      ...(wineType && { wineType }),
    }));
  }, [searchParams]);

  const filtered = useMemo(
    () => filterProducts(products, filters, search, lang),
    [products, filters, search, lang]
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'alcohol' && value === 'nonAlcoholic') {
        next.category = 'all';
        next.wineType = 'all';
      }
      if (key === 'category' && value !== 'wine') {
        next.wineType = 'all';
      }
      return next;
    });
  };

  return (
    <div className="container page">
      <h1 className="page-title">{t.catalog.title}</h1>

      <div className="catalog-search">
        <input
          className="input"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.catalog.search}
        />
      </div>

      <CategoryFilter filters={filters} activeFilters={filters} onChange={handleFilterChange} />

      <p className="catalog-count">
        {filtered.length} {t.catalog.items}
      </p>

      {filtered.length === 0 ? (
        <div className="catalog-empty">
          <p>{t.catalog.noResults}</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
