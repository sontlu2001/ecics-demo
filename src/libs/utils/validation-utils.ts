export function validateNRIC(params: any[]): boolean {
  if (!params || !params[0] || typeof params[0] !== 'string') return false;
  const nric = params[0].toUpperCase();
  if (nric.length !== 9 || !/^[STFGM]\d{7}[A-Z]$/.test(nric)) return false;

  const weights = [2, 7, 6, 5, 4, 3, 2];
  const checksumLetters: Record<string, string> = {
    S: 'JZIHGFEDCBA',
    T: 'GFEDCBAZHIJ',
    F: 'XWUTRQPNMLK',
    G: 'XWUTRQPNMLK',
    M: 'XWUTRQPNMLK',
  };

  const firstChar = nric.charAt(0) as keyof typeof checksumLetters;
  const lastChar = nric.charAt(8);
  const digits = nric.slice(1, 8);

  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += parseInt(digits[i]) * weights[i];
  }

  if (firstChar === 'T' || firstChar === 'G') sum += 4;
  const checksum = checksumLetters[firstChar][sum % 11];

  return checksum === lastChar;
}

export function sgCarRegNoValidator(carRegNoInput: string | null): boolean {
  if (!carRegNoInput) return true;
  if (carRegNoInput.includes(' ')) return false;

  const weightArr: number[] = [10, 15, 14, 15, 16, 17];
  const cpLetter: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'P',
    'R',
    'S',
    'T',
    'U',
    'X',
    'Y',
    'Z',
  ];
  const carPlateRegex: any = /^([a-zA-Z]{2,3})(\d{1,4})([a-zA-Z])$/;

  const carRegNo = carRegNoInput.toUpperCase();

  if (carRegNo.length < 2 || carRegNo.length > 9) {
    return false;
  }

  const cpArr = carRegNo.match(carPlateRegex);
  if (!cpArr) {
    return false;
  }

  let cpAlphabet: string = cpArr[1];
  const cpNumber: string = cpArr[2].padStart(4, '0');
  const cpChkSum: string = cpArr[3];

  if (cpAlphabet.length === 3) {
    cpAlphabet = cpAlphabet.substring(1);
  }

  let sumApbWeight =
    (cpAlphabet.charCodeAt(0) - 64) * weightArr[0] +
    (cpAlphabet.charCodeAt(1) - 64) * weightArr[1];

  for (let i = 0; i < cpNumber.length; i++) {
    sumApbWeight += parseInt(cpNumber[i], 10) * weightArr[i + 2];
  }

  const letterIndex = sumApbWeight % 19;

  return cpLetter[letterIndex] === cpChkSum;
}
