const highscoreTableRowTemplate = document.createElement("template");
highscoreTableRowTemplate.innerHTML = /* html */ `
<tr>
  <td class="rank"></td>
  <td class="name"></td>
  <td class="score"></td>
  <td class="time"></td>
</tr>
`;

export default highscoreTableRowTemplate;
