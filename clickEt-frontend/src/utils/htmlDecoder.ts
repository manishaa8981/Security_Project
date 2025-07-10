export const decodeHTMLEntities = (url: string): string => {
    return url
      .replace(/&#x2F;/g, "/") // Replace &#x2F; with /
      .replace(/&amp;/g, "&"); // Replace &amp; with &
  };