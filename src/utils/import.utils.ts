import { BMonth } from '@/modules/contacts/contacts.enums';
import {
  BirthdayValidation,
  CSVContactRow,
  PhoneValidation,
  TContactPayload,
  TCsvFormat,
} from '@/modules/contacts/contacts.interfaces';
import { parse } from 'csv-parse/sync';
import { Types } from 'mongoose';
import path from 'path';

/**
 * Get file extension from filename (without dot, lowercase)
 * @param fileName - The name of the file
 * @returns The file extension in lowercase without dot
 * @example
 * getFileExtension('example.CSV') // returns 'csv'
 * getFileExtension('archive.tar.gz') // returns 'gz'
 * getFileExtension('no-extension') // returns ''
 */
export const getFileExtension = (fileName: string): string => {
  return path.extname(fileName).slice(1).toLowerCase();
};

export const ExtractContactsFromCsv = ({
  fileContent,
  userId,
}: {
  userId: Types.ObjectId;
  fileContent: string;
}) => {
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as TCsvFormat[];
  const monthArray = Object.values(BMonth);
  const extractedContacts: TContactPayload[] = records.map(
    ({
      addressCity,
      addressCountry,
      addressPostCode,
      addressStreet,
      birthdayDate,
      birthdayMonth,
      birthdayYear,
      email,
      firstName,
      lastName,
      organizationName,
      organizationPosition,
      phoneCountryCode,
      phoneNumber,
    }: TCsvFormat) =>
      ({
        firstName,
        lastName,
        email: email || null,
        phone: {
          countryCode: phoneCountryCode || null,
          number: phoneNumber || null,
        },
        birthday: {
          day: birthdayDate || null,
          month: monthArray[Number(birthdayMonth) - 1] || null,
          year: birthdayYear || null,
        },
        location: {
          city: addressCity || null,
          country: addressCountry || null,
          postCode: addressPostCode || null,
          streetAddress: addressStreet || null,
        },
        worksAt: {
          companyName: organizationName || null,
          jobTitle: organizationPosition || null,
        },
        userId,
      }) as TContactPayload
  );
  return extractedContacts;
};

/**
 * Parsed vCard field data
 */
interface ParsedVCardFields {
  firstName: string;
  lastName: string;
  email: string | null;
  tel: string;
  bday: string;
  adr: string;
  org: string | null;
  title: string | null;
}

/**
 * Safely extracts value after colon from vCard line
 */
const extractVCardValue = (line: string): string => {
  const colonIndex = line.indexOf(':');
  return colonIndex !== -1 ? line.substring(colonIndex + 1).trim() : '';
};

/**
 * Validates if a string is a valid email
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Parses phone number into country code and number
 */
const parsePhoneNumber = (
  tel: string
): { countryCode: string | null; number: string | null } => {
  if (!tel) return { countryCode: null, number: null };

  let phoneMatch = tel.match(/^(\+\d{1,3})(\d+)$/);
  if (phoneMatch) {
    return {
      countryCode: phoneMatch[1],
      number: tel,
    };
  }

  phoneMatch = tel.match(/^(\+\d{1,3}-\d{1,3})(\d+)$/);

  if (phoneMatch) {
    return {
      countryCode: phoneMatch[1],
      number: tel,
    };
  }

  // If no match, try to extract any digits
  const digitsOnly = tel.replace(/\D/g, '');
  if (digitsOnly.length > 0) {
    // Assume first 1-4 digits after + are country code if it starts with +
    if (tel.startsWith('+')) {
      const countryCode =
        '+' + digitsOnly.substring(0, Math.min(4, digitsOnly.length));
      const number = digitsOnly.substring(Math.min(4, digitsOnly.length));
      return {
        countryCode: number ? countryCode : null,
        number: number || null,
      };
    }
    return { countryCode: null, number: digitsOnly };
  }

  return { countryCode: null, number: null };
};

/**
 * Parses birthday string into day, month, year
 */
const parseBirthday = (
  bday: string,
  monthNames: string[]
): { day: number | null; month: string | null; year: number | null } => {
  if (!bday) return { day: null, month: null, year: null };

  const [year, monthNum, day] = bday.split('-');

  const parsedYear = year ? parseInt(year, 10) : null;
  const parsedDay = day ? parseInt(day, 10) : null;
  const parsedMonth = monthNum ? monthNames[parseInt(monthNum, 10) - 1] : null;

  // Validate parsed values
  const isValidYear =
    parsedYear && parsedYear > 1900 && parsedYear <= new Date().getFullYear();
  const isValidDay = parsedDay && parsedDay >= 1 && parsedDay <= 31;
  const isValidMonth = parsedMonth && monthNames.includes(parsedMonth);

  return {
    day: isValidDay ? parsedDay : null,
    month: isValidMonth ? parsedMonth : null,
    year: isValidYear ? parsedYear : null,
  };
};

/**
 * Parses address string into components
 */
const parseAddress = (
  adr: string
): {
  streetAddress: string | null;
  city: string | null;
  postCode: number | null;
  country: string | null;
} => {
  if (!adr) {
    return { streetAddress: null, city: null, postCode: null, country: null };
  }

  const adrParts = adr.split(';');

  // vCard ADR format: PO Box;Extended Address;Street;City;Region;Postal Code;Country
  const streetAddress = adrParts[2]?.trim() || null;
  const city = adrParts[3]?.trim() || null;
  const postCodeStr = adrParts[5]?.trim();
  const country = adrParts[6]?.trim() || null;

  // Parse postal code - handle both numeric and alphanumeric
  let postCode: number | null = null;
  if (postCodeStr) {
    const numericPostCode = parseInt(postCodeStr.replace(/\D/g, ''), 10);
    postCode = !isNaN(numericPostCode) ? numericPostCode : null;
  }

  return { streetAddress, city, postCode, country };
};

