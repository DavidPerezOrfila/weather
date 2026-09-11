// Paleta Catppuccin Mocha en truecolor ANSI
const rgb = (r: number, g: number, b: number): string => `\x1b[38;2;${r};${g};${b}m`;

export const BLUE = rgb(137, 180, 250);
export const SAPPHIRE = rgb(116, 199, 236);
export const TEAL = rgb(148, 226, 213);
export const GREEN = rgb(166, 227, 161);
export const RED = rgb(243, 139, 168);
export const PEACH = rgb(250, 179, 135);
export const YELLOW = rgb(249, 226, 175);
export const GRAY = rgb(147, 153, 178);
export const TEXT = rgb(205, 214, 244);
export const BOLD = "\x1b[1m";
export const RESET = "\x1b[0m";

export function paint(text: string, color: string): string {
  return `${color}${text}${RESET}`;
}
