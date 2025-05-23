/*
 * GeoCreator game and creation platform.
 * Copyright (C) 2025 Isak Johansson Weckstén
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, see
 * <https://www.gnu.org/licenses/>.
 */

/**
 * Configures and runs the cookie consent banner.
 * @module config/cookie-consent
 */

import * as CookieConsent from "vanilla-cookieconsent";

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
