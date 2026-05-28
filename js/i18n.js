/* ============================================================
   WONKI – i18n  (RO / RU)
   Utilizare HTML:
     data-i18n="cheie"        → textContent
     data-i18n-html="cheie"   → innerHTML  (poate conține HTML/span)
     data-i18n-ph="cheie"     → placeholder
     data-i18n-opt            → pe <select> – traduce options în ordine
   ============================================================ */

window.WONKI_T = {

  /* ── NAVIGAȚIE ─────────────────────────────────────────── */
  'nav.home':    { ro: 'Acasă',          ru: 'Главная' },
  'nav.about':   { ro: 'Despre noi',     ru: 'О нас' },
  'nav.program': { ro: 'Program',        ru: 'Программа' },
  'nav.tarife':  { ro: 'Tarife',         ru: 'Тарифы' },
  'nav.blog':    { ro: 'Blog',           ru: 'Блог' },
  'nav.galerie': { ro: 'Galerie',        ru: 'Галерея' },
  'nav.contact': { ro: 'Înscrie-te 🎈',  ru: 'Записаться 🎈' },

  /* ── FOOTER ─────────────────────────────────────────────── */
  'footer.brand.desc': {
    ro: 'Grădinița privată unde fiecare copil devine o versiune mai curajoasă, mai creativă și mai fericită a lui însuși.',
    ru: 'Частный детский сад, где каждый ребёнок становится смелее, творческее и счастливее.'
  },
  'footer.col.pages':   { ro: 'Pagini',   ru: 'Страницы' },
  'footer.col.groups':  { ro: 'Grupe',    ru: 'Группы' },
  'footer.col.contact': { ro: 'Contact',  ru: 'Контакты' },
  'footer.bears':       { ro: '🐻 Ursuleți (2–3 ani)',      ru: '🐻 Медвежата (2–3 года)' },
  'footer.butterflies': { ro: '🦋 Fluturași (3–4 ani)',    ru: '🦋 Бабочки (3–4 года)' },
  'footer.stars':       { ro: '⭐ Steluțe (4–5 ani)',       ru: '⭐ Звёздочки (4–5 лет)' },
  'footer.explorers':   { ro: '🚀 Exploratori (5–7 ani)',  ru: '🚀 Исследователи (5–7 лет)' },
  'footer.privacy':     { ro: 'Politică confidențialitate', ru: 'Политика конфиденциальности' },
  'footer.addr':  { ro: '📍 str. Grenoble 122, Codru, Chișinău', ru: '📍 ул. Гренобль 122, Кодру, Кишинёв' },
  'footer.hours': { ro: '🕐 Lun–Vin 07:30–18:30',          ru: '🕐 Пн–Пт 07:30–18:30' },
  'footer.copyright': {
    ro: '© 2026 Grădinița Wonki · Făcut cu dragoste pentru cei mici',
    ru: '© 2026 Детский сад Wonki · Сделано с любовью для малышей'
  },

  /* ── HOME ───────────────────────────────────────────────── */
  'home.badge':      { ro: 'Înscrierea 2025–2026 este deschisă!', ru: 'Набор 2025–2026 открыт!' },
  'home.hero.w1':    { ro: 'Curiozitatea',  ru: 'Любопытство' },
  'home.hero.w2':    { ro: 'ta',            ru: 'твоё' },
  'home.hero.w3':    { ro: 'devine',        ru: 'становится' },
  'home.scroll':     { ro: 'Scroll',        ru: 'Скролл' },
  'home.tw.words':   { ro: ['superputere','magie','bucurie','aventură','creație'],
                       ru: ['суперсилой','магией','радостью','приключением','творчеством'] },
  'home.hero.p':     { ro: 'La Wonki, copiii explorează, creează și cresc într-un mediu sigur, colorat și plin de bucurie. Magia educației moderne îmbrăcată în joacă autentică.', ru: 'В Wonki дети исследуют, творят и растут в безопасной, яркой и радостной среде. Магия современного образования в форме настоящей игры.' },
  'home.hero.btn1':  { ro: '🎈 Programează o vizită', ru: '🎈 Записаться на визит' },
  'home.hero.btn2':  { ro: 'Descoperă mai mult ↓',    ru: 'Узнать больше ↓' },

  'home.stats.children':  { ro: 'Copii fericiți 🧒',       ru: 'Счастливых детей 🧒' },
  'home.stats.years':     { ro: 'Ani de experiență ⭐',     ru: 'Лет опыта ⭐' },
  'home.stats.educators': { ro: 'Educatori dedicați 👩‍🏫',  ru: 'Педагогов 👩‍🏫' },
  'home.stats.parents':   { ro: 'Părinți satisfăcuți 💛',   ru: 'Довольных родителей 💛' },

  'home.features.label': { ro: 'De ce Wonki?', ru: 'Почему Wonki?' },
  'home.features.title': { ro: 'Tot ce are nevoie copilul tău să <span style="color:var(--coral)">înflorească</span>', ru: 'Всё, что нужно вашему ребёнку для <span style="color:var(--coral)">расцвета</span>' },
  'home.features.sub':   { ro: 'Combinăm metodele moderne de educație timpurie cu dragostea și atenția pe care fiecare copil o merită.', ru: 'Мы сочетаем современные методы раннего образования с любовью и вниманием, которых заслуживает каждый ребёнок.' },
  'home.f1.h': { ro: 'Educație prin joacă',   ru: 'Обучение через игру' },
  'home.f1.p': { ro: 'Curriculă Montessori & STEAM adaptată copiilor 2–7 ani cu activități captivante zilnice.', ru: 'Программа Монтессори & STEAM для детей 2–7 лет с увлекательными ежедневными занятиями.' },
  'home.f2.h': { ro: 'Educatori cu inimă',    ru: 'Педагоги с душой' },
  'home.f2.p': { ro: 'Certificări internaționale și peste 10 ani de experiență în educația timpurie.', ru: 'Международные сертификаты и более 10 лет опыта в раннем образовании.' },
  'home.f3.h': { ro: 'Spații verzi & sigure', ru: 'Зелёные & безопасные площадки' },
  'home.f3.p': { ro: 'Curte amenajată cu zone de joacă, grădină și explorare în aer liber, supravegheată.', ru: 'Оборудованный двор с игровыми зонами, садом и безопасными прогулками.' },
  'home.f4.h': { ro: 'Meniu sănătos',         ru: 'Здоровое питание' },
  'home.f4.p': { ro: 'Mese proaspete preparate zilnic, adaptate nevoilor și alergiilor fiecărui copil.', ru: 'Свежие блюда ежедневно с учётом потребностей и аллергий каждого ребёнка.' },
  'home.f5.h': { ro: 'Muzică & Arte',          ru: 'Музыка & Искусство' },
  'home.f5.p': { ro: 'Ore de muzică, dans și pictură care stimulează creativitatea și expresia emoțională.', ru: 'Занятия музыкой, танцами и рисованием для развития творчества.' },
  'home.f6.h': { ro: 'Limbi Străine',          ru: 'Иностранные языки' },
  'home.f6.p': { ro: 'Introducere în limba engleză prin jocuri și cântece, de la vârsta de 3 ani.', ru: 'Знакомство с английским через игры и песни, с 3 лет.' },
  'home.features.cta': { ro: 'Află mai multe despre noi →', ru: 'Узнать больше о нас →' },

  'home.day.label': { ro: 'O zi la Wonki', ru: 'День в Wonki' },
  'home.day.title': { ro: 'Fiecare zi, o <span style="color:var(--sky)">aventură nouă</span>', ru: 'Каждый день — новое <span style="color:var(--sky)">приключение</span>' },
  'home.day.sub':   { ro: 'Structurată cu grijă pentru echilibrul perfect între învățare și distracție.', ru: 'Тщательно организованный баланс обучения и развлечений.' },
  'home.tl1.act':   { ro: 'Primire & joc liber',  ru: 'Приём & свободная игра' },
  'home.tl1.desc':  { ro: 'Copiii sosesc și se pregătesc pentru o zi magică', ru: 'Дети приходят и готовятся к волшебному дню' },
  'home.tl2.act':   { ro: 'Activități educative', ru: 'Образовательные занятия' },
  'home.tl2.desc':  { ro: 'STEAM, matematică și limbaj prin joc', ru: 'STEAM, математика и речь через игру' },
  'home.tl3.act':   { ro: 'Artă & creativitate',  ru: 'Искусство & творчество' },
  'home.tl3.desc':  { ro: 'Pictură, modelaj, muzică și dans', ru: 'Рисование, лепка, музыка и танцы' },
  'home.tl4.act':   { ro: 'Joacă în curte',       ru: 'Прогулка во дворе' },
  'home.tl4.desc':  { ro: 'Explorare, sport și aer curat', ru: 'Исследование, спорт и свежий воздух' },
  'home.day.cta':   { ro: 'Vezi programul complet →', ru: 'Смотреть полную программу →' },

  'home.ctr.groups':     { ro: 'Grupe de vârstă 👶',   ru: 'Возрастные группы 👶' },
  'home.ctr.children':   { ro: 'Copii per grupă ✨',    ru: 'Детей в группе ✨' },
  'home.ctr.activities': { ro: 'Activități / lună 🎯', ru: 'Занятий в месяц 🎯' },
  'home.ctr.passion':    { ro: 'Drag & pasiune ❤️',     ru: 'Любовь и страсть ❤️' },

  'home.testi.label': { ro: 'Ce spun părinții', ru: 'Отзывы родителей' },
  'home.testi.title': { ro: 'Bucuria lor e <span style="color:var(--lavender)">dovada noastră</span>', ru: 'Их радость — <span style="color:var(--lavender)">наше доказательство</span>' },
  'home.testi.sub':   { ro: 'Cele mai frumoase recomandări vin din inimile familiilor lor.', ru: 'Самые тёплые рекомендации — от сердец их семей.' },

  'home.gallery.label': { ro: 'Galeria noastră', ru: 'Наша галерея' },
  'home.gallery.title': { ro: 'Momente de <span style="color:var(--mint)">magie</span>', ru: 'Моменты <span style="color:var(--mint)">волшебства</span>' },
  'home.gallery.sub':   { ro: 'O fereastră în lumea colorată de la Wonki.', ru: 'Окно в яркий мир Wonki.' },
  'home.gallery.cta':   { ro: 'Vezi galeria completă →', ru: 'Смотреть всю галерею →' },

  'home.blog.label':   { ro: 'Blog & Știri', ru: 'Блог & Новости' },
  'home.blog.title':   { ro: 'Noutăți din lumea <span style="color:var(--coral)">Wonki</span>', ru: 'Новости мира <span style="color:var(--coral)">Wonki</span>' },
  'home.blog.sub':     { ro: 'Sfaturi, povești și momente din viața grădiniței noastre.', ru: 'Советы, истории и моmente из жизни нашего детского сада.' },
  'home.blog.loading': { ro: 'Se încarcă articolele... ✍️', ru: 'Загружаем статьи... ✍️' },
  'home.blog.cta':     { ro: 'Citește mai mult →', ru: 'Читать дальше →' },

  'home.cta.title': { ro: 'Hai să facem primul pas împreună! 🌟', ru: 'Сделаем первый шаг вместе! 🌟' },
  'home.cta.sub':   { ro: 'Locuri limitate disponibile pentru anul școlar 2025–2026.', ru: 'Ограниченное количество мест на 2025–2026 учебный год.' },
  'home.cta.btn':   { ro: 'Înscrie-te acum 🎈', ru: 'Записаться сейчас 🎈' },

  /* ── DESPRE ─────────────────────────────────────────────── */
  'despre.hero.label': { ro: 'Povestea noastră', ru: 'Наша история' },
  'despre.hero.title': { ro: 'Despre <span style="color:var(--coral)">Wonki</span> 💛', ru: 'О нас — <span style="color:var(--coral)">Wonki</span> 💛' },
  'despre.hero.sub':   { ro: 'Suntem mai mult decât o grădiniță — suntem locul unde fiecare copil descoperă cine poate deveni.', ru: 'Мы больше, чем детский сад — место, где каждый ребёнок открывает, кем он может стать.' },
  'despre.intro.label': { ro: 'Cine suntem', ru: 'Кто мы' },
  'despre.intro.title': { ro: 'O echipă care <span style="color:var(--coral)">iubește</span> copiii', ru: 'Команда, которая <span style="color:var(--coral)">любит</span> детей' },
  'despre.intro.p1': { ro: 'Wonki a luat naștere în 2012 dintr-un vis simplu: să creăm un spațiu unde copiii vin cu bucurie în fiecare dimineață. Un loc care să îmbine cele mai bune practici în educația timpurie cu căldura și grija unui mediu familial.', ru: 'Wonki родился в 2012 году из простой мечты: создать место, куда дети с радостью приходят каждое утро. Пространство, объединяющее лучшие практики раннего образования с теплотой семейной атмосферы.' },
  'despre.intro.p2': { ro: 'De-a lungul anilor, am crescut împreună cu zeci de familii, adaptând constant metodele noastre la nevoile copiilor moderni. Astăzi, Wonki e recunoscut ca unul dintre cele mai inovatoare centre educaționale private din Chișinău.', ru: 'За эти годы мы выросли вместе с десятками семей, постоянно адаптируя методы к потребностям современных детей. Сегодня Wonki — один из наиболее инновационных частных образовательных центров Кишинёва.' },
  'despre.intro.p3': { ro: 'Credem că fiecare copil e unic și că misiunea noastră e să-l ajutăm să-și descopere supraputerile.', ru: 'Мы верим, что каждый ребёнок уникален, и наша миссия — помочь ему открыть свои суперспособности.' },
  'despre.intro.btn': { ro: 'Vizitează-ne 🌟', ru: 'Посетите нас 🌟' },
  'despre.c1.h': { ro: 'Premii',      ru: 'Награды' },
  'despre.c1.p': { ro: 'Top 10 grădinițe private Chișinău 2023', ru: 'Топ-10 частных детских садов Кишинёва 2023' },
  'despre.c2.h': { ro: 'Acreditare',  ru: 'Аккредитация' },
  'despre.c2.p': { ro: 'Certificare internațională Montessori', ru: 'Международная сертификация Монтессори' },
  'despre.c3.h': { ro: 'Comunitate',  ru: 'Сообщество' },
  'despre.c3.p': { ro: 'Peste 350 de familii Wonki actuale', ru: 'Более 350 семей Wonki сегодня' },
  'despre.c4.h': { ro: 'Misiune',     ru: 'Миссия' },
  'despre.c4.p': { ro: 'Copii fericiți, părinți liniștiți', ru: 'Счастливые дети, спокойные родители' },
  'despre.values.label': { ro: 'Valorile noastre', ru: 'Наши ценности' },
  'despre.values.title': { ro: 'Principiile care ne <span style="color:var(--sky)">ghidează</span>', ru: 'Принципы, которые нас <span style="color:var(--sky)">направляют</span>' },
  'despre.values.sub':   { ro: 'Fiecare decizie pe care o luăm pornește de la aceste valori fundamentale.', ru: 'Каждое наше решение основано на этих фундаментальных ценностях.' },
  'despre.v1.h': { ro: 'Dragoste necondiționată',    ru: 'Безусловная любовь' },
  'despre.v1.p': { ro: 'Fiecare copil este primit cu deschidere și acceptat exact așa cum este, cu personalitatea și ritmul lui propriu.', ru: 'Каждый ребёнок принимается таким, какой он есть, со своей личностью и темпом.' },
  'despre.v2.h': { ro: 'Curiozitate cultivată',      ru: 'Воспитание любопытства' },
  'despre.v2.p': { ro: 'Încurajăm întrebările, experimentele și explorarea. Nu există răspunsuri greșite, doar minți curioase.', ru: 'Поощряем вопросы, эксперименты и исследования. Нет неправильных ответов — только любопытные умы.' },
  'despre.v3.h': { ro: 'Comunitate & colaborare',    ru: 'Сообщество & сотрудничество' },
  'despre.v3.p': { ro: 'Copiii învață să lucreze împreună, să se respecte și să se susțină reciproc — competențe vitale pentru viitor.', ru: 'Дети учатся работать вместе, уважать и поддерживать друг друга — жизненно важные навыки для будущего.' },
  'despre.v4.h': { ro: 'Natură & sustenabilitate',   ru: 'Природа & устойчивость' },
  'despre.v4.p': { ro: 'Îi conectăm pe copii cu natura prin grădinărit, observații și activități outdoor responsabile.', ru: 'Связываем детей с природой через садоводство, наблюдения и ответственные занятия на свежем воздухе.' },
  'despre.v5.h': { ro: 'Creativitate liberă',        ru: 'Свободное творчество' },
  'despre.v5.p': { ro: 'Arta, muzica și jocul imaginativ sunt tratate ca materii esențiale, nu ca extras.', ru: 'Искусство, музыка и творческие игры — основные предметы, а не дополнение.' },
  'despre.v6.h': { ro: 'Siguranță & încredere',      ru: 'Безопасность & доверие' },
  'despre.v6.p': { ro: 'Spații fizice și emoționale sigure, unde copiii și părinții se simt în cele mai bune mâini.', ru: 'Безопасное физическое и эмоциональное пространство, где все в надёжных руках.' },
  'despre.team.label': { ro: 'Echipa noastră', ru: 'Наша команда' },
  'despre.team.title': { ro: 'Oamenii din spatele <span style="color:var(--lavender)">magiei</span>', ru: 'Люди за <span style="color:var(--lavender)">волшебством</span>' },
  'despre.team.sub':   { ro: 'Fiecare educator Wonki este ales cu grijă pentru pasiunea, competența și dragostea față de copii.', ru: 'Каждый педагог Wonki тщательно отобран за страсть, компетентность и любовь к детям.' },
  'despre.tm1.role': { ro: 'Fondatoare & Director',  ru: 'Основательница & Директор' },
  'despre.tm1.p':    { ro: 'Psiholog educațional cu 15 ani experiență. Visătoarea din spatele Wonki.', ru: 'Педагог-психолог с 15 годами опыта. Мечтательница, стоящая за Wonki.' },
  'despre.tm2.role': { ro: 'Educatoare Senior',       ru: 'Старший воспитатель' },
  'despre.tm2.p':    { ro: 'Specialist Montessori certificat, pasionată de artă și muzică timpurie.', ru: 'Сертифицированный специалист Монтессори, увлечённая искусством и ранней музыкой.' },
  'despre.tm3.role': { ro: 'Coordonator STEAM',       ru: 'Координатор STEAM' },
  'despre.tm3.p':    { ro: 'Inginer reconvertit în educator, transformă știința în joacă fascinantă.', ru: 'Инженер, ставший педагогом, превращает науку в увлекательную игру.' },
  'despre.tm4.role': { ro: 'Nutriționist & Bucătar',  ru: 'Диетолог & Повар' },
  'despre.tm4.p':    { ro: 'Creează meniuri delicioase și sănătoase adaptate nevoilor fiecărui copil.', ru: 'Создаёт вкусные и здоровые меню для каждого ребёнка.' },
  'despre.cta.title': { ro: 'Vino să ne cunoști personal! 🤗', ru: 'Приходите познакомиться лично! 🤗' },
  'despre.cta.sub':   { ro: 'Programează o vizită și descoperă magia Wonki cu ochii tăi.', ru: 'Запишитесь на визит и откройте для себя волшебство Wonki.' },
  'despre.cta.btn':   { ro: 'Programează vizita →', ru: 'Записаться на визит →' },

  /* ── PROGRAM ────────────────────────────────────────────── */
  'program.hero.label': { ro: 'Activitățile noastre', ru: 'Наши занятия' },
  'program.hero.title': { ro: 'Programul <span style="color:var(--sky)">Wonki</span> 🎯', ru: 'Программа <span style="color:var(--sky)">Wonki</span> 🎯' },
  'program.hero.sub':   { ro: 'Zile pline de aventuri, descoperiri și zâmbete — structurate cu grijă pentru fiecare vârstă.', ru: 'Дни, полные приключений, открытий и улыбок — тщательно организованные для каждого возраста.' },
  'program.tabs.label': { ro: 'Programul zilei', ru: 'Расписание дня' },
  'program.tabs.title': { ro: 'O zi completă la <span style="color:var(--sky)">Wonki</span>', ru: 'Полный день в <span style="color:var(--sky)">Wonki</span>' },
  'program.tabs.sub':   { ro: 'Alege programul dorit pentru a vedea activitățile detaliate.', ru: 'Выберите программу, чтобы увидеть подробные занятия.' },
  'program.tab.scurt':  { ro: '☀️ Program Scurt (07:30–13:00)', ru: '☀️ Короткая программа (07:30–13:00)' },
  'program.tab.lung':   { ro: '🌙 Program Lung (07:30–18:00)',  ru: '🌙 Длинная программа (07:30–18:00)' },
  'program.tab.extras': { ro: '🎨 Activități Extra',            ru: '🎨 Доп. занятия' },
  'program.s1.h': { ro: 'Primire & joc liber',           ru: 'Приём & свободная игра' },
  'program.s1.p': { ro: 'Copiii sosesc, se aclimatizează și joacă liber în zone special amenajate', ru: 'Дети приходят, адаптируются и играют свободно в оборудованных зонах' },
  'program.s2.h': { ro: 'Adunarea de dimineață',          ru: 'Утреннее собрание' },
  'program.s2.p': { ro: 'Cerc de întâmpinare, calendar, vreme și planificarea zilei', ru: 'Утренний круг, календарь, погода и планирование дня' },
  'program.s3.h': { ro: 'Activitate educativă principală', ru: 'Основное образовательное занятие' },
  'program.s3.p': { ro: 'STEAM, matematică intuitivă, limbaj sau explorare tematică', ru: 'STEAM, математика, речь или тематическое исследование' },
  'program.s4.h': { ro: 'Gustare sănătoasă',             ru: 'Здоровый перекус' },
  'program.s4.p': { ro: 'Fructe proaspete, legume, iaurt sau smoothie de sezon', ru: 'Свежие фрукты, овощи, йогурт или сезонный смузи' },
  'program.s5.h': { ro: 'Artă & creativitate',           ru: 'Искусство & творчество' },
  'program.s5.p': { ro: 'Pictură, modelaj, colaj, muzică sau dramatizare', ru: 'Рисование, лепка, коллаж, музыка или театрализация' },
  'program.s6.h': { ro: 'Joacă în curte',                ru: 'Прогулка во дворе' },
  'program.s6.p': { ro: 'Activitate fizică, explorarea grădinii, jocuri de echipă', ru: 'Физическая активность, исследование сада, командные игры' },
  'program.s7.h': { ro: 'Plecare acasă',                 ru: 'Уход домой' },
  'program.s7.p': { ro: 'Recapitularea zilei, pregătirea ghiozdanelor, îmbrățișări', ru: 'Подведение итогов дня, сборы, объятия' },
  'program.l3.h': { ro: 'Prânz cald',                   ru: 'Горячий обед' },
  'program.l3.p': { ro: 'Masă caldă echilibrată, preparată în bucătăria noastră', ru: 'Сбалансированный горячий обед, приготовленный на нашей кухне' },
  'program.l4.h': { ro: 'Somn & odihnă',                ru: 'Сон & отдых' },
  'program.l4.p': { ro: 'Timp de relaxare în dormitoarele confortabile Wonki', ru: 'Время отдыха в уютных спальнях Wonki' },
  'program.l5.h': { ro: 'Activități după-amiază',       ru: 'Послеполудневные занятия' },
  'program.l5.p': { ro: 'Lectură, jocuri de masă sau atelier tematic săptămânal', ru: 'Чтение, настольные игры или еженедельная мастерская' },
  'program.l7.p': { ro: 'Ziua se încheie cu povești și zâmbete', ru: 'День завершается историями и улыбками' },
  'program.em.h':  { ro: 'Muzică',     ru: 'Музыка' },
  'program.em.a':  { ro: 'De la 3 ani', ru: 'С 3 лет' },
  'program.em.p':  { ro: 'Introducere în ritmuri, instrumente și cântec coral, cu profesori specializați.', ru: 'Знакомство с ритмами, инструментами и хоровым пением.' },
  'program.ee.h':  { ro: 'Engleză',    ru: 'Английский' },
  'program.ee.a':  { ro: 'De la 3 ani', ru: 'С 3 лет' },
  'program.ee.p':  { ro: 'Conversație și jocuri în limba engleză, în grupe mici de maxim 8 copii.', ru: 'Разговор и игры на английском в малых группах до 8 детей.' },
  'program.eg.h':  { ro: 'Gimnastică', ru: 'Гимнастика' },
  'program.eg.a':  { ro: 'De la 4 ani', ru: 'С 4 лет' },
  'program.eg.p':  { ro: 'Coordonare, flexibilitate și echilibru, într-un spațiu echipat profesional.', ru: 'Координация, гибкость и равновесие в профессиональном пространстве.' },
  'program.et.h':  { ro: 'Teatru',     ru: 'Театр' },
  'program.et.a':  { ro: 'De la 4 ani', ru: 'С 4 лет' },
  'program.et.p':  { ro: 'Improvizație, dramatizare și spectacole trimestriale pentru părinți.', ru: 'Импровизация, инсценировки и ежеквартальные спектакли для родителей.' },
  'program.groups.label': { ro: 'Grupele noastre', ru: 'Наши группы' },
  'program.groups.title': { ro: 'Adaptat fiecărei <span style="color:var(--mint)">vârste</span>', ru: 'Адаптировано для каждого <span style="color:var(--mint)">возраста</span>' },
  'program.groups.sub':   { ro: 'Fiecare grupă are propriul ritm, activități și educatori dedicați.', ru: 'Каждая группа имеет свой ритм, занятия и воспитателей.' },
  'program.g1.h':  { ro: 'Ursuleți',   ru: 'Медвежата' },
  'program.g1.a':  { ro: '2 – 3 ani',  ru: '2 – 3 года' },
  'program.g1.p':  { ro: 'Primii pași spre autonomie, joc senzorial și explorare sigură.', ru: 'Первые шаги к самостоятельности, сенсорные игры и безопасное исследование.' },
  'program.g2.h':  { ro: 'Fluturași',  ru: 'Бабочки' },
  'program.g2.a':  { ro: '3 – 4 ani',  ru: '3 – 4 года' },
  'program.g2.p':  { ro: 'Limbaj, socializare și primele proiecte artistice și STEAM.', ru: 'Речь, социализация и первые художественные и STEAM-проекты.' },
  'program.g3.h':  { ro: 'Steluțe',    ru: 'Звёздочки' },
  'program.g3.a':  { ro: '4 – 5 ani',  ru: '4 – 5 лет' },
  'program.g3.p':  { ro: 'Gândire critică, cooperare și introducere în lectură & scriere.', ru: 'Критическое мышление, сотрудничество и знакомство с чтением & письмом.' },
  'program.g4.h':  { ro: 'Exploratori', ru: 'Исследователи' },
  'program.g4.a':  { ro: '5 – 7 ani',  ru: '5 – 7 лет' },
  'program.g4.p':  { ro: 'Pregătire școlară completă cu accent pe autonomie și creativitate.', ru: 'Полная подготовка к школе с акцентом на самостоятельность и творчество.' },
  'program.pkg.label': { ro: 'Pachete & Tarife', ru: 'Пакеты & Тарифы' },
  'program.pkg.title': { ro: 'Transparent și <span style="color:var(--coral)">accesibil</span>', ru: 'Прозрачно и <span style="color:var(--coral)">доступно</span>' },
  'program.pkg.sub':   { ro: 'Alegem calitatea fără compromisuri, cu prețuri corecte pentru familiile Wonki.', ru: 'Качество без компромиссов, с честными ценами для семей Wonki.' },
  'program.cta.title': { ro: 'Găsim împreună programul perfect! 🎯', ru: 'Найдём вместе идеальную программу! 🎯' },
  'program.cta.sub':   { ro: 'Contactează-ne pentru o consultație gratuită și personalizată.', ru: 'Свяжитесь с нами для бесплатной персонализированной консультации.' },
  'program.cta.btn':   { ro: 'Vorbim acum →', ru: 'Поговорим сейчас →' },

  /* ── TARIFE ─────────────────────────────────────────────── */
  'tarife.hero.label': { ro: 'Transparent & corect', ru: 'Прозрачно & честно' },
  'tarife.hero.title': { ro: 'Tarife <span style="color:var(--sun)">clare</span> 💛', ru: 'Понятные <span style="color:var(--sun)">тарифы</span> 💛' },
  'tarife.hero.sub':   { ro: 'Fără costuri ascunse. Alegi pachetul potrivit familiei tale și îți spunem exact ce include.', ru: 'Без скрытых расходов. Выберите подходящий пакет и мы расскажем, что в него входит.' },
  'tarife.pkg.label':  { ro: 'Pachete disponibile', ru: 'Доступные пакеты' },
  'tarife.pkg.title':  { ro: 'Alege ce se <span style="color:var(--coral)">potrivește</span> familiei tale', ru: 'Выберите, что <span style="color:var(--coral)">подходит</span> вашей семье' },
  'tarife.pkg.sub':    { ro: 'Toate pachetele includ accesul complet la activitățile educative, echipa noastră dedicată și aplicația de comunicare cu părinții.', ru: 'Все пакеты включают полный доступ к занятиям, нашей команде и приложению для родителей.' },
  'tarife.s.h':  { ro: 'Program Scurt',   ru: 'Короткая программа' },
  'tarife.s.f1': { ro: 'Luni – Vineri, 07:30–13:00', ru: 'Пн – Пт, 07:30–13:00' },
  'tarife.s.f2': { ro: 'Toate activitățile educative', ru: 'Все образовательные занятия' },
  'tarife.s.f3': { ro: 'Gustare de dimineață inclusă', ru: 'Утренний перекус включён' },
  'tarife.s.f4': { ro: 'Raport lunar de progres', ru: 'Ежемесячный отчёт о прогрессе' },
  'tarife.s.f5': { ro: 'Acces aplicație părinți', ru: 'Приложение для родителей' },
  'tarife.s.f6': { ro: 'Evaluare trimestrială', ru: 'Ежеквартальная оценка' },
  'tarife.l.h':  { ro: 'Program Lung',    ru: 'Длинная программа' },
  'tarife.l.f1': { ro: 'Luni – Vineri, 07:30–18:00', ru: 'Пн – Пт, 07:30–18:00' },
  'tarife.l.f2': { ro: 'Toate activitățile educative', ru: 'Все образовательные занятия' },
  'tarife.l.f3': { ro: 'Gustare + prânz cald + gustare după-amiază', ru: 'Перекус + горячий обед + полдник' },
  'tarife.l.f4': { ro: 'Somn de după-amiază', ru: 'Дневной сон' },
  'tarife.l.f5': { ro: 'Raport lunar detaliat', ru: 'Подробный ежемесячный отчёт' },
  'tarife.l.f6': { ro: 'Evaluare trimestrială + întâlnire cu educatoarea', ru: 'Оценка + встреча с воспитателем' },
  'tarife.p.h':  { ro: 'Premium Plus',    ru: 'Премиум Плюс' },
  'tarife.p.f1': { ro: 'Program lung complet', ru: 'Полная длинная программа' },
  'tarife.p.f2': { ro: '2 activități extra la alegere', ru: '2 доп. занятия на выбор' },
  'tarife.p.f3': { ro: 'Sesiune lunară cu psihologul', ru: 'Ежемесячная сессия с психологом' },
  'tarife.p.f4': { ro: 'Portofoliu digital al copilului', ru: 'Цифровое портфолио ребёнка' },
  'tarife.p.f5': { ro: 'Prioritate la evenimente speciale', ru: 'Приоритет на мероприятиях' },
  'tarife.p.f6': { ro: 'Consultație nutrițională personalizată', ru: 'Персонализированная консультация диетолога' },
  'tarife.p.f7': { ro: 'Acces prioritar la locuri în toamnă', ru: 'Приоритетный доступ к местам осенью' },
  'tarife.badge': { ro: 'Popular', ru: 'Популярный' },
  'tarife.btn.inscrie': { ro: 'Înscrie-te →', ru: 'Записаться →' },
  'tarife.compare.label': { ro: 'Comparație detaliată', ru: 'Детальное сравнение' },
  'tarife.compare.title': { ro: 'Ce include <span style="color:var(--sky)">fiecare</span> pachet?', ru: 'Что включает <span style="color:var(--sky)">каждый</span> пакет?' },
  'tarife.compare.sub':   { ro: 'O privire clară asupra a tot ce primești cu fiecare opțiune.', ru: 'Чёткий обзор того, что вы получаете с каждым вариантом.' },
  'tarife.th.benefit': { ro: 'Beneficiu', ru: 'Преимущество' },
  'tarife.tr1':  { ro: 'Program 07:30–13:00', ru: 'Программа 07:30–13:00' },
  'tarife.tr2':  { ro: 'Program 13:00–18:00', ru: 'Программа 13:00–18:00' },
  'tarife.tr3':  { ro: 'Gustare dimineață', ru: 'Утренний перекус' },
  'tarife.tr4':  { ro: 'Prânz cald', ru: 'Горячий обед' },
  'tarife.tr5':  { ro: 'Gustare după-amiază', ru: 'Полдник' },
  'tarife.tr6':  { ro: 'Somn după-amiază', ru: 'Дневной сон' },
  'tarife.tr7':  { ro: 'Activități educative complete', ru: 'Полные образовательные занятия' },
  'tarife.tr8':  { ro: 'Raport lunar de progres', ru: 'Ежемесячный отчёт' },
  'tarife.tr9':  { ro: 'Aplicație comunicare părinți', ru: 'Приложение для родителей' },
  'tarife.tr10': { ro: 'Evaluare trimestrială', ru: 'Ежеквартальная оценка' },
  'tarife.tr11': { ro: 'Întâlnire individuală cu educatoarea', ru: 'Индивидуальная встреча с воспитателем' },
  'tarife.tr12': { ro: 'Activități extra (muzică, engleză…)', ru: 'Доп. занятия (музыка, английский…)' },
  'tarife.tr12m': { ro: '+cost', ru: '+стоим.' },
  'tarife.tr12r': { ro: '2 incluse', ru: '2 включено' },
  'tarife.tr13': { ro: 'Sesiune lunară cu psihologul', ru: 'Сессия с психологом' },
  'tarife.tr14': { ro: 'Portofoliu digital al copilului', ru: 'Цифровое портфолио' },
  'tarife.tr15': { ro: 'Consultație nutrițională', ru: 'Консультация диетолога' },
  'tarife.tr16': { ro: 'Prioritate locuri an următor', ru: 'Приоритет мест на след. год' },
  'tarife.disc.label': { ro: 'Reduceri disponibile', ru: 'Доступные скидки' },
  'tarife.disc.title': { ro: 'Economisești <span style="color:var(--mint)">inteligent</span> 🎁', ru: 'Экономьте <span style="color:var(--mint)">умно</span> 🎁' },
  'tarife.disc.sub':   { ro: 'Avem câteva opțiuni care îți permit să reduci costurile fără să compromiți calitatea.', ru: 'Несколько вариантов для снижения расходов без ущерба качеству.' },
  'tarife.d1.h': { ro: 'Al doilea copil',    ru: 'Второй ребёнок' },
  'tarife.d1.p': { ro: 'La înscrierea celui de-al doilea copil din aceeași familie beneficiezi de 10% reducere la taxa lunară.', ru: 'При записи второго ребёнка из одной семьи — скидка 10% от ежемесячной платы.' },
  'tarife.d2.h': { ro: 'Plată semestrială',  ru: 'Полугодовая оплата' },
  'tarife.d2.p': { ro: 'Achitând taxa pentru 6 luni în avans, primești o reducere de 5% aplicată automat.', ru: 'Оплатив 6 месяцев вперёд — автоматическая скидка 5%.' },
  'tarife.d3.h': { ro: 'Recomandare',        ru: 'Рекомендация' },
  'tarife.d3.p': { ro: 'Dacă recomanzi Wonki unui prieten și acesta se înscrie, amândoi primiți 200 MDL reducere în luna următoare.', ru: 'Рекомендуете Wonki другу — оба получают скидку 200 леев в следующем месяце.' },
  'tarife.d4.h': { ro: 'Înscrierea timpurie', ru: 'Ранняя запись' },
  'tarife.d4.p': { ro: 'Rezervările pentru noul an școlar efectuate până la 1 iulie beneficiază de 300 MDL reducere la prima lună.', ru: 'Бронирование до 1 июля — скидка 300 леев за первый месяц.' },
  'tarife.faq.label': { ro: 'Întrebări despre plăți', ru: 'Вопросы об оплате' },
  'tarife.faq.title': { ro: 'Totul despre <span style="color:var(--coral)">taxe</span> 💳', ru: 'Всё об <span style="color:var(--coral)">оплате</span> 💳' },
  'tarife.faq.sub':   { ro: 'Răspunsuri la cele mai frecvente întrebări financiare.', ru: 'Ответы на наиболее частые финансовые вопросы.' },
  'tarife.faq.q1': { ro: 'Când se plătește taxa lunară?', ru: 'Когда вносится ежемесячная плата?' },
  'tarife.faq.a1': { ro: 'Taxa se achită în primele 5 zile lucrătoare ale fiecărei luni. Acceptăm plata prin transfer bancar sau numerar la secretariat.', ru: 'Плата вносится в первые 5 рабочих дней каждого месяца. Принимаем банковский перевод или наличные.' },
  'tarife.faq.q2': { ro: 'Există taxă de înscriere?', ru: 'Есть ли регистрационный взнос?' },
  'tarife.faq.a2': { ro: 'Da, există o taxă de înscriere unică de 500 MDL, care acoperă materialele inițiale, dosarul copilului și evaluarea de integrare. Aceasta se plătește o singură dată, la prima înscriere.', ru: 'Да, единовременный регистрационный взнос 500 леев: начальные материалы, дело ребёнка и оценка адаптации. Оплачивается один раз.' },
  'tarife.faq.q3': { ro: 'Ce se întâmplă dacă copilul lipsește o perioadă mai lungă?', ru: 'Что если ребёнок отсутствует долго?' },
  'tarife.faq.a3': { ro: 'La absențe motivate de minim 10 zile lucrătoare consecutive, se aplică o reducere de 30% la taxa lunară respectivă, cu anunț prealabil de minim 3 zile.', ru: 'При мотивированных отсутствиях от 10 рабочих дней подряд — скидка 30% при уведомлении за 3 дня.' },
  'tarife.faq.q4': { ro: 'Pot schimba pachetul în cursul anului?', ru: 'Могу изменить пакет в течение года?' },
  'tarife.faq.a4': { ro: 'Da! Poți face upgrade sau downgrade cu o notificare de 15 zile. Modificarea intră în vigoare la începutul lunii următoare.', ru: 'Да! Переход на другой пакет с уведомлением за 15 дней. Изменение — с начала следующего месяца.' },
  'tarife.faq.q5': { ro: 'Activitățile extra se plătesc separat?', ru: 'Доп. занятия оплачиваются отдельно?' },
  'tarife.faq.a5': { ro: 'La pachetele Scurt și Lung, activitățile extra se adaugă cu 300–400 MDL/lună fiecare. La Premium Plus, 2 activități sunt deja incluse.', ru: 'В пакетах Короткая/Длинная — 300–400 леев/мес. за каждое. В Премиум Плюс 2 занятия уже включены.' },
  'tarife.faq.q6': { ro: 'Există perioadă de probă?', ru: 'Есть пробный период?' },
  'tarife.faq.a6': { ro: 'Oferim o zi de vizită gratuită fără nicio obligație. Primele două săptămâni sunt perioadă de acomodare, asistată de psihologul nostru.', ru: 'Предлагаем бесплатный день визита без обязательств. Первые две недели — период адаптации с психологом.' },
  'tarife.cta.title': { ro: 'Ai întrebări despre tarife? 💛', ru: 'Есть вопросы о тарифах? 💛' },
  'tarife.cta.sub':   { ro: 'Suntem bucuroși să îți explicăm toate detaliile și să găsim împreună soluția potrivită.', ru: 'Рады объяснить все детали и найти вместе подходящее решение.' },
  'tarife.cta.btn':   { ro: 'Contactează-ne →', ru: 'Связаться с нами →' },

  /* ── CONTACT ────────────────────────────────────────────── */
  'contact.hero.label': { ro: 'Suntem aproape', ru: 'Мы рядом' },
  'contact.hero.title': { ro: 'Hai să ne <span style="color:var(--coral)">cunoaștem!</span> 🤗', ru: 'Давайте <span style="color:var(--coral)">познакомимся!</span> 🤗' },
  'contact.hero.sub':   { ro: 'Fie că ai o întrebare, vrei să programezi o vizită sau ești gata să te înscrii — suntem aici pentru tine.', ru: 'Есть вопрос, хотите записаться на визит или уже готовы к записи — мы здесь для вас.' },
  'contact.info.h':   { ro: 'Informații de <span style="color:var(--coral)">contact</span>', ru: 'Контактная <span style="color:var(--coral)">информация</span>' },
  'contact.info.sub': { ro: 'Nu ezita să ne contactezi! Îți răspundem în cel mult 24 de ore în zilele lucrătoare.', ru: 'Не стесняйтесь обращаться к нам! Отвечаем в течение 24 часов в рабочие дни.' },
  'contact.lbl.addr':    { ro: 'Adresă',   ru: 'Адрес' },
  'contact.lbl.phone':   { ro: 'Telefon',  ru: 'Телефон' },
  'contact.lbl.email':   { ro: 'Email',    ru: 'Email' },
  'contact.lbl.program': { ro: 'Program',  ru: 'График работы' },
  'contact.form.h': { ro: 'Trimite-ne un <span style="color:var(--coral)">mesaj</span> 💌', ru: 'Отправьте нам <span style="color:var(--coral)">сообщение</span> 💌' },
  'contact.f.name.l':   { ro: 'Numele tău *',               ru: 'Ваше имя *' },
  'contact.f.name.ph':  { ro: 'Maria Ionescu',              ru: 'Иван Иванов' },
  'contact.f.phone.l':  { ro: 'Telefon *',                  ru: 'Телефон *' },
  'contact.f.phone.ph': { ro: '07xx xxx xxx',               ru: '+373 xx xxx xxx' },
  'contact.f.email.l':  { ro: 'Email *',                    ru: 'Email *' },
  'contact.f.child.l':  { ro: 'Numele copilului *',         ru: 'Имя ребёнка *' },
  'contact.f.child.ph': { ro: 'Alexandru',                  ru: 'Александр' },
  'contact.f.dob.l':    { ro: 'Data nașterii copilului *',  ru: 'Дата рождения ребёнка *' },
  'contact.f.prog.l':   { ro: 'Program dorit',              ru: 'Желаемая программа' },
  'contact.f.src.l':    { ro: 'Cum ai aflat de Wonki?',     ru: 'Откуда вы узнали о Wonki?' },
  'contact.f.msg.l':    { ro: 'Mesaj',                      ru: 'Сообщение' },
  'contact.f.msg.ph':   { ro: 'Orice întrebare, suntem aici! 💛', ru: 'Любой вопрос — мы здесь! 💛' },
  'contact.f.btn':      { ro: '🎈 Trimite cererea',         ru: '🎈 Отправить заявку' },
  'contact.faq.label': { ro: 'Întrebări frecvente', ru: 'Часто задаваемые вопросы' },
  'contact.faq.title': { ro: 'Răspunsuri la <span style="color:var(--sky)">curiozitățile</span> tale', ru: 'Ответы на ваши <span style="color:var(--sky)">вопросы</span>' },
  'contact.faq.sub':   { ro: 'Nu ai găsit ce cauți? Scrie-ne direct!', ru: 'Не нашли нужного? Пишите напрямую!' },
  'contact.faq.q1': { ro: 'De la ce vârstă pot înscrie copilul la Wonki?', ru: 'С какого возраста принимают в Wonki?' },
  'contact.faq.a1': { ro: 'Acceptăm copii cu vârste între 2 și 7 ani. Fiecare grupă este adaptată specificului de dezvoltare al vârstei respective.', ru: 'Принимаем детей от 2 до 7 лет. Каждая группа адаптирована к возрасту.' },
  'contact.faq.q2': { ro: 'Care este procesul de înscriere?', ru: 'Как проходит запись?' },
  'contact.faq.a2': { ro: 'Completezi formularul de contact, programăm o vizită cu copilul tău, discutăm nevoile și preferințele, iar apoi finalizăm dosarul de înscriere. Totul durează de obicei 3–5 zile lucrătoare.', ru: 'Заполняете форму, назначаем визит, обсуждаем потребности, оформляем документы. Обычно 3–5 рабочих дней.' },
  'contact.faq.q3': { ro: 'Mâncarea este inclusă în taxă?', ru: 'Питание включено?' },
  'contact.faq.a3': { ro: 'La programul scurt este inclusă gustarea de dimineață. La programul lung și Premium Plus sunt incluse gustarea, prânzul cald și gustarea de după-amiază. Meniurile sunt preparate zilnic de bucătarul nostru.', ru: 'В короткой программе — утренний перекус. В длинной и Премиум Плюс — перекус, горячий обед и полдник. Меню готовится ежедневно.' },
  'contact.faq.q4': { ro: 'Cum comunicați cu părinții despre evoluția copilului?', ru: 'Как вы сообщаете о развитии ребёнка?' },
  'contact.faq.a4': { ro: 'Avem o aplicație dedicată unde postăm zilnic actualizări, poze (cu acord) și notificări. Lunar primești un raport scris de progres, iar trimestrial organizăm întâlniri individuale cu educatoarea.', ru: 'Специальное приложение с ежедневными обновлениями и фото. Ежемесячный отчёт и ежеквартальные встречи с воспитателем.' },
  'contact.faq.q5': { ro: 'Ce se întâmplă dacă copilul nu se adaptează?', ru: 'Что если ребёнок не адаптируется?' },
  'contact.faq.a5': { ro: 'Avem un protocol de acomodare progresivă de 2 săptămâni. Psihologul nostru și educatoarele lucrează împreună cu familia pentru o tranziție cât mai blândă.', ru: 'Протокол постепенной адаптации 2 недели. Психолог и воспитатели работают с семьёй для мягкого перехода.' },
  'contact.faq.q6': { ro: 'Există locuri disponibile pentru 2025–2026?', ru: 'Есть места на 2025–2026?' },
  'contact.faq.a6': { ro: 'Da, momentan mai avem locuri disponibile în grupele Fluturași și Exploratori. Contactează-ne cât mai repede pentru a rezerva locul!', ru: 'Да, есть места в группах Бабочки и Исследователи. Свяжитесь скорее для бронирования!' },
  'contact.quick.label': { ro: 'Răspundem în 24h', ru: 'Ответим за 24ч' },
  'contact.quick.title': { ro: 'Ai o întrebare <span style="color:var(--coral)">rapidă?</span> 💌', ru: 'Есть <span style="color:var(--coral)">быстрый</span> вопрос? 💌' },
  'contact.quick.sub':   { ro: 'Fără cerere de înscriere — scrie-ne direct și îți răspundem curând.', ru: 'Без заявки — напишите напрямую, ответим скоро.' },
  'contact.q.name.l':  { ro: 'Numele tău *', ru: 'Ваше имя *' },
  'contact.q.email.l': { ro: 'Email *',      ru: 'Email *' },
  'contact.q.subj.l':  { ro: 'Subiect',      ru: 'Тема' },
  'contact.q.subj.ph': { ro: 'Ex: Vreau mai multe detalii despre program...', ru: 'Напр.: Хочу больше деталей о программе...' },
  'contact.q.msg.l':   { ro: 'Mesajul tău *', ru: 'Ваше сообщение *' },
  'contact.q.msg.ph':  { ro: 'Scrie mesajul tău aici... 💛', ru: 'Напишите ваше сообщение... 💛' },
  'contact.q.btn':     { ro: '✉️ Trimite mesajul', ru: '✉️ Отправить сообщение' },

  /* ── BLOG ───────────────────────────────────────────────── */
  'blog.hero.label': { ro: 'Noutăți & Sfaturi', ru: 'Статьи & Вдохновение' },
  'blog.hero.title': { ro: 'Blog <span style="color:var(--coral)">Wonki</span> ✍️', ru: 'Блог <span style="color:var(--lavender)">Wonki</span> ✍️' },
  'blog.hero.sub':   { ro: 'Articole despre educație, activități creative și tot ce se întâmplă la grădinița noastră.', ru: 'Советы для родителей, истории из детского сада и новости о раннем образовании.' },
  'blog.cta.title':  { ro: 'Vrei să nu ratezi nicio noutate? 📬', ru: 'Хотите не пропустить новости? 📬' },
  'blog.cta.sub':    { ro: 'Abonează-te la newsletter-ul Wonki și primești articole noi direct în inbox.', ru: 'Подпишитесь на рассылку Wonki и получайте статьи прямо на почту.' },
  'blog.cta.btn':    { ro: 'Contactează-ne →', ru: 'Связаться с нами →' },

  /* ── GALERIE ─────────────────────────────────────────────── */
  'galerie.hero.label':   { ro: 'Momente speciale',  ru: 'Особые моменты' },
  'galerie.hero.title':   { ro: 'Galeria <span style="color:var(--mint)">Wonki</span> 📸', ru: 'Галерея <span style="color:var(--mint)">Wonki</span> 📸' },
  'galerie.hero.sub':     { ro: 'O privire în lumea colorată și magică pe care o trăiesc copiii noștri în fiecare zi.', ru: 'Взгляд на яркий и волшебный мир, который проживают наши дети каждый день.' },
  'galerie.filter.all':   { ro: 'Toate',      ru: 'Все' },
  'galerie.filter.activ': { ro: 'Activități', ru: 'Занятия' },
  'galerie.filter.art':   { ro: 'Artă',       ru: 'Искусство' },
  'galerie.filter.curte': { ro: 'Natură',     ru: 'Природа' },
  'galerie.filter.events':{ ro: 'Evenimente', ru: 'События' },
  'galerie.cta.title':    { ro: 'Vrei să faci parte din povestea noastră? 📸', ru: 'Хотите стать частью нашей истории? 📸' },
  'galerie.cta.sub':      { ro: 'Înscrie-te și copilul tău va trăi și el aceste momente magice.', ru: 'Запишитесь и ваш ребёнок тоже переживёт эти волшебные моменты.' },
  'galerie.cta.btn':      { ro: 'Înscrie-te acum →', ru: 'Записаться сейчас →' },

  /* ── PACHETE COMUNE (pe program.html) ───────────────────── */
  'pkg.scurt.h':  { ro: 'Program Scurt', ru: 'Короткая программа' },
  'pkg.lung.h':   { ro: 'Program Lung',  ru: 'Длинная программа' },
  'pkg.prem.h':   { ro: 'Premium Plus',  ru: 'Премиум Плюс' },
  'pkg.badge':    { ro: 'Popular',       ru: 'Популярный' },
  'pkg.per.luna': { ro: 'RON/lună',      ru: 'леев/мес.' },
  'pkg.btn':      { ro: 'Înscrie-te →',  ru: 'Записаться →' },
  'pkg.s.f1': { ro: 'Luni – Vineri, 07:30–13:00', ru: 'Пн – Пт, 07:30–13:00' },
  'pkg.s.f2': { ro: 'Toate activitățile educative', ru: 'Все образовательные занятия' },
  'pkg.s.f3': { ro: 'Gustare inclusă',              ru: 'Перекус включён' },
  'pkg.s.f4': { ro: 'Raport lunar de progres',       ru: 'Ежемесячный отчёт' },
  'pkg.l.f1': { ro: 'Luni – Vineri, 07:30–18:00',  ru: 'Пн – Пт, 07:30–18:00' },
  'pkg.l.f2': { ro: 'Toate activitățile educative', ru: 'Все образовательные занятия' },
  'pkg.l.f3': { ro: 'Gustare + prânz cald incluse', ru: 'Перекус + горячий обед включены' },
  'pkg.l.f4': { ro: 'Somn de după-amiază',          ru: 'Дневной сон' },
  'pkg.l.f5': { ro: 'Raport lunar detaliat',         ru: 'Подробный ежемесячный отчёт' },
  'pkg.p.f1': { ro: 'Program lung complet',          ru: 'Полная длинная программа' },
  'pkg.p.f2': { ro: '2 activități extra incluse',    ru: '2 доп. занятия включены' },
  'pkg.p.f3': { ro: 'Sesiune lunară cu psihologul',  ru: 'Ежемесячная сессия с психологом' },
  'pkg.p.f4': { ro: 'Portofoliu digital al copilului', ru: 'Цифровое портфолио' },
  'pkg.p.f5': { ro: 'Prioritate la evenimente speciale', ru: 'Приоритет на мероприятиях' },
};

