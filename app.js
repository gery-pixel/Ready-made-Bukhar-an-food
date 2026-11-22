(function () {
  "use strict";

  var S = window.SETTINGS;
  var MENU = window.MENU;
  var cart = {}; // id -> qty
  var itemsById = {};
  var DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  var $ = function (id) { return document.getElementById(id); };
  var shekel = function (n) { return "₪" + n.toLocaleString("he-IL"); };

  /* ---------- Render menu ---------- */
  function renderMenu() {
    var root = $("menu");
    MENU.forEach(function (cat) {
      var sec = document.createElement("section");
      sec.className = "category";
      var h = document.createElement("h2");
      h.textContent = (cat.icon ? cat.icon + " " : "") + cat.category;
      sec.appendChild(h);

      cat.items.forEach(function (it) {
        itemsById[it.id] = it;
        var row = document.createElement("div");
        row.className = "item";
        row.dataset.id = it.id;
        row.innerHTML =
          '<div class="item-info">' +
            '<div class="item-name"></div>' +
            '<div class="item-meta"><span class="unit"></span> · <span class="item-price"></span></div>' +
          "</div>" +
          '<div class="qty">' +
            '<button type="button" class="plus" aria-label="הוסף">+</button>' +
            '<span class="count" aria-live="polite">0</span>' +
            '<button type="button" class="minus" aria-label="הפחת" disabled>−</button>' +
          "</div>";
        row.querySelector(".item-name").textContent = it.name;
        row.querySelector(".unit").textContent = it.unit;
        row.querySelector(".item-price").textContent = shekel(it.price);
        row.querySelector(".plus").addEventListener("click", function () { change(it.id, 1); });
        row.querySelector(".minus").addEventListener("click", function () { change(it.id, -1); });
        sec.appendChild(row);
      });
      root.appendChild(sec);
    });
  }

  function change(id, delta) {
    var q = Math.max(0, Math.min(99, (cart[id] || 0) + delta));
    if (q === 0) delete cart[id]; else cart[id] = q;
    var row = document.querySelector('.item[data-id="' + id + '"]');
    row.querySelector(".count").textContent = q;
    row.querySelector(".minus").disabled = q === 0;
    row.classList.toggle("selected", q > 0);
    updateSummary();
  }

  function cartLines() {
    return Object.keys(cart).map(function (id) {
      var it = itemsById[id];
      return { item: it, qty: cart[id], sum: it.price * cart[id] };
    });
  }

  function updateSummary() {
    var lines = cartLines();
    var total = 0, count = 0;
    var list = $("summary-list");
    list.innerHTML = "";
    lines.forEach(function (l) {
      total += l.sum; count += l.qty;
      var li = document.createElement("li");
      var a = document.createElement("span");
      a.textContent = l.qty + " × " + l.item.name + " (" + l.item.unit + ")";
      var b = document.createElement("span");
      b.textContent = shekel(l.sum);
      li.appendChild(a); li.appendChild(b);
      list.appendChild(li);
    });
    $("summary-empty").hidden = lines.length > 0;
    $("total").textContent = shekel(total);
    $("sticky-count").textContent = count;
    $("sticky-total").textContent = shekel(total);
    $("sticky-bar").hidden = count === 0;
    return total;
  }

  /* ---------- Weekly order window (Israel time) ---------- */
  function israelNow() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jerusalem", weekday: "short", hour: "numeric", minute: "numeric", hour12: false,
    }).formatToParts(new Date());
    var get = function (t) { return parts.find(function (p) { return p.type === t; }).value; };
    var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day: day, hour: parseInt(get("hour"), 10) % 24, minute: parseInt(get("minute"), 10) };
  }

  function isClosed() {
    var n = israelNow();
    var now = n.day * 1440 + n.hour * 60 + n.minute;
    var close = S.closeDay * 1440 + S.closeHour * 60;
    var open = S.reopenDay * 1440 + S.reopenHour * 60;
    return close <= open ? (now >= close && now < open) : (now >= close || now < open);
  }

  function fmtHour(h) { return (h < 10 ? "0" : "") + h + ":00"; }

  function applyLock() {
    var closed = isClosed();
    var btn = $("send-btn");
    var banner = $("closed-banner");
    btn.disabled = closed;
    if (closed) {
      $("send-label").textContent = "ההזמנות לשבוע זה נסגרו";
      banner.hidden = false;
      banner.innerHTML = "";
      var t = document.createElement("div");
      t.textContent = "🔒 ההזמנות לשבוע זה נסגרו (יום " + DAYS[S.closeDay] + " ב-" + fmtHour(S.closeHour) + ").";
      var t2 = document.createElement("div");
      t2.style.fontWeight = "400";
      t2.textContent = "ההזמנות ייפתחו מחדש לשבוע הבא – ביום " + DAYS[S.reopenDay] + " ב-" + fmtHour(S.reopenHour) + ". תודה על הסבלנות!";
      banner.appendChild(t); banner.appendChild(t2);
    } else {
      $("send-label").textContent = "שלח הזמנה בוואטסאפ ל" + S.ownerName;
      banner.hidden = true;
    }
    return closed;
  }

  /* ---------- Submit ---------- */
  function normalizePhone(p) { return p.replace(/[\s\-()]/g, "").replace(/^\+?972/, "0"); }

  function showError(msg) {
    var e = $("form-error");
    e.textContent = msg;
    e.hidden = !msg;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    if (applyLock()) return;
    var f = ev.target;
    var get = function (n) { return f.elements[n].value.trim(); };
    var lines = cartLines();
    var bad = [];

    ["name", "phone", "city", "street", "building"].forEach(function (n) {
      var el = f.elements[n];
      var ok = !!el.value.trim();
      if (n === "phone" && ok) ok = /^05\d{8}$/.test(normalizePhone(el.value));
      el.classList.toggle("invalid", !ok);
      if (!ok) bad.push(el);
    });

    if (!lines.length) {
      showError("יש לבחור לפחות מנה אחת מהתפריט.");
      $("menu").scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (bad.length) {
      var phoneBad = bad.indexOf(f.elements.phone) !== -1 && get("phone");
      showError(phoneBad ? "מספר הטלפון הנייד אינו תקין (לדוגמה: 0521234567)." : "נא למלא את כל שדות החובה המסומנים ב-*.");
      bad[0].focus();
      return;
    }
    showError("");

    var total = updateSummary();
    var msg = [];
    msg.push("*הזמנה חדשה – התפריט הבוכרי* 🥟");
    msg.push("");
    msg.push("*המנות שהוזמנו:*");
    lines.forEach(function (l) {
      msg.push("• " + l.item.name + " (" + l.item.unit + ") × " + l.qty + " = " + shekel(l.sum));
    });
    msg.push("");
    msg.push("*סה\"כ לתשלום: " + shekel(total) + "* (משלוח חינם)");
    if (S.paymentMethods) msg.push("תשלום: " + S.paymentMethods);
    msg.push("");
    msg.push("*פרטי הלקוח:*");
    msg.push("שם: " + get("name"));
    msg.push("טלפון: " + normalizePhone(get("phone")));
    msg.push("כתובת: " + get("street") + " " + get("building") + ", " + get("city"));
    msg.push("הערות: " + (get("notes") || "אין"));

    var url = "https://wa.me/" + S.whatsappNumber + "?text=" + encodeURIComponent(msg.join("\n"));
    window.location.href = url;
  }

  /* ---------- Init ---------- */
  renderMenu();
  if (S.paymentMethods) {
    $("payment-note").textContent = "התשלום ב" + S.paymentMethods + " ל" + S.ownerName + ", לאחר אישור ההזמנה.";
  } else {
    $("payment-note").hidden = true;
  }
  updateSummary();
  applyLock();
  setInterval(applyLock, 30000);
  $("order-form").addEventListener("submit", onSubmit);
  $("order-form").addEventListener("input", function (e) {
    if (e.target.classList) e.target.classList.remove("invalid");
  });
})();
