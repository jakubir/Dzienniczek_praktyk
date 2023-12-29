const metryczka = document.querySelector(".metryczka");
const dziennik = document.querySelector(".dziennik");
let lacznaIloscGodzin = 0;
const dzialy = new Map();
const podsumowanie = document.querySelector(".podsumowanie");
const godziny = document.querySelectorAll(
  ".table__cell:nth-child(even):not(.table__cell--head)"
);
const ocena = document.querySelector(".ocena .input");

// przygotowanie mapy dzialy
teachingProgram.map((dzial) => {
  dzial.topic.map((temat) => {
    if (dzialy.has(dzial.name))
      dzialy.set(dzial.name, new Map([...dzialy.get(dzial.name), [temat, 0]]));
    else dzialy.set(dzial.name, new Map([[temat, 0]]));
  });
});

// uzupełnienie mapy dzialy zapisanymi danymi
for (let i = 0; i < localStorage.length; i++)
  if (!isNaN(localStorage.key(i))) {
    let tmp = JSON.parse(localStorage.getItem(localStorage.key(i)));
    lacznaIloscGodzin += parseFloat(tmp.iloscGodzin);
    dzialy.set(
      tmp.dzial,
      new Map([
        ...dzialy.get(tmp.dzial),
        [
          tmp.temat,
          parseFloat(tmp.iloscGodzin) + dzialy.get(tmp.dzial).get(tmp.temat),
        ],
      ])
    );
  }

// wyświetlanie odpowiedniej części aplikacji w zależności od adresu url
function app() {
  switch (window.location.href.split('/')[window.location.href.split('/').length - 1]) {
    case "dziennik":
      metryczka.classList.add("hidden");
      dziennik.classList.remove("hidden");
      podsumowanie.classList.add("hidden");
      break;
    case "podsumowanie":
      metryczka.classList.add("hidden");
      dziennik.classList.add("hidden");
      podsumowanie.classList.remove("hidden");
      break;
    default:
      if (
        window.location.href.split('/')[window.location.href.split('/').length - 1] == 'index.html' ||
        window.location.href.split('/')[window.location.href.split('/').length - 1] == ''
        )
        history.replaceState("", "", '/#/metryczka');
      metryczka.classList.remove("hidden");
      metryczkaShow();
      dziennik.classList.add("hidden");
      podsumowanie.classList.add("hidden");
      break;
  }
}
(function () {
  app();

  // obsługa przycisków nawigacji
  window.addEventListener("popstate", () => app());
})();

// wyświetlenie odpowiedniej wersji części 'metryczka', w zależności od występowania zapisanych danych
function metryczkaShow() {
  if (localStorage.getItem("dane") == null) {
    document.querySelector(".metryczka__dane").classList.add("hidden");
    document.querySelector(".form").classList.remove("hidden");
  } else {
    const dane = JSON.parse(localStorage.getItem("dane"));

    document.querySelector(".metryczka__dane").classList.remove("hidden");
    document.querySelector(".form").classList.add("hidden");
    const daneWiek = document.querySelector(".dane--wiek");

    document.querySelector(".dane--imieINazwisko").innerHTML =
      dane.imie + " " + dane.nazwisko;
    const data = fetch(`https://api.agify.io?name=${dane.imie}&country_id=PL`)
      .then((res) => res.json())
      .then((data) => {
        if (data.age == null)
          throw new Error("Nie udało się przewidzieć twojego wieku");
        else {
          daneWiek.innerHTML = `${data.age} lat`;
        }
      })
      .catch((e) => {
        daneWiek.innerHTML = "nie do przewidzenia";
      });
    document.querySelector(".dane--klasa").innerHTML = dane.klasa;
    document.querySelector(".dane--rokSzkolny").innerHTML = dane.rokSzkolny;
    document.querySelector(".dane--firma").innerHTML = dane.firma;
    document.querySelector(".dane--poczatek").innerHTML = Intl.DateTimeFormat(
      "pl"
    ).format(new Date(dane.poczatek));
    document.querySelector(".dane--koniec").innerHTML = Intl.DateTimeFormat(
      "pl"
    ).format(new Date(dane.koniec));

    document
      .querySelector(".dziennik .input")
      .setAttribute("min", dane.poczatek);
    document.querySelector(".dziennik .input").setAttribute("max", dane.koniec);
  }
}