/* ─────────────────────────────────────────────────────────────
   applyLang(lang) — aplică traducerile pe pagina curentă
   ───────────────────────────────────────────────────────────── */
window.applyLang = function (lang) {
  const T = window.WONKI_T;
  if (!T) return;

  // text simplu
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (T[key] && T[key][lang] !== undefined) el.textContent = T[key][lang];
  });

  // innerHTML (conține HTML: span-uri cu culori, emoji, etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (T[key] && T[key][lang] !== undefined) el.innerHTML = T[key][lang];
  });

  // placeholder
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (T[key] && T[key][lang] !== undefined) el.setAttribute('placeholder', T[key][lang]);
  });

  // <select> cu data-i18n-opt="cheie1,cheie2,..."
  document.querySelectorAll('[data-i18n-opt]').forEach(sel => {
    const keys = sel.getAttribute('data-i18n-opt').split(',');
    [...sel.options].forEach((opt, i) => {
      const k = keys[i] && keys[i].trim();
      if (k && T[k] && T[k][lang] !== undefined) opt.textContent = T[k][lang];
    });
  });

  // Actualizează atributul lang al <html>
  document.documentElement.setAttribute('lang', lang === 'ru' ? 'ru' : 'ro');
  localStorage.setItem('wonki-lang', lang);

  // Sincronizează butoanele de limbă din nav (dacă există)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Reinițializează typewriter-ul cu cuvintele noii limbi (numai pe home)
  const twEl = document.getElementById('tw-word');
  if (twEl && twEl._restart) {
    const twWords = T['home.tw.words'] && T['home.tw.words'][lang];
    if (Array.isArray(twWords) && twWords.length) twEl._restart(twWords);
  }
};

/* Aplică limba salvată imediat după încărcarea DOM */
document.addEventListener('DOMContentLoaded', function () {
  const saved = localStorage.getItem('wonki-lang') || 'ro';
  if (saved !== 'ro') window.applyLang(saved);
});
