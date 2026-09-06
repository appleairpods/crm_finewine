# FineWine

Премиальный интернет-магазин вина и крепких напитков с полным циклом покупки: каталог, корзина, оформление заказа и программа лояльности.

## Публикация на GitHub Pages

1. Откройте [Settings → Pages](https://github.com/appleairpods/crm_finewine/settings/pages)
2. В разделе **Build and deployment** выберите Source: **Deploy from a branch**
3. Branch: **gh-pages** → папка **/ (root)** → Save
4. После push в `main` GitHub Actions автоматически соберёт и опубликует сайт

**URL:** [https://appleairpods.github.io/crm_finewine/](https://appleairpods.github.io/crm_finewine/)

## Возможности

- Каталог из 28 позиций: вино, виски, безалкогольные напитки
- Фильтрация по категориям (алкогольные/безалкогольные, вино/виски, красное/белое/сухое и др.)
- Карточки товаров с полной информацией (страна, регион, сорт, год, крепость, объём)
- Корзина с выбором количества
- Промокоды: `FINE10`, `WINE500`, `GOLD15`
- Программа лояльности: баллы (1 ₽ = 1 балл), уровни Silver / Gold / Platinum
- Доставка (499 ₽, бесплатно от 5 000 ₽) и самовывоз
- Авторизация по номеру телефона (+7)
- Оплата картой
- Русский и английский интерфейс
- Mobile-first, тёмная premium-тема

## Стек

- React 18
- Vite 5
- React Router 6
- localStorage для данных
- GitHub Pages

## Локальный запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Структура

```
src/
├── components/     # UI-компоненты
├── context/        # Auth, Cart
├── data/           # Каталог товаров
├── i18n/           # Переводы RU/EN
├── pages/          # Страницы
└── utils/          # Константы, storage
```

## Автор

Проект создан для портфолио.
