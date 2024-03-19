// Vendoring the types here because support for node16 module resolution was not added until
// a later major version which also removed support for older node versions.

declare module "@rollup/pluginutils" {
  /**
   * Constructs a filter function which can be used to determine whether or not
   * certain modules should be operated upon.
   * @param include If `include` is omitted or has zero length, filter will return `true` by default.
   * @param exclude ID must not match any of the `exclude` patterns.
   * @param options Optionally resolves the patterns against a directory other than `process.cwd()`.
   * If a `string` is specified, then the value will be used as the base directory.
   * Relative paths will be resolved against `process.cwd()` first.
   * If `false`, then the patterns will not be resolved against any directory.
   * This can be useful if you want to create a filter for virtual module names.
   */
  export function createFilter(
    include?: FilterPattern,
    exclude?: FilterPattern,
    options?: { resolve?: string | false | null }
  ): (id: string | unknown) => boolean;

  /**
   * A valid `picomatch` glob pattern, or array of patterns.
   */
  export type FilterPattern =
    | ReadonlyArray<string | RegExp>
    | string
    | RegExp
    | null;
}
