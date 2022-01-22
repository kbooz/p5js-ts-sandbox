import slugify from "slugify";

const slugifyOptions = { lower: true, remove: /('.|".|\.|\?|#|\(|\)|\/|\\)/g };

export default function slugifier(text?: string) {
  return slugify(text, slugifyOptions);
}
