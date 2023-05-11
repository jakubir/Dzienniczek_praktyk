(function () {
  const dzialSelect = document.querySelector('#dzial-select');
  const tematSelect = document.querySelector('#temat-select');
  const form = document.querySelector('.dziennik .form');
  const dane = document.querySelectorAll('.dziennik .input');
  const sekcje = document.querySelectorAll('.zrealizowane .sekcja--tematy');
  const realizacja = document.querySelectorAll('.do-zrealizowania .sekcja');

  // wyświetlenie sekcji Pozostało do zrealizowania
  function pozostaloDoZrealizowania() {
    // wyświetlenie tytułu z informacją o ilości godzin do odrobienia
    document.querySelector('.do-zrealizowania .tytul').innerHTML =
      'Pozostało do zrealizowania: ';
    let span = document.createElement('span');
    if (hoursToBeCompleted - lacznaIloscGodzin <= 0) {
      span.classList.add('wyroznienie--zielone');
      span.appendChild(
        new Text(`0 godz.`)
      );
    } else {
      span.classList.add('wyroznienie--czerwone');
      span.appendChild(
        new Text(`${hoursToBeCompleted - lacznaIloscGodzin} godz.`)
      );
    }
    document.querySelector('.do-zrealizowania .tytul').appendChild(span);

    let i = 0;
    for (const dzial of dzialy) {
      realizacja[i].innerHTML = `
        <legend align='center' class='sekcja__tytul sekcja__tytul--tematy'>${dzial[0]}</legend>
        <ul class='tematy__list'></ul>
      `;
      for (const temat of dzial[1]) {
        let element = document.createElement('li');
        element.classList.add('list__element');

        let span = document.createElement('span');
        span.appendChild(new Text(temat[0] + ' '));
        if (czyZrealizowano(temat[0]))
          span.classList.add('wyroznienie--przekreslenie');
        element.appendChild(span);

        span = document.createElement('span');
        span.appendChild(new Text(temat[1] + ' godz.'));
        if (temat[1] > 0) span.classList.add('wyroznienie--zielone');
        else span.classList.add('wyroznienie--czerwone');
        span.classList.add('wyroznienie--pogrubienie');
        element.appendChild(span);

        realizacja[i].children[1].appendChild(element);
      }
      i++;
    }
  }
  pozostaloDoZrealizowania();

  // uaktualnienie sekcji Pozostało do zrealizowania
  function showRealizacja(temat) {
    // dopisanie nowego tematu do listy
    lacznaIloscGodzin += parseFloat(temat.iloscGodzin);
    dzialy.set(
      temat.dzial,
      new Map([
        ...dzialy.get(temat.dzial),
        [
          temat.temat,
          parseFloat(temat.iloscGodzin) +
            dzialy.get(temat.dzial).get(temat.temat),
        ],
      ])
    );

    pozostaloDoZrealizowania();
  }

  function newId() {
    let maxId = 0;
    for (let i = 0; i < localStorage.length; i++)
      if (localStorage.key(i) != 'dane' && localStorage.key(i) != 'opinia')
        if (parseInt(localStorage.key(i)) > maxId)
          maxId = parseInt(localStorage.key(i))
    
    return maxId + 1;
  }

  function showTemat(temat, nowy = false) {
    let dzial;
    let element;

    switch (temat.dzial) {
      case 'Moduł wstępny':
        dzial = sekcje[1];
        break;
      case 'Montaż, naprawa, konserwacja i obsługa sprzętu komputerowego':
        dzial = sekcje[2];
        break;
      case 'Systemy informatyczne':
        dzial = sekcje[3];
        break;
      case 'Tworzenie aplikacji internetowych':
        dzial = sekcje[4];
        break;
    }

    // wyświetlenie tematu i jego sekcji
    sekcje[0].classList.add('hidden');
    dzial.classList.remove('hidden');
    element = document.createElement('div');
    element.id = temat.id;
    element.classList.add(
      'form__label',
      'form__label--large',
      'form__label--gap'
    );
    if (nowy) element.classList.add('nowy');
    element.setAttribute('title', 'Kliknij dwukrotnie, aby usunąć');
    element.innerHTML = `
      <span class='input__text wyroznienie--odstep'>
        Temat:
        <span class='wyroznienie--podkreslenie'>${temat.temat}</span>
      </span>
      <span>
        Data:
        <span class='wyroznienie--zielone'>${temat.data}</span>
      </span>
      <span>
        Ilość godzin:
        <span class='wyroznienie--zielone'>${temat.iloscGodzin} godz.</span>
      </span>
      <span>
        Sprawozdanie:<br>
        <i class='wyroznienie--zielone'>${temat.sprawozdanie}</i>
      </span>
      <span>
        Opiekun:
        <span class='wyroznienie--zielone'>${temat.opiekun}</span>
      </span>
      <span>
        Ocena:
        <span class='wyroznienie--zielone'>${temat.ocena}</span>
      </span>
    `;
    // możliwość usunięcia dodanych zajęć
    element.addEventListener('dblclick', () => {
      if (confirm(`Czy na pewno chcesz usunąć zajęcia na temat: ${temat.temat}?`))
        for (let i = 0; i < localStorage.length; i++) {
          let tmp = JSON.parse(localStorage.getItem(localStorage.key(i)));
          if (tmp.id != undefined && tmp.id == temat.id) {
            // usuwanie realizacji tematu
            if (temat.realizacja == true) {
              pozostaloDoZrealizowania();
              if (dzialSelect.value != '')
              wybierzTemat();
            }

            let element = document.querySelector(`#${tmp.id}`);
            element.classList.add('usuwanie');
            let parent = element.parentElement;
            setTimeout(() => {
              element.remove();
              if (parent.childNodes.length == 3)
                parent.classList.add('hidden');
              if (iloscTematow == 0)
                sekcje[0].classList.remove('hidden');
            }, 1000);
            localStorage.removeItem(tmp.id.substring(1));
            tmp.iloscGodzin *= -1;
            showRealizacja(tmp);
            break;
          }
        }
    });
    dzial.appendChild(element);
  }

  // przygotowanie pola Data zajęć
  if (localStorage.getItem('dane') != null) {
    dane[0].setAttribute(
      'min',
      JSON.parse(localStorage.getItem('dane')).poczatek
    );
    dane[0].setAttribute(
      'max',
      JSON.parse(localStorage.getItem('dane')).koniec
    );
  }

  // przygotowanie pola Wybierz dział
  teachingProgram.forEach((dzial) => {
    let option = document.createElement('option');
    option.value = dzial.name;
    option.innerText = dzial.name;
    dzialSelect.appendChild(option);
  });

  // przygotowanie pola Wybierz temat
  function wybierzTemat() {
      let dzial;
  
      switch (dzialSelect.value) {
        case 'Moduł wstępny':
          dzial = teachingProgram[0];
          break;
        case 'Montaż, naprawa, konserwacja i obsługa sprzętu komputerowego':
          dzial = teachingProgram[1];
          break;
        case 'Systemy informatyczne':
          dzial = teachingProgram[2];
          break;
        case 'Tworzenie aplikacji internetowych':
          dzial = teachingProgram[3];
          break;
      }
  
      tematSelect.innerHTML = '<option selected disabled></option>';
      dzial.topic.forEach((temat) => {
        let option = document.createElement('option');
        if (czyZrealizowano(temat)) option.setAttribute('disabled', 'disabled');
        option.value = temat;
        option.innerText = temat;
        tematSelect.appendChild(option);
      });
  }
  dzialSelect.addEventListener('change', wybierzTemat);

  // wyświetlenie zapisanych zajęć
  for (i = 0; i < localStorage.length; i++)
    if (localStorage.key(i) != 'dane' && localStorage.key(i) != 'opinia')
      showTemat(JSON.parse(localStorage.getItem(localStorage.key(i))));

  //zapisanie nowych zajęć
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const tmp = {
      data: dane[0].value,
      dzial: dane[1].value,
      temat: dane[2].value,
      opiekun:
        dane[3].checked == true
          ? dane[3].value
          : dane[4].checked == true
          ? dane[4].value
          : dane[5].value,
      iloscGodzin: dane[6].value,
      sprawozdanie: dane[7].value,
      ocena: dane[8].value,
      realizacja: dane[9].checked,
      id: 'i' + newId()
    };
    localStorage.setItem(newId(), JSON.stringify(tmp));
    alert('Pomyślnie zapisano zajęcia');
    form.reset();
    showTemat(tmp, true);
    showRealizacja(tmp);
    tematSelect.innerHTML = '<option selected disabled></option>';
  });
})();
