import { useLanguage } from '../i18n/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">FineWine</div>
        <div className="footer__info">
          <p>{t.footer.address}</p>
          <p>{t.footer.hours}</p>
          <p>{t.footer.phone}</p>
        </div>
        <p className="footer__copy">{t.footer.rights}</p>
      </div>
    </footer>
  );
}
