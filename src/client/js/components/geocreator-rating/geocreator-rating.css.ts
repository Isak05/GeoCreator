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

const template = document.createElement("template");
export default template;

const baseDirectory = new URL(
  "./js/components/geocreator-rating/",
  document.baseURI,
).href;
const emptyStar = new URL("./img/empty-star.svg", baseDirectory).href;
const filledStar = new URL("./img/filled-star.svg", baseDirectory).href;
const translucentStar = new URL("./img/translucent-star.svg", baseDirectory)
  .href;

template.innerHTML = /* html */ `
<style>
  input {
    display: none;
  }

  div {
    display: inline-flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

  /* Fix whitespaces between the stars */
  label {
    font-size: 0;
  }

  .star {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background-image: url("${emptyStar}");
    background-size: contain;
  }

  label:hover .star,
  label:hover ~ label .star {
    background-image: url("${translucentStar}");
    cursor: pointer;
  }

  input:checked + .star,
  label:has(input:checked) ~ label .star {
    background-image: url("${filledStar}") !important;
  }
</style>
`;
