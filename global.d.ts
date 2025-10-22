// custom.d.ts or similar

declare module "*.css" {
  /**
   * This module declaration tells TypeScript that importing any file
   * ending in '.css' is allowed and should be treated as a module
   * with an unknown content type (any), since we don't care about
   * the exported value (it's a side-effect import).
   */
  const content: never;
  export default content;
}
