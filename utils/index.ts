import _ from "lodash";
import { createPatch } from "rfc6902";
import cleanDeep from "clean-deep";
import Fuse from "fuse.js";
type optionTextSearchType = {
  keys?: string[];
  threshold?: number;
  distance?: number;
};

function deepEqual(obj1: any, obj2: any) {
  const patch = createPatch(obj1, obj2);
  return patch.length === 0;
}

class TextSearch {
  #options: optionTextSearchType;
  constructor(options: optionTextSearchType) {
    this.#options = cleanDeep(options);
  }
  search(
    ctx: {
      query?: string;
      items?: any[];
      searchOptions?: optionTextSearchType;
    } = {}
  ) {
    if (!ctx?.query || ctx.query == "") return ctx.items;

    let fuse = new Fuse(ctx?.items || [], {
      threshold: 0.3,
      ...this.#options,
      ...ctx?.searchOptions,
    });

    let r = fuse.search(ctx.query);
    let items = r?.map((i) => i?.item);

    return items;
  }
}

export { _, deepEqual, TextSearch };
