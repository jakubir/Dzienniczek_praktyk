(function () {
  const metryczkaME = document.querySelector('.menu__element--metryczka');
  const dziennikME = document.querySelector('.menu__element--dziennik');
  const podsumowanieME = document.querySelector('.menu__element--podsumowanie');

  metryczkaShow();
  metryczkaME.addEventListener('click', () => {
    metryczka.classList.remove('hidden');
    metryczkaShow();
    dziennik.classList.add('hidden');
    podsumowanie.classList.add('hidden');

    sessionStorage.setItem('strona', 'metryczka');
  });
  
  dziennikME.addEventListener('click', () => {
    document.querySelectorAll('.nowy').forEach((nowy) => {
      nowy.classList.remove('nowy');
    })

    metryczka.classList.add('hidden');
    dziennik.classList.remove('hidden');
    podsumowanie.classList.add('hidden');

    sessionStorage.setItem('strona', 'dziennik');
  });
  
  podsumowanieME.addEventListener('click', () => {
    metryczka.classList.add('hidden');
    dziennik.classList.add('hidden');
    podsumowanie.classList.remove('hidden');
    godzinyShow();
    ocenaShow();
    
    sessionStorage.setItem('strona', 'podsumowanie');
  });
})();
