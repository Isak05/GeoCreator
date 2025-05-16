/**
 * Exports a template containing a basic bootstrap modal with the options "Yes" and "No".
 * @author Isak Johansson Weckstén <ij222pv@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement("template");
export default template;

template.innerHTML = /* html */ `
<div class="modal fade" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5"></h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
        <button type="button" class="btn btn-primary">Yes</button>
      </div>
    </div>
  </div>
</div>
`;