/**
 * Parses a single vCard string into structured fields
 */
const parseVCardString = (vCardString: string): ParsedVCardFields | null => {
  try {
    const lines = vCardString
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let firstName = '';
    let lastName = '';
    let email: string | null = null;
    let tel = '';
    let bday = '';
    let adr = '';
    let org: string | null = null;
    let title: string | null = null;

    for (const line of lines) {
      const upperLine = line.toUpperCase();

      if (upperLine.startsWith('N:')) {
        const nValue = extractVCardValue(line);
        const [last = '', first = ''] = nValue.split(';');
        lastName = last.trim();
        firstName = first.trim();
      } else if (upperLine.startsWith('EMAIL')) {
        const emailValue = extractVCardValue(line);
        email = emailValue && isValidEmail(emailValue) ? emailValue : null;
      } else if (upperLine.startsWith('TEL')) {
        const telValue = extractVCardValue(line);
        tel = telValue;
      } else if (upperLine.startsWith('BDAY:')) {
        bday = extractVCardValue(line);
      } else if (upperLine.startsWith('ADR')) {
        adr = extractVCardValue(line);
      } else if (upperLine.startsWith('ORG:')) {
        const orgValue = extractVCardValue(line);
        org = orgValue || null;
      } else if (upperLine.startsWith('TITLE:')) {
        const titleValue = extractVCardValue(line);
        title = titleValue || null;
      }
    }

    // Validate required fields
    if (!firstName && !lastName) {
      console.warn('vCard missing both first and last name, skipping');
      return null;
    }

    return { firstName, lastName, email, tel, bday, adr, org, title };
  } catch (error) {
    console.error('Error parsing vCard string:', error);
    return null;
  }
};

/**
 * Extracts contacts from vCard file content
 */
export const ExportContactFromVCard = ({
  fileContent,
  userId,
}: {
  userId: Types.ObjectId;
  fileContent: string;
}): TContactPayload[] => {
  const monthNames = Object.values(BMonth);
  const extractedContacts: TContactPayload[] = [];

  if (!fileContent || fileContent.trim().length === 0) {
    console.warn('Empty vCard file content');
    return extractedContacts;
  }

  // Match all vCard blocks using regex
  const vCardRegex = /BEGIN:VCARD[\s\S]*?END:VCARD/gi;
  const vCardMatches = fileContent.match(vCardRegex);

  if (!vCardMatches || vCardMatches.length === 0) {
    console.warn('No vCards found in content');
    return extractedContacts;
  }

  console.log(`Found ${vCardMatches.length} vCard(s)`);

  for (let i = 0; i < vCardMatches.length; i++) {
    const vCardString = vCardMatches[i];

    try {
      const parsedFields = parseVCardString(vCardString);

      if (!parsedFields) {
        console.warn(`Skipping invalid vCard at index ${i}`);
        continue;
      }

      const { firstName, lastName, email, tel, bday, adr, org, title } =
        parsedFields;
      console.log(tel);
      // Parse phone number
      const { countryCode, number } = parsePhoneNumber(tel);

      // Parse birthday
      const { day, month, year } = parseBirthday(bday, monthNames);

      // Parse address
      const { streetAddress, city, postCode, country } = parseAddress(adr);

      const contact: TContactPayload = {
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || null,
        phone: {
          countryCode: countryCode || null,
          number: number || null,
        },
        birthday: {
          day: day || null,
          month: month || null,
          year: year || null,
        },
        location: {
          city: city || null,
          country: country || null,
          postCode: postCode || null,
          streetAddress: streetAddress || null,
        },
        worksAt: {
          companyName: org || null,
          jobTitle: title || null,
        },
        userId,
      };

      extractedContacts.push(contact);
    } catch (error) {
      console.error(`✗ Error parsing vCard at index ${i}:`, error);
      continue;
    }
  }

  console.log(
    `Total extracted: ${extractedContacts.length}/${vCardMatches.length}`
  );
  return extractedContacts;
};

// Validation helper functions
export const validatePhone = (data: PhoneValidation): string | null => {
  const { phone, countryCode } = data;

  // If phone exists, country code must exist
  if (phone && phone.trim() && (!countryCode || !countryCode.trim())) {
    return 'Country code is required when phone number is provided';
  }

  return null;
};

export const validateBirthday = (data: BirthdayValidation): string | null => {
  const { birthMonth, birthDate, birthYear } = data;

  // Check if any birthday field is provided
  const hasMonth = birthMonth && birthMonth.trim();
  const hasDate = birthDate && birthDate.trim();
  const hasYear = birthYear && birthYear.trim();

  const providedFields = [hasMonth, hasDate, hasYear].filter(Boolean).length;

  // If any birthday field is provided
  if (providedFields > 0) {
    // Month and date are BOTH required
    if (!hasMonth || !hasDate) {
      return 'Both month and date are required for birthday. Year is optional.';
    }
  }

  return null;
};

export const validateRequiredFields = (data: CSVContactRow): string | null => {
  if (!data.firstName || !data.firstName.trim()) {
    return 'firstName is required';
  }
  if (!data.lastName || !data.lastName.trim()) {
    return 'lastName is required';
  }
  return null;
};
