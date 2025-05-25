export function validateNRIC(params: any[]): boolean {
  if (!params || !params[0] || typeof params[0] !== 'string') return false;
  const nricInput = params[0].toUpperCase();
  if (!nricInput) return true;
  if (nricInput.length === 1) return false;
  if (nricInput.includes(' ')) return false;

  const chars = nricInput.split('');
  const first = chars.shift();
  const last = chars.pop();

  // Ensure first and last are defined
  if (!first || !last) return false;

  // Multiply each digit in the remaining characters
  const multipliedDigits = [
    Number(chars[0]) * 2,
    Number(chars[1]) * 7,
    Number(chars[2]) * 6,
    Number(chars[3]) * 5,
    Number(chars[4]) * 4,
    Number(chars[5]) * 3,
    Number(chars[6]) * 2,
  ];

  // Sum up the multiplied digits
  const sum = multipliedDigits.reduce((a, v) => a + v, 0);

  // Calculate offset and checksum index
  const offset = first === 'T' || first === 'G' ? 4 : first === 'M' ? 3 : 0;
  let index = (offset + sum) % 11;
  if (first === 'M') index = 10 - index;

  let checksum;
  const st = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
  const fg = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
  const m = ['K', 'L', 'J', 'N', 'P', 'Q', 'R', 'T', 'U', 'W', 'X'];

  switch (first) {
    case 'S':
    case 'T':
      checksum = st[index];
      break;
    case 'F':
    case 'G':
      checksum = fg[index];
      break;
    case 'M':
      checksum = m[index];
      break;
    default:
      // This should never happen, log variables
      console.error('Invalid checksum');
  }
  return last === checksum;
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
