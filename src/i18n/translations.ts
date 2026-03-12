export type Lang = "EN" | "ET" | "RU" | "LV";

export const translations: Record<Lang, Record<string, string>> = {
  EN: {
    // Nav
    navAbout: "About",
    navServices: "What We Offer",
    navContact: "Contact",

    // Hero
    heroTitle: "Reliable Refrigerant Gas Trading Partner",
    heroText: "We supply high-quality refrigerant gases for HVAC, refrigeration, and industrial applications, working with partners across international markets.",
    heroCta: "Contact Us",

    // About
    aboutTitle: "About Us",
    aboutP1: "With over a decade of experience in the refrigerant gas industry, we have established ourselves as a trusted partner for businesses seeking reliable and compliant supply solutions. Our team combines deep technical knowledge with a commitment to sustainable practices.",
    aboutP2: "We work closely with manufacturers, distributors, and end-users across Europe and beyond, ensuring that every client receives the right products at competitive prices with full regulatory compliance.",
    aboutP3: "Our mission is to simplify refrigerant procurement while supporting the industry's transition to lower-GWP alternatives, helping our partners stay ahead of evolving environmental regulations.",

    // Services
    servicesTitle: "What We Offer",
    service1: "Wholesale supply of HFC, HFO, and natural refrigerant gases",
    service2: "Sourcing and procurement of R-410A, R-134a, R-32, R-404A and more",
    service3: "Cross-border logistics and customs-compliant delivery",
    service4: "F-Gas quota management and regulatory compliance support",
    service5: "Bulk and cylinder packaging tailored to client needs",
    service6: "Long-term supply agreements with competitive pricing",
    service7: "Technical consultation on refrigerant selection and transition",

    // Contact
    contactTitle: "Contact",
    contactIntro: "Interested in working with us? Fill out the form below and our team will get back to you within one business day to discuss your refrigerant supply needs.",
    labelCompany: "Company Name",
    placeholderCompany: "Your company",
    labelContact: "Contact Person",
    placeholderContact: "Full name",
    labelEmail: "Email",
    placeholderEmail: "you@company.com",
    labelMessage: "Message",
    placeholderMessage: "Tell us about your requirements…",
    consentText: "I agree to the processing of my personal data for the purpose of handling this inquiry.",
    submitButton: "Send Request",
    successMessage: "Thank you for your message. We will contact you shortly.",
    errorTitle: "Error",
    errorMessage: "Something went wrong. Please try again later.",

    // Footer
    footerRights: "All rights reserved.",
  },
  ET: {
    navAbout: "Meist",
    navServices: "Mida pakume",
    navContact: "Kontakt",

    heroTitle: "Usaldusväärne külmagaasi kauplemise partner",
    heroText: "Tarnime kvaliteetseid külmagaase kliima-, külmutus- ja tööstusrakendusteks, tehes koostööd partneritega rahvusvahelistel turgudel.",
    heroCta: "Võta ühendust",

    aboutTitle: "Meist",
    aboutP1: "Enam kui kümneaastase kogemusega külmagaasi tööstuses oleme end kehtestanud usaldusväärse partnerina ettevõtetele, kes otsivad usaldusväärseid ja nõuetele vastavaid tarnelahendusi. Meie meeskond ühendab sügavad tehnilised teadmised pühendumisega jätkusuutlikele tavadele.",
    aboutP2: "Teeme tihedat koostööd tootjate, turustajate ja lõppkasutajatega kogu Euroopas ja laiemalt, tagades igale kliendile õiged tooted konkurentsivõimeliste hindadega ning täieliku regulatiivse vastavusega.",
    aboutP3: "Meie missioon on lihtsustada külmaine hankimist, toetades samal ajal tööstuse üleminekut madalama GWP-ga alternatiividele, aidates meie partneritel olla arenevate keskkonnaeeskirjadega kursis.",

    servicesTitle: "Mida pakume",
    service1: "HFC, HFO ja looduslike külmagaaside hulgimüük",
    service2: "R-410A, R-134a, R-32, R-404A ja muude hankimine",
    service3: "Piiriülene logistika ja tollile vastav kohaletoimetamine",
    service4: "F-gaasi kvoodi haldamine ja regulatiivne vastavuse tugi",
    service5: "Hulgi- ja balloonpakendid vastavalt kliendi vajadustele",
    service6: "Pikaajalised tarnelepingud konkurentsivõimeliste hindadega",
    service7: "Tehniline konsultatsioon külmaine valiku ja ülemineku kohta",

    contactTitle: "Kontakt",
    contactIntro: "Huvitatud koostööst? Täitke allolev vorm ja meie meeskond võtab teiega ühendust ühe tööpäeva jooksul, et arutada teie külmagaasi tarnevajadusi.",
    labelCompany: "Ettevõtte nimi",
    placeholderCompany: "Teie ettevõte",
    labelContact: "Kontaktisik",
    placeholderContact: "Täisnimi",
    labelEmail: "E-post",
    placeholderEmail: "teie@ettevote.ee",
    labelMessage: "Sõnum",
    placeholderMessage: "Rääkige meile oma vajadustest…",
    consentText: "Nõustun oma isikuandmete töötlemisega selle päringu käsitlemise eesmärgil.",
    submitButton: "Saada päring",
    successMessage: "Täname teid sõnumi eest. Võtame teiega peagi ühendust.",
    errorTitle: "Viga",
    errorMessage: "Midagi läks valesti. Palun proovige hiljem uuesti.",

    footerRights: "Kõik õigused kaitstud.",
  },
  RU: {
    navAbout: "О нас",
    navServices: "Что мы предлагаем",
    navContact: "Контакты",

    heroTitle: "Надёжный партнёр по торговле хладагентами",
    heroText: "Мы поставляем высококачественные хладагенты для систем HVAC, холодильного оборудования и промышленного применения, сотрудничая с партнёрами на международных рынках.",
    heroCta: "Связаться с нами",

    aboutTitle: "О нас",
    aboutP1: "Обладая более чем десятилетним опытом в индустрии хладагентов, мы зарекомендовали себя как надёжный партнёр для предприятий, ищущих надёжные и соответствующие нормативам решения по поставкам. Наша команда сочетает глубокие технические знания с приверженностью устойчивым практикам.",
    aboutP2: "Мы тесно сотрудничаем с производителями, дистрибьюторами и конечными потребителями по всей Европе и за её пределами, гарантируя каждому клиенту получение правильных продуктов по конкурентоспособным ценам с полным соблюдением нормативных требований.",
    aboutP3: "Наша миссия — упростить закупки хладагентов, поддерживая переход отрасли к альтернативам с более низким потенциалом глобального потепления и помогая нашим партнёрам опережать меняющиеся экологические нормы.",

    servicesTitle: "Что мы предлагаем",
    service1: "Оптовые поставки хладагентов HFC, HFO и природных хладагентов",
    service2: "Поиск и закупка R-410A, R-134a, R-32, R-404A и других",
    service3: "Трансграничная логистика и доставка с соблюдением таможенных норм",
    service4: "Управление квотами F-Gas и поддержка соблюдения нормативных требований",
    service5: "Фасовка в бочки и баллоны в соответствии с потребностями клиента",
    service6: "Долгосрочные договоры поставки по конкурентоспособным ценам",
    service7: "Техническое консультирование по выбору и переходу на хладагенты",

    contactTitle: "Контакты",
    contactIntro: "Заинтересованы в сотрудничестве? Заполните форму ниже, и наша команда свяжется с вами в течение одного рабочего дня для обсуждения ваших потребностей в поставках хладагентов.",
    labelCompany: "Название компании",
    placeholderCompany: "Ваша компания",
    labelContact: "Контактное лицо",
    placeholderContact: "Полное имя",
    labelEmail: "Электронная почта",
    placeholderEmail: "вы@компания.com",
    labelMessage: "Сообщение",
    placeholderMessage: "Расскажите нам о ваших требованиях…",
    consentText: "Я согласен на обработку моих персональных данных с целью обработки данного запроса.",
    submitButton: "Отправить запрос",
    successMessage: "Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время.",

    footerRights: "Все права защищены.",
  },
  LV: {
    navAbout: "Par mums",
    navServices: "Ko mēs piedāvājam",
    navContact: "Kontakti",

    heroTitle: "Uzticams aukstumaģentu tirdzniecības partneris",
    heroText: "Mēs piegādājam augstas kvalitātes aukstumaģentu gāzes HVAC, saldēšanas un rūpnieciskajiem pielietojumiem, sadarbojoties ar partneriem starptautiskajos tirgos.",
    heroCta: "Sazināties ar mums",

    aboutTitle: "Par mums",
    aboutP1: "Ar vairāk nekā desmit gadu pieredzi aukstumaģentu gāzu nozarē mēs esam nostiprinājušies kā uzticams partneris uzņēmumiem, kas meklē drošus un atbilstošus piegādes risinājumus. Mūsu komanda apvieno dziļas tehniskās zināšanas ar apņemšanos ievērot ilgtspējīgas prakses.",
    aboutP2: "Mēs cieši sadarbojamies ar ražotājiem, izplatītājiem un gala lietotājiem visā Eiropā un ārpus tās, nodrošinot katram klientam pareizus produktus par konkurētspējīgām cenām ar pilnīgu normatīvo atbilstību.",
    aboutP3: "Mūsu misija ir vienkāršot aukstumaģentu iepirkumu, vienlaikus atbalstot nozares pāreju uz alternatīvām ar zemāku globālās sasilšanas potenciālu, palīdzot mūsu partneriem apsteigt mainīgos vides noteikumus.",

    servicesTitle: "Ko mēs piedāvājam",
    service1: "HFC, HFO un dabisko aukstumaģentu gāzu vairumtirdzniecība",
    service2: "R-410A, R-134a, R-32, R-404A un citu iepirkšana",
    service3: "Pārrobežu loģistika un muitas prasībām atbilstoša piegāde",
    service4: "F-gāzu kvotu pārvaldība un normatīvās atbilstības atbalsts",
    service5: "Vairumtirdzniecības un balonu iepakojums pēc klienta vajadzībām",
    service6: "Ilgtermiņa piegādes līgumi ar konkurētspējīgām cenām",
    service7: "Tehniskā konsultācija par aukstumaģentu izvēli un pāreju",

    contactTitle: "Kontakti",
    contactIntro: "Interesē sadarbība? Aizpildiet zemāk esošo formu, un mūsu komanda sazināsies ar jums vienas darba dienas laikā, lai pārrunātu jūsu aukstumaģentu piegādes vajadzības.",
    labelCompany: "Uzņēmuma nosaukums",
    placeholderCompany: "Jūsu uzņēmums",
    labelContact: "Kontaktpersona",
    placeholderContact: "Pilns vārds",
    labelEmail: "E-pasts",
    placeholderEmail: "jus@uznemums.lv",
    labelMessage: "Ziņojums",
    placeholderMessage: "Pastāstiet mums par savām prasībām…",
    consentText: "Piekrītu savu personas datu apstrādei šī pieprasījuma izskatīšanas nolūkā.",
    submitButton: "Nosūtīt pieprasījumu",
    successMessage: "Paldies par jūsu ziņojumu. Mēs ar jums sazināsimies tuvākajā laikā.",

    footerRights: "Visas tiesības aizsargātas.",
  },
};
