const template = document.createElement("template");
export default template;

template.innerHTML = /* html */ `
<div>
  <label>
    <input type="radio" name="rating" value="5">
    <span class="star"></span>
  </label>
  <label>
    <input type="radio" name="rating" value="4">
    <span class="star"></span>
  </label>
  <label>
    <input type="radio" name="rating" value="3">
    <span class="star"></span>
  </label>
  <label>
    <input type="radio" name="rating" value="2">
    <span class="star"></span>
  </label>
  <label>
    <input type="radio" name="rating" value="1">
    <span class="star"></span>
  </label>
</div>
`;
