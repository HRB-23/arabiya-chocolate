/* ============================================================
   PRODUCTS — placeholders. Replace names, prices and add photos.
   price: number, or null for "price on request".
   featured: true shows the product on the home page.
   image: path like "assets/products/pralines.jpg" (optional).
   ============================================================ */
const CATEGORIES = [
  { id: "all",       ar: "الكل",            he: "הכול" },
  { id: "boxes",     ar: "بوكسات",          he: "מארזים" },
  { id: "bars",      ar: "ألواح",           he: "טבלאות" },
  { id: "arabic",    ar: "نكهات عربية",     he: "טעמים ערביים" },
  { id: "occasions", ar: "مناسبات",         he: "אירועים" },
];

const PRODUCTS = [
  {
    id: "pralines-12", featured: true, category: "boxes", price: 85, image: "",
    name: { ar: "بوكس برالين ١٢ قطعة", he: "מארז פרלינים 12 יח׳" },
    desc: { ar: "تشكيلة من حشوات الكراميل والبندق والفستق.", he: "מבחר מילויים: קרמל, אגוזי לוז ופיסטוק." },
  },
  {
    id: "truffles-hazelnut", category: "boxes", price: 70, image: "",
    name: { ar: "ترافل بالبندق", he: "טראפלס אגוזי לוז" },
    desc: { ar: "ترافل ناعم مغطى بالكاكاو والبندق المحمص.", he: "טראפלס רך מצופה קקאו ואגוזי לוז קלויים." },
  },
  {
    id: "kunafa-bar", featured: true, category: "bars", price: 45, image: "",
    name: { ar: "لوح الفستق والكنافة", he: "טבלת פיסטוק וכנאפה" },
    desc: { ar: "شوكلاطة بالحليب محشوة بكريمة الفستق والكنافة المقرمشة.", he: "שוקולד חלב במילוי קרם פיסטוק וכנאפה פריכה." },
  },
  {
    id: "dark-70", category: "bars", price: 30, image: "",
    name: { ar: "لوح داكن ٧٠٪", he: "טבלה מריר 70%" },
    desc: { ar: "طعم كاكاو عميق لمحبي الشوكلاطة الداكنة.", he: "טעם קקאו עמוק לאוהבי המריר." },
  },
  {
    id: "stuffed-dates", featured: true, category: "arabic", price: 60, image: "",
    name: { ar: "تمر محشي بالشوكلاطة", he: "תמרים ממולאים בשוקולד" },
    desc: { ar: "تمر مجهول محشي باللوز ومغطى بالشوكلاطة.", he: "תמרי מג׳הול ממולאים בשקד ומצופים שוקולד." },
  },
  {
    id: "eid-box", category: "occasions", price: 120, image: "",
    name: { ar: "بوكس العيد", he: "מארז החג" },
    desc: { ar: "بوكس موسمي فاخر لرمضان والأعياد.", he: "מארז עונתי יוקרתי לרמדאן ולחגים." },
  },
  {
    id: "luxury-tray", category: "occasions", price: 250, image: "",
    name: { ar: "صينية شوكلاطة فاخرة", he: "מגש שוקולד יוקרתי" },
    desc: { ar: "صينية ضيافة مزينة تكفي للعائلة والضيوف.", he: "מגש אירוח מעוצב למשפחה ולאורחים." },
  },
  {
    id: "giveaways", category: "occasions", price: null, image: "",
    name: { ar: "توزيعات المناسبات", he: "מזכרות לאירועים" },
    desc: { ar: "توزيعات مخصصة للأعراس والمواليد بالكمية التي تريدها.", he: "מזכרות מותאמות לחתונות וללידות בכל כמות." },
  },
];