// sprawdzenie czy podany w parametrze temat został zrealizowany
function czyZrealizowano(temat) {
  for (let i = 0; i < localStorage.length; i++)
    if (
      !isNaN(localStorage.key(i)) &&
      JSON.parse(localStorage.getItem(localStorage.key(i))).temat == temat &&
      JSON.parse(localStorage.getItem(localStorage.key(i))).realizacja == true
    )
      return true;

  return false;
}

// zlicza godziny w podanym dziale
function godzinyCount(dzial) {
  let godzinySuma = 0;
  const iterator = dzialy.get(dzial.name).values();
  for (let i = 0; i < dzial.topic.length; i++)
    godzinySuma += iterator.next().value;

  return godzinySuma;
}

// wyświetlenie w sekcji podsumowanie aktualnej ilości zrealizowanych godzin
function godzinyShow() {
  godziny[0].innerText = godzinyCount(teachingProgram[0]) + " godz.";
  godziny[1].innerText = godzinyCount(teachingProgram[1]) + " godz.";
  godziny[2].innerText = godzinyCount(teachingProgram[2]) + " godz.";
  godziny[3].innerText = godzinyCount(teachingProgram[3]) + " godz.";
  godziny[4].innerText = lacznaIloscGodzin + " godz.";
  if (hoursToBeCompleted - lacznaIloscGodzin <= 0)
    godziny[5].innerText = `0 godz.`;
  else godziny[5].innerText = `${hoursToBeCompleted - lacznaIloscGodzin} godz.`;
}

function iloscTematow() {
  let iloscTematow = 0;

  for (let i = 0; i < localStorage.length; i++)
    if (!isNaN(localStorage.key(i))) iloscTematow++;

  return iloscTematow;
}

function ocenaShow() {
  const proponowanaOcena = document.querySelector(".ocena__proponowana")
    .childNodes[1];

  if (iloscTematow() == 0) {
    proponowanaOcena.innerText = "brak ocen";
    return;
  }

  let wyliczonaOcena;
  let ocenaSlownie;
  let tmpArray = new Array();

  for (let i = 0; i < localStorage.length; i++)
    if (!isNaN(localStorage.key(i)))
      tmpArray.push(
        parseInt(JSON.parse(localStorage.getItem(localStorage.key(i))).ocena)
      );

  const sumaOcen = tmpArray.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  wyliczonaOcena = Math.round(sumaOcen / iloscTematow());

  switch (wyliczonaOcena) {
    case 1:
      ocenaSlownie = "niedostateczny";
      break;
    case 2:
      ocenaSlownie = "dopuszczający";
      break;
    case 3:
      ocenaSlownie = "dostateczny";
      break;
    case 4:
      ocenaSlownie = "dobry";
      break;
    case 5:
      ocenaSlownie = "bardzo dobry";
      break;
    case 6:
      ocenaSlownie = "celujący";
      break;
  }

  if (wyliczonaOcena == 1.5) {
    proponowanaOcena.classList.add("wyroznienie--czerwone");
    proponowanaOcena.classList.remove("wyroznienie--zielone");
  } else {
    proponowanaOcena.classList.remove("wyroznienie--czerwone");
    proponowanaOcena.classList.add("wyroznienie--zielone");
  }

  proponowanaOcena.innerText = `(${wyliczonaOcena}) ${ocenaSlownie}`;

  if (
    localStorage.getItem("opinia") != null &&
    JSON.parse(localStorage.getItem("opinia")).ocena != null
  )
    wyliczonaOcena = JSON.parse(localStorage.getItem("opinia")).ocena;

  for (option of ocena.children)
    if (option.value == wyliczonaOcena) {
      option.setAttribute("selected", "selected");
      break;
    }
}
