export function validateNRIC(params: any[]): boolean {
  if (!params || !params[0] || typeof params[0] !== "string") return false;
  const nric = params[0].toUpperCase();
  if (nric.length !== 9 || !/^[STFGM]\d{7}[A-Z]$/.test(nric)) return false;

  const weights = [2, 7, 6, 5, 4, 3, 2];
  const checksumLetters: Record<string, string> = {
    S: "JZIHGFEDCBA",
    T: "GFEDCBAZHIJ",
    F: "XWUTRQPNMLK",
    G: "XWUTRQPNMLK",
    M: "XWUTRQPNMLK",
  };

  const firstChar = nric.charAt(0) as keyof typeof checksumLetters;
  const lastChar = nric.charAt(8);
  const digits = nric.slice(1, 8);

  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += parseInt(digits[i]) * weights[i];
  }

  if (firstChar === "T" || firstChar === "G") sum += 4;
  const checksum = checksumLetters[firstChar][sum % 11];

  return checksum === lastChar;
}