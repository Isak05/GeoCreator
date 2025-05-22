/**
 * Retrieves the value of the "content" attribute from a meta element
 * with the itemprop attribute set to "view".
 * @returns The value of the "content" attribute if the meta element exists, or `null` if not found.
 */
export default function getView(): string | null {
  return document
    .querySelector("meta[itemprop='view']")
    ?.getAttribute("content");
}
