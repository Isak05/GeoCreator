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

import MyAlert from "./components/my-alert/my-alert.js";
import getView from "./utils/getView.js";

// Only run this script if the user is in the edit view.
if (getView() === "edit") {
  const editForm: HTMLFormElement = document.querySelector("#edit-form");

  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(editForm);
    const response = await fetch(editForm.action, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const alert = new MyAlert(
        "danger",
        "An error occurred. Please try again.",
      );
      document.querySelector("#flash-div").appendChild(alert);
    } else {
      const alert = new MyAlert("success", "Game updated successfully.");
      document.querySelector("#flash-div").appendChild(alert);
    }
  });
}
