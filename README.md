# INVERTA DIGITAL — Онлайн Onboarding Brief

Премиум онбординг-форма для клиентов в стиле INVERTA. Mobile-first, brutalist editorial.

**Stack:** Next.js 15 · React 19 · Tailwind 4 · Motion · TypeScript · Baserow API

---

## 🚀 Быстрый старт (для деплоя на Vercel)

### Шаг 1: Подготовь Baserow (5 минут)

Baserow — это бесплатная альтернатива Airtable. Сюда будут сохраняться ответы клиента.

1. Зарегистрируйся на **[baserow.io](https://baserow.io)** (бесплатно, 1000 строк)
2. Создай новую базу: `INVERTA Onboarding`
3. Создай таблицу `Briefs` с такими полями (все типа **Long text**, кроме `Eingegangen am` — тип **Date** с временем):

```
Eingegangen am (Date with time)
Status (Single select: Neu / In Bearbeitung / Abgeschlossen)
Firmenname
Rechtsform
Adresse
PLZ & Stadt
HRB
USt-ID
Steuernummer
Geschäftsführer
Gründungsdatum
E-Mail Kontakt
Telefon
WhatsApp
DSGVO Name
DSGVO E-Mail
DSB vorhanden
DSB Kontakt
Sicherheit Leistungen
Sicherheit Weitere
Wachschein-Nr
Haftpflicht
Sicherheit Zielgruppe
Sicherheit Gebiet
Sicherheit USP
Reinigung Arten
Reinigung Volumen
Reinigung Gebiet
Umzug Arten
Umzug Region
Umzug Zusatz
Umzug Formular
Primärfarbe
Sekundärfarbe
Weitere Farben
Tonalität
Inspiration 1
Inspiration 2
Inspiration 3
Vermeiden
Hauptziel
Priorität Sicherheit
Priorität Reinigung
Priorität Umzug
Kontaktwege
Google Business
Social Media
Konkurrenten
```

💡 **Совет:** Поле `Firmenname` поставь первым — оно будет primary key. Имена колонок должны точно совпадать (с заглавными и спецсимволами).

4. **Получи API token:**
   - Settings (правый верх) → API tokens
   - Create token → Name: `Onboarding API` → Permissions: `Create + Read`
   - Скопируй токен (выглядит как `ABCdef123...`)

5. **Получи Table ID:**
   - Открой свою таблицу `Briefs`
   - В URL увидишь номер: `https://baserow.io/database/12345/table/67890`
   - Нужен номер **после `/table/`** (в примере `67890`)

---

### Шаг 2: Залей на Vercel (5 минут)

#### Вариант А — через Vercel CLI (быстро)

```bash
npm install -g vercel
cd inverta-onboarding
npm install
vercel
```

Следуй инструкциям. После первого деплоя:

```bash
vercel env add BASEROW_TOKEN
# Вставь токен → Production + Preview + Development

vercel env add BASEROW_TABLE_ID
# Вставь Table ID → Production + Preview + Development

vercel --prod
```

#### Вариант Б — через GitHub + Vercel Dashboard (рекомендую)

1. Закинь проект на GitHub:
   ```bash
   cd inverta-onboarding
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/ТВОЙ_USERNAME/inverta-onboarding.git
   git push -u origin main
   ```

2. Зайди на **[vercel.com](https://vercel.com)** → New Project → Import from GitHub
3. Выбери репозиторий `inverta-onboarding`
4. **Environment Variables** — добавь два:
   - `BASEROW_TOKEN` = твой токен из Baserow
   - `BASEROW_TABLE_ID` = твой Table ID (число)
5. Deploy

После деплоя получишь URL типа `https://inverta-onboarding.vercel.app`

---

### Шаг 3: Кастомный домен (опционально, через IONOS)

Так как у клиента домен в IONOS:

1. В IONOS → DNS → Создай CNAME запись:
   - Hostname: `brief` (или `onboarding`, как хочешь)
   - Value: `cname.vercel-dns.com`
2. В Vercel Dashboard → Settings → Domains → Add `brief.invertadigital.de`

Через 5-10 минут будет работать `https://brief.invertadigital.de` 🎉

---

## 📩 Что отправлять клиенту

Просто ссылку. Например:

> Hallo [Name],
> 
> hier ist Ihr persönlicher Onboarding-Brief für unser Projekt:
> 
> 👉 https://brief.invertadigital.de
> 
> Bitte nehmen Sie sich 30–45 Minuten Zeit und füllen Sie alle Felder in Ruhe aus.
> Das Formular speichert automatisch — Sie können also zwischendurch unterbrechen.
> 
> Bei Fragen: einfach anrufen oder schreiben.
> 
> Viele Grüße,
> Viktor

---

## 💾 Как смотреть присланные данные

Просто заходи в Baserow → база `INVERTA Onboarding` → таблица `Briefs`.
Видишь все ответы в табличном виде. Можешь:

- ✅ Менять Status: Neu / In Bearbeitung / Abgeschlossen
- ✅ Экспортировать в CSV / Excel
- ✅ Сортировать, фильтровать
- ✅ Настроить уведомления (Baserow → Webhooks)

---

## 🔧 Локальная разработка

```bash
npm install
cp .env.example .env.local
# Заполни .env.local своими данными
npm run dev
# Открой http://localhost:3000
```

Если не настраивать `.env.local` — форма всё равно работает, но данные не сохраняются (выводятся в консоль сервера).

---

## ✨ Особенности

- 📱 **Mobile-first** — клиент может заполнять с телефона
- 💾 **Auto-save** — все ответы сохраняются в `localStorage`, можно прерваться и продолжить
- 🎨 **Premium UI** — Brutalist editorial в стиле INVERTA brand
- ⚡ **Motion-анимации** — плавные переходы между шагами
- ✅ **7 шагов** — Firma · Kontakt · Sicherheit · Reinigung · Umzug · Design · Ziele
- 🔒 **No-index** — поисковики не индексируют (приватная страница)
- 🌍 **Deutsch** — полностью на немецком для клиента

---

## 📂 Структура проекта

```
inverta-onboarding/
├── app/
│   ├── api/submit/route.ts      # API endpoint → Baserow
│   ├── components/
│   │   ├── FormFields.tsx       # Input, TextArea, Checkbox, RadioGroup
│   │   ├── Logo.tsx             # INVERTA SVG-логотип
│   │   └── OnboardingWizard.tsx # Главный компонент wizard
│   ├── globals.css              # Tailwind 4 + brand variables + fonts
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Главная страница
├── public/                       # Статика (опционально)
├── .env.example                  # Шаблон env-переменных
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## ❓ Troubleshooting

**Форма не отправляется → ошибка "Speichern fehlgeschlagen"**
- Проверь что `BASEROW_TOKEN` и `BASEROW_TABLE_ID` правильно установлены в Vercel → Settings → Environment Variables
- Проверь что имена колонок в Baserow точно совпадают со списком выше (включая заглавные и спецсимволы)
- Проверь логи: Vercel Dashboard → твой проект → Logs

**Не нравятся шрифты**
- Шрифты грузятся с Google Fonts — нужен интернет
- Поменять можно в `app/globals.css` (см. `@import` строка)

**Хочу добавить уведомления в Telegram при новой заявке**
- Открой `app/api/submit/route.ts`
- Добавь после успешного сохранения в Baserow:
  ```typescript
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: `🎉 Neuer Brief von ${data.firmenname}`,
    }),
  });
  ```
- Добавь `TG_TOKEN` и `TG_CHAT_ID` в env

---

© 2026 INVERTA DIGITAL GbR — Made with ❤️ in Dresden
