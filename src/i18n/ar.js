/**
 * نصوص الواجهة بالعربية (مواصفات المنتج §10.3).
 * المفاتيح مطابقة تمامًا لـ src/i18n/en.js، ويتحقق من ذلك tests/i18n.test.js.
 * نص عادي فقط بلا HTML. القيم مثل "{name}" يملؤها t().
 */
export default {
  // زر تبديل اللغة
  "lang.switchTo": "English",

  // عناوين الصفحات
  "title.home": "BorrowBox — مشاركة الأدوات بين الجيران",
  "title.catalog": "الكتالوج — BorrowBox",
  "title.listItem": "اعرض أداة — BorrowBox",
  "title.dashboard": "نشاطي — BorrowBox",
  "title.notFound": "الصفحة غير موجودة — BorrowBox",
  "title.register": "إنشاء حساب — BorrowBox",
  "title.itemNotFound": "الأداة غير موجودة — BorrowBox",
  "title.item": "{title} — BorrowBox",

  // الترويسة
  "nav.skip": "انتقل إلى المحتوى الرئيسي",
  "nav.homeLabel": "الصفحة الرئيسية لـ BorrowBox",
  "nav.mainLabel": "التنقل الرئيسي",
  "nav.explore": "استكشف",
  "nav.howItWorks": "كيف يعمل",
  "nav.myActivity": "نشاطي",
  "nav.listItem": "اعرض أداة",
  "nav.profileLabel": "الملف الشخصي وتبديل الحساب التجريبي لـ {name}",
  "nav.switchPersona": "بدّل الحساب التجريبي",
  "nav.menuToggle": "فتح قائمة التنقل أو إغلاقها",

  // أدوار الحسابات (القيم المخزنة تبقى بالإنجليزية)
  "role.Owner": "مالك",
  "role.Borrower": "مستعير",
  "role.New Member": "عضو جديد",

  // التصنيفات (البيانات والروابط تبقى بالإنجليزية)
  "category.Power Tools": "أدوات كهربائية",
  "category.Hand Tools": "أدوات يدوية",
  "category.Gardening": "البستنة",
  "category.Cleaning": "التنظيف",
  "category.Camping": "التخييم",
  "category.Outdoor Equipment": "معدات خارجية",

  // حالة التوفر
  "status.Available": "متاح",
  "status.Reserved": "محجوز",
  "status.Unavailable": "غير متاح",

  // مستوى الحالة
  "condition.Like New": "كالجديد",
  "condition.Excellent": "ممتازة",
  "condition.Good": "جيدة",
  "condition.Fair": "مقبولة",

  // القسم الرئيسي
  "home.hero.eyebrow": "أدوات مستعملة، يتشاركها الجيران",
  "home.hero.title": "استعر ما تحتاجه.",
  "home.hero.titleAccent": "وشارك ما تملكه.",
  "home.hero.bullet1": "أدوات مستعملة بجودة عالية من جيرانك في الحي",
  "home.hero.bullet2": "كل استعارة محمية بتأمين مسترد",
  "home.hero.bullet3": "استخدمها لإنجاز عملك، ثم أعِدها",
  "home.hero.searchLabel": "ابحث عن الأدوات والمعدات",
  "home.hero.searchInputLabel": "ابحث عن المعدات بكلمة مفتاحية",
  "home.hero.searchPlaceholder": "ابحث عن مثقاب، جزّازة عشب، خيمة…",
  "home.hero.searchButton": "بحث",
  "home.hero.exploreAll": "استكشف كل الأدوات",
  "home.hero.pause": "أوقف عرض الصور في الخلفية",
  "home.hero.play": "شغّل عرض الصور في الخلفية",

  // من نحن
  "home.about.eyebrow": "عن BorrowBox",
  "home.about.title": "لماذا تشتري أداة ستستخدمها مرتين فقط؟",
  "home.about.text":
    "يربط BorrowBox أصحاب الأدوات المستعملة بجيرانهم الذين يحتاجونها ليوم أو لعطلة نهاية الأسبوع. يستفيد المالكون من أدوات لا يستخدمونها، ويوفّر المستعيرون ثمنها ومساحة تخزينها، وكل عملية تسليم محمية بتأمين مسترد.",
  "home.about.link": "تعرّف على طريقة العمل",

  // مجموعات التصنيفات
  "home.categories.title": "تصفّح الأدوات حسب التصنيف",
  "home.categories.viewAll": "عرض كل الأدوات",
  "home.groups.tools.title": "العُدد والأدوات",
  "home.groups.tools.description":
    "مثاقب ومناشير وآلات صنفرة وأدوات يدوية من جيران يملكونها بالفعل. استعرها ليوم، أو لعطلة نهاية الأسبوع، أو لمشروع كامل.",
  "home.groups.tools.imageAlt": "مثقاب لاسلكي وشريط قياس ومطرقة على طاولة عمل",
  "home.groups.garden.title": "الحديقة والأنشطة الخارجية",
  "home.groups.garden.description":
    "جزّازات وآلات تشذيب ومعدات تخييم لعطلة نهاية الأسبوع، دون أن تشتريها أو تبحث عن مكان لتخزينها.",
  "home.groups.garden.imageAlt": "كرسي تخييم وحقيبة ظهر وفانوس على العشب",
  "home.groups.home.title": "المنزل والتنظيف",
  "home.groups.home.description":
    "آلات ومستلزمات تنظيف للأعمال العارضة والتنظيف الموسمي الشامل.",
  "home.groups.home.imageAlt": "دلو فيه مستلزمات تنظيف وبخاخات وفرشاة",

  // أدوات مميزة
  "home.featured.title": "أدوات مميزة في منطقتك",
  "home.featured.viewAll": "عرض الكل",

  // كيف يعمل
  "home.how.title": "كيف يعمل BorrowBox",
  "home.how.lead": "أربع خطوات من «أحتاج مثقابًا» إلى عمل منجز.",
  "home.how.step1": "اعثر على أداة قريبة منك",
  "home.how.step2": "احجز التواريخ المناسبة",
  "home.how.step3": "استلمها واستخدمها",
  "home.how.step4": "أعِدها واسترد تأمينك",
  "home.how.imageAlt": "جار يسلّم مثقابًا لاسلكيًا لجاره",

  // أدوات غير مستخدمة
  "home.idle.title": "لديك أدوات لا تستخدمها؟",
  "home.idle.lead": "اعرض أداة مستعملة خلال دقائق، وحدّد بنفسك متى تكون متاحة.",
  "home.idle.point1": "أضف صورًا وصِف حالتها",
  "home.idle.point2": "حدّد التواريخ ومبلغ التأمين",
  "home.idle.point3": "وافق على طلبات الجيران الموثّقين",
  "home.idle.imageAlt": "مرآب منزلي مرتب فيه أدوات معلّقة على لوح",

  // لماذا BorrowBox
  "home.why.title": "لماذا BorrowBox؟",
  "home.why.item1.title": "هدر أقل",
  "home.why.item1.text":
    "تحصل الأدوات المستعملة على حياة ثانية بدل أن تبقى مركونة في المرآب.",
  "home.why.item2.title": "تأمين مسترد",
  "home.why.item2.text": "تأمين تجريبي يحمي المالكين ويعود إليك.",
  "home.why.item3.title": "جيران موثّقون",
  "home.why.item3.text": "يؤكد الأعضاء هويتهم قبل الاستعارة.",
  "home.why.item4.title": "تقييمات موثوقة",
  "home.why.item4.text": "يقيّم الطرفان بعضهما بعد كل عملية تبادل.",
  "home.why.item5.title": "استلام قريب",
  "home.why.item5.text":
    "أدوات على بُعد شوارع قليلة، لا في الطرف الآخر من المدينة.",

  // بطاقة الأداة
  "card.ratingLabel": "التقييم {rating} من 5",
  "card.conditionLabel": "الحالة:",
  "card.owner": "المالك: {name}",
  "card.depositLabel": "تأمين مسترد",
  "card.freeLoan": "استعارة مجانية",

  // صفحة الأداة
  "item.back": "العودة إلى الكتالوج",
  "item.conditionHeading": "الحالة: {condition}",
  "item.ownerHeading": "المالك",
  "item.verified": "✓ موثّق",
  "item.rating": "★ تقييم {rating}",
  "item.notFoundTitle": "لم نعثر على هذه الأداة",
  "item.notFoundText": "ربما حُذفت، أو أن الرابط غير صحيح.",
  "item.browseCatalog": "تصفّح الكتالوج",

  // لوحة الحجز
  "booking.depositHeading": "تأمين مسترد",
  "booking.note":
    "الاستعارة مجانية. يعود إليك التأمين عند إرجاع الأداة بحالة جيدة.",
  "booking.ownerNote": "هذه الأداة من معروضاتك.",
  "booking.from": "من",
  "booking.to": "إلى",
  "booking.submit": "اطلب الاستعارة",
  "booking.error.missing-dates": "اختر تاريخ البداية وتاريخ النهاية.",
  "booking.error.start-in-past": "اختر تاريخ بداية من اليوم فصاعدًا.",
  "booking.error.end-before-start":
    "اختر تاريخ نهاية مطابقًا لتاريخ البداية أو بعده.",
  "booking.error.duplicate-pending":
    "لديك طلب قيد الانتظار لهذه الأداة بالفعل.",
  "booking.error.overlap": "تتداخل هذه التواريخ مع حجز قائم. اختر تواريخ أخرى.",
  "booking.error.save-failed":
    "تعذّر حفظ طلبك. تأكد من أن متصفحك يسمح بتخزين بيانات الموقع، ثم حاول مرة أخرى.",
  "booking.success": "أُرسل طلبك. أمام المالك 48 ساعة للرد.",

  // الصفحات المؤقتة
  "page.backHome": "العودة إلى الرئيسية",
  "page.catalog.title": "استكشف الكتالوج",
  "page.catalog.filtering": "التصفية حسب التصنيف:",
  "page.catalog.searching": "نتائج البحث عن:",
  "page.catalog.intro":
    "اكتشف الأدوات الكهربائية ومعدات الحديقة والأدوات المنزلية المتاحة في مجتمعك.",
  "page.listItem.title": "اعرض أداة للاستعارة",
  "page.listItem.intro": "شارك معداتك مع جيران موثوقين وحدّد تأمينًا مستردًا.",
  "page.dashboard.title": "نشاطي",
  "page.dashboard.intro":
    "أدِر الأدوات المستعارة وافحص الأدوات المُعادة باسم {name} ({role}).",
  "page.notFound.title": "الصفحة غير موجودة",
  "page.notFound.text": "لم نعثر على الصفحة التي طلبتها.",

  // التسجيل (مواصفات المنتج §1.2 البند 7: تحقق ثم تأكيد، بلا إنشاء مستخدم)
  "register.title": "أنشئ حسابك",
  "register.intro": "انضم إلى جيرانك لاستعارة الأدوات ومشاركتها.",
  "register.name": "الاسم الكامل",
  "register.email": "البريد الإلكتروني",
  "register.password": "كلمة المرور",
  "register.passwordHint": "8 أحرف على الأقل",
  "register.agree": "أوافق على إرشادات المجتمع",
  "register.submit": "إنشاء حساب",
  "register.success":
    "شكرًا يا {name}. هذه نسخة تجريبية، لذلك لم يُنشأ أي حساب.",
  "footer.register": "إنشاء حساب",

  // التذييل
  "footer.tagline": "استعر ما تحتاجه، وشارك ما تملكه.",
  "footer.quickLinks": "روابط سريعة",
  "footer.categories": "التصنيفات",
  "footer.bottom": "© 2026 BorrowBox. مبالغ التأمين تجريبية.",
};
