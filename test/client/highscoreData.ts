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
 * A mock of the highscore data for testing purposes.
 * Contains three highscore entries with usernames, scores, and times.
 * @module test/client/highscoreData
 */

const highscoreData = Object.freeze([
  {
    _id: "68233416bc367bdf2054a9bd",
    user: {
      username: "123",
      createdAt: "2025-05-13T11:57:27.661Z",
      updatedAt: "2025-05-13T11:57:27.661Z",
      id: "682333a7c726e0602eab7223",
    },
    score: 185,
    time: 3.143,
  },
  {
    _id: "68233432bc367bdf2054aa10",
    user: {
      username: "admin",
      createdAt: "2025-05-08T10:00:20.836Z",
      updatedAt: "2025-05-08T10:00:20.836Z",
      id: "681c80b4e4f380af64f77116",
    },
    score: 3000,
    time: 10.098,
  },
  {
    user: {
      username: "testing",
      createdAt: "2025-05-20T15:49:33.552Z",
      updatedAt: "2025-05-20T15:49:33.552Z",
      id: "682ca48dbe460f83ac1164ca",
    },
    score: 57,
    time: 2.64,
    _id: "682cbbca1323815860f6c5eb",
  },
]);

export default highscoreData;
