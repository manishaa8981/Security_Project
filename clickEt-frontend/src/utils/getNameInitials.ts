export function getNameInitials(full_name: string): string {
    const separated_names = full_name.split(" ").map((name) => name.slice(0, 1)).join("");
    return separated_names;
  }