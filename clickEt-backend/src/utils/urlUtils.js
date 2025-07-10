import he from "he";
export const decodeHtmlEntities = (url) => {
  return he.decode(url); 
};
