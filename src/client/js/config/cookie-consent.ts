import "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js";

document.documentElement.classList.add("cc--darkmode");

// Based off the cookieconsent documentation at https://cookieconsent.orestbida.com/essential/getting-started.html
CookieConsent.run({
  categories: {
    necessary: {
      enabled: true, // this category is enabled by default
      readOnly: true, // this category cannot be disabled
    },
  },

  language: {
    default: "en",
    translations: {
      en: {
        consentModal: {
          title: "This website uses cookies",
          description:
            "We only use strictly necessary cookies to ensure the basic functionality of this website.",
          acceptNecessaryBtn: "Accept",
          showPreferencesBtn: "Cookie preferences",
        },
        preferencesModal: {
          title: "Manage cookie preferences",
          acceptAllBtn: "Accept",
          savePreferencesBtn: "Accept current selection",
          closeIconLabel: "Close modal",
          sections: [
            {
              title: "Strictly necessary cookies",
              description:
                "These cookies are essential for the proper functioning of the website and cannot be disabled.",

              // this field will generate a toggle linked to the 'necessary' category
              linkedCategory: "necessary",
            },
          ],
        },
      },
    },
  },
});
