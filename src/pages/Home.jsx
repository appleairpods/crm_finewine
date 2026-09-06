import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const { t } = useLanguage();
  const { products } = useCart();

  const featured = products.filter((p) => p.featured && p.stock > 0).slice(0, 4);

  const categories = [
    { key: 'wine', label: t.catalog.wine, filter: { alcohol: 'alcoholic', category: 'wine' } },
    { key: 'whisky', label: t.catalog.whisky, filter: { alcohol: 'alcoholic', category: 'whisky' } },
    { key: 'sparkling', label: t.catalog.sparkling, filter: { alcohol: 'alcoholic', category: 'wine', wineType: 'sparkling' } },
    { key: 'nonAlcoholic', label: t.catalog.nonAlcoholic, filter: { alcohol: 'nonAlcoholic' } },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__bg" />
        <div className="container hero__content">
          <h1 className="hero__title">{t.home.heroTitle}</h1>
          <p className="hero__subtitle">{t.home.heroSubtitle}</p>
          <p className="hero__text">{t.home.heroText}</p>
          <Link to="/catalog" className="btn btn-primary">
            {t.home.browseCatalog}
          </Link>
        </div>
      </section>

      <section className="container page">
        <h2 className="section-title">{t.home.categories}</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/catalog?alcohol=${cat.filter.alcohol}${cat.filter.category ? `&category=${cat.filter.category}` : ''}${cat.filter.wineType ? `&wineType=${cat.filter.wineType}` : ''}`}
              className="category-card"
            >
              <span className="category-card__label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container page">
        <h2 className="section-title">{t.home.featured}</h2>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="benefits">
        <div className="container">
          <h2 className="section-title">{t.home.whyUs}</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-card__num">01</div>
              <h3>{t.home.benefit1Title}</h3>
              <p>{t.home.benefit1Text}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-card__num">02</div>
              <h3>{t.home.benefit2Title}</h3>
              <p>{t.home.benefit2Text}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-card__num">03</div>
              <h3>{t.home.benefit3Title}</h3>
              <p>{t.home.benefit3Text}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
