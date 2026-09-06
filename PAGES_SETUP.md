# Как включить сайт FineWine

Сборка уже выполнена. Файлы лежат в ветке **gh-pages**.

Сайт не открывается, потому что GitHub Pages ещё не включён в настройках репозитория.

## Включение (1 минута)

1. Откройте: https://github.com/appleairpods/crm_finewine/settings/pages
2. **Build and deployment → Source:** выберите **Deploy from a branch**
3. **Branch:** `gh-pages` → папка **`/ (root)`**
4. Нажмите **Save**
5. Подождите 1–2 минуты

## Адрес сайта

https://appleairpods.github.io/crm_finewine/

## Если в Deployments виден красный крестик

Это старый неудачный деплой (#2), когда Pages ещё не был настроен.

Актуальный workflow **#3** завершился успешно — проверьте:
https://github.com/appleairpods/crm_finewine/actions

После включения Pages в Settings сайт начнёт работать без новой сборки.
