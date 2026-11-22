/* =========================================================
   קובץ התפריט – כאן עורכים מנות, מחירים והגדרות.
   ראו CLAUDE.md להסבר מלא.
   ========================================================= */

window.SETTINGS = {
  // מספר הוואטסאפ שאליו נשלחות ההזמנות (פורמט בינלאומי, בלי + ובלי מקפים)
  whatsappNumber: "972522596929",
  // שם המקבל, מופיע על הכפתור
  ownerName: "עמוס",
  // אמצעי תשלום – מוצג בשורה קטנה מתחת לסה"כ ובהודעת הוואטסאפ
  paymentMethods: "ביט או פייבוקס",

  // חלון הזמנות שבועי (לפי שעון ישראל).
  // ימים: 0=ראשון, 1=שני, 2=שלישי, 3=רביעי, 4=חמישי, 5=שישי, 6=שבת
  // ההזמנות נסגרות ביום closeDay בשעה closeHour,
  // ונפתחות מחדש ביום reopenDay בשעה reopenHour (מוצאי שבת).
  closeDay: 3,
  closeHour: 20,
  reopenDay: 6,
  reopenHour: 20,
};

window.MENU = [
  {
    category: "מוצרי מאפה",
    icon: "🥟",
    items: [
      { id: "samsa-meat",      name: "סמסה גוזוגצ'ה במילוי בשר",   unit: "יחידה",     price: 13 },
      { id: "samsa-pumpkin",   name: "סמסה גוזוגצ'ה במילוי דלעת",  unit: "יחידה",     price: 13 },
      { id: "samsa-potato",    name: "סמסה במילוי תפוחי אדמה",     unit: "יחידה",     price: 13 },
      { id: "samsa-mushroom",  name: "סמסה במילוי פטריות",         unit: "יחידה",     price: 13 },
      { id: "samsa-nuts",      name: "סמסה אגוזים",                unit: "יחידה",     price: 13 },
      { id: "samsa-chicken",   name: "סמסה עוף",                   unit: "יחידה",     price: 13 },
      { id: "samsa-hummus",    name: "סמסה חומוס",                 unit: "יחידה",     price: 13 },
      { id: "samsa-spinach",   name: "סמסה תרד",                   unit: "יחידה",     price: 13 },
      { id: "chiburek",        name: "צ'יבוריק",                   unit: "יחידה",     price: 13 },
      { id: "non-toki-small",  name: "נון טוקי אישי קטן",          unit: "5 יחידות",  price: 13 },
      { id: "non-toki-medium", name: "נון טוקי בינוני",            unit: "3 יחידות",  price: 13 },
      { id: "manti",           name: "מנטו",                       unit: "5 יחידות",  price: 55 },
      { id: "dushpara",        name: "דושפרה / פילמיני",           unit: "חצי ק\"ג",  price: 55 },
    ],
  },
  {
    category: "מנות עיקריות",
    icon: "🍲",
    items: [
      { id: "oshpalov", name: "אושפלוב", unit: "חצי ק\"ג", price: 50 },
      { id: "bakhsh",   name: "בכש",     unit: "חצי ק\"ג", price: 50 },
    ],
  },
  {
    category: "קינוחים ומנות אחרונות",
    icon: "🍯",
    items: [
      { id: "lavz",     name: "לבס עם שקדים ואגוזים", unit: "5 יחידות",    price: 55 },
      { id: "chakchak", name: "צ'אקצ'אק – עוגה מתוקה", unit: "יחידה / מנה", price: 55 },
    ],
  },
];
