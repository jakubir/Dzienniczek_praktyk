(function () {
  const form = document.querySelector('.metryczka .form');
  const dane = document.querySelectorAll('.metryczka .input');
  const edit = document.querySelector('.dane__button');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    localStorage.setItem(
      'dane',
      JSON.stringify({
        imie: dane[0].value,
        nazwisko: dane[1].value,
        klasa: dane[2].value,
        rokSzkolny: dane[3].value,
        firma: dane[4].value,
        poczatek: dane[5].value,
        koniec: dane[6].value
      })
    );
    alert('Pomyślnie zapisano dane');
    form.reset();
    metryczkaShow();
  });

  edit.addEventListener('click', () => {
    const daneLS = JSON.parse(localStorage.getItem('dane'));

    document.querySelector('.metryczka__dane').classList.add('hidden');
    form.classList.remove('hidden');

    dane[0].value = daneLS.imie;
    dane[1].value = daneLS.nazwisko;
    dane[2].value = daneLS.klasa;
    dane[3].value = daneLS.rokSzkolny;
    dane[4].value = daneLS.firma;
    dane[5].value = daneLS.poczatek;
    dane[6].value = daneLS.koniec;
  });

})();
