(function () {
  const opinia = document.querySelector(".textarea");

  godzinyShow();
  ocenaShow();

  if (
    localStorage.getItem("opinia") != null &&
    JSON.parse(localStorage.getItem("opinia")).opinia != "" &&
    JSON.parse(localStorage.getItem("opinia")).opinia != null
  ) {
    opinia.value = JSON.parse(localStorage.getItem("opinia")).opinia;
    opinia.classList.add("textarea--used");
  }

  opinia.addEventListener("change", () => {
    if (opinia.value != "") opinia.classList.add("textarea--used");
    else opinia.classList.remove("textarea--used");
    if (localStorage.getItem("opinia") != null)
      localStorage.setItem(
        "opinia",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("opinia")),
          opinia: opinia.value,
        })
      );
    else
      localStorage.setItem(
        "opinia",
        JSON.stringify({
          opinia: opinia.value,
          ocena: null,
        })
      );
  });

  ocena.addEventListener("click", () => {
    ocena.addEventListener("click", () => {
      if (localStorage.getItem("opinia") != null)
        localStorage.setItem(
          "opinia",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("opinia")),
            ocena: ocena.value,
          })
        );
      else
        localStorage.setItem(
          "opinia",
          JSON.stringify({
            opinia: null,
            ocena: ocena.value,
          })
        );
    });
  });
})();
