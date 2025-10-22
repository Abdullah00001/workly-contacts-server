import { Request, Response, NextFunction } from 'express';
import { extname, join } from 'path';
import { allowedMimeTypes, MAX_IMPORT_FILE_SIZE } from '@/const';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import logger from '@/configs/logger.configs';
import csvParser from 'csv-parse/sync';
import {
  ContactValidationError,
  CSVContactRow,
} from '@/modules/contacts/contacts.interfaces';
import {
  validateBirthday,
  validatePhone,
  validateRequiredFields,
} from '@/utils/import.utils';

const ContactsMiddlewares = {
  checkImportFile: (req: Request, res: Response, next: NextFunction) => {
    try {
      const uploadedFile = req.file;
      if (!uploadedFile) {
        res
          .status(400)
          .json({ success: false, message: 'File is missing in the request' });
        return;
      }
      const { filename, originalname, mimetype, size } = uploadedFile;
      const filePath = join(__dirname, '../../../public/temp', filename);
      if (!existsSync(filePath)) {
        res.status(400).json({
          success: false,
          message: 'Uploaded file not found on server',
        });
        return;
      }
      if (!allowedMimeTypes.includes(mimetype)) {
        unlinkSync(filePath);
        res.status(400).json({
          success: false,
          message: `Invalid file type: ${mimetype}. Only CSV or vCard allowed.`,
        });
        return;
      }
      if (size > MAX_IMPORT_FILE_SIZE) {
        unlinkSync(filePath);
        res.status(400).json({
          success: false,
          message: `File size exceeds limit of ${MAX_IMPORT_FILE_SIZE / (1024 * 1024)} MB.`,
        });
        return;
      }
      next();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      }
      logger.error('Unknown Error Occurred In Check Import File Middleware');
      next(error);
    }
  },
  checkImportFileContents: (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const uploadedFile = req.file;

      if (!uploadedFile) {
        res.status(400).json({
          success: false,
          message: 'File is missing in the request',
        });
        return;
      }

      const { filename, mimetype, originalname } = uploadedFile;
      const filePath = join(__dirname, '../../../public/temp', filename);

      if (!existsSync(filePath)) {
        res.status(400).json({
          success: false,
          message: 'Uploaded file not found on server',
        });
        return;
      }

      const extension = extname(originalname).toLowerCase();

      // Handle CSV files
      if (['.csv'].includes(extension) || mimetype.includes('csv')) {
        const content = readFileSync(filePath, 'utf8');
        const records: CSVContactRow[] = csvParser.parse(content, {
          columns: true,
          skip_empty_lines: true,
        });

        if (!records.length) {
          unlinkSync(filePath);
          res.status(400).json({
            success: false,
            message: 'CSV file is empty or invalid',
          });
          return;
        }

        // Validate each row
        const errors: ContactValidationError[] = [];

        records.forEach((row: CSVContactRow, index: number) => {
          // Validate required fields
          const requiredError = validateRequiredFields(row);
          if (requiredError) {
            errors.push({
              row: index + 1,
              field: 'name',
              message: requiredError,
            });
          }

          // Validate phone number
          const phoneError = validatePhone({
            phone: row.phone,
            countryCode: row.countryCode,
          });
          if (phoneError) {
            errors.push({
              row: index + 1,
              field: 'phone',
              message: phoneError,
            });
          }

          // Validate birthday
          const birthdayError = validateBirthday({
            birthMonth: row.birthMonth,
            birthDate: row.birthDate,
            birthYear: row.birthYear,
          });
          if (birthdayError) {
            errors.push({
              row: index + 1,
              field: 'birthday',
              message: birthdayError,
            });
          }
        });

        if (errors.length > 0) {
          unlinkSync(filePath);
          res.status(400).json({
            success: false,
            message: `CSV validation failed in ${errors.length} record(s)`,
            errors: errors,
          });
          return;
        }

        next();
      }
      // Handle vCard files
      else if (
        ['.vcf', '.vcard'].includes(extension) ||
        mimetype.includes('vcard') ||
        mimetype.includes('text/directory')
      ) {
        const content = readFileSync(filePath, 'utf8');
        const cards = content
          .split(/END:VCARD/i)
          .filter((c) => c.trim().length > 0);

        if (!cards.length) {
          unlinkSync(filePath);
          res.status(400).json({
            success: false,
            message: 'vCard file is empty or invalid',
          });
          return;
        }

        const errors: ContactValidationError[] = [];

        cards.forEach((card, index) => {
          // Extract fields using regex
          const fnMatch = card.match(/FN:(.+)/i);
          const nMatch = card.match(/N:(.+)/i);
          const telMatch = card.match(/TEL.*:(.+)/i);
          const bdayMatch = card.match(/BDAY:(\d{4})-?(\d{2})?-?(\d{2})?/i);

          const fn = fnMatch ? fnMatch[1].trim() : '';
          const n = nMatch ? nMatch[1].trim() : '';

          // Validate required fields
          if (!fn || !n) {
            errors.push({
              card: index + 1,
              field: 'name',
              message: 'vCard missing FN or N field',
            });
          }

          // Validate phone (vCard TEL field)
          // Note: vCard format typically includes country code in TEL field
          if (telMatch) {
            const tel = telMatch[1].trim();
            // Check if phone number starts with a country code (+ prefix)
            if (tel && !tel.startsWith('+')) {
              errors.push({
                card: index + 1,
                field: 'phone',
                message:
                  'Phone number must include country code (e.g., +1234567890)',
              });
            }
          }

          // Validate birthday (vCard BDAY field)
          if (bdayMatch) {
            const year = bdayMatch[1];
            const month = bdayMatch[2];
            const date = bdayMatch[3];

            const birthdayError = validateBirthday({
              birthMonth: month,
              birthDate: date,
              birthYear: year,
            });

            if (birthdayError) {
              errors.push({
                card: index + 1,
                field: 'birthday',
                message: birthdayError,
              });
            }
          }
        });

        if (errors.length > 0) {
          unlinkSync(filePath);
          res.status(400).json({
            success: false,
            message: `vCard validation failed in ${errors.length} card(s)`,
            errors: errors,
          });
          return;
        }

        next();
      } else {
        unlinkSync(filePath);
        res.status(400).json({
          success: false,
          message: 'Unsupported file type for required field validation',
        });
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error);
        next(error);
      } else {
        logger.error(
          'Unknown Error Occurred In Check Import File Contents Middleware'
        );
        next(error);
      }
    }
  },
};

export default ContactsMiddlewares;
