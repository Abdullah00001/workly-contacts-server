import { Request, Response, NextFunction } from 'express';
import { extname, join } from 'path';
import { allowedMimeTypes, MAX_IMPORT_FILE_SIZE } from '@/const';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import logger from '@/configs/logger.configs';
import csvParser from 'csv-parse/sync';

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
  ) => {
    try {
      const uploadedFile = req.file;
      if (!uploadedFile) {
        res
          .status(400)
          .json({ success: false, message: 'File is missing in the request' });
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

      // 🧠 Handle CSV or vCard
      if (['.csv'].includes(extension) || mimetype.includes('csv')) {
        // ✅ CSV Validation
        const content = readFileSync(filePath, 'utf8');
        const records = csvParser.parse(content, {
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

        // Check for required fields in CSV
        const invalidRows = records.filter(
          (row: any) => !row.firstName?.trim() || !row.lastName?.trim()
        );

        if (invalidRows.length > 0) {
          unlinkSync(filePath);
          res.status(400).json({
            success: false,
            message: `CSV missing required fields (firstName, lastName) in ${invalidRows.length} record(s)`,
          });
          return;
        }
        next();
      } else if (
        ['.vcf', '.vcard'].includes(extension) ||
        mimetype.includes('vcard') ||
        mimetype.includes('text/directory')
      ) {
        // ✅ vCard Validation
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

        const invalidCards = cards.filter((card) => {
          const fnMatch = card.match(/FN:(.+)/i);
          const nMatch = card.match(/N:(.+)/i);
          const fn = fnMatch ? fnMatch[1].trim() : '';
          const n = nMatch ? nMatch[1].trim() : '';
          return !fn || !n;
        });

        if (invalidCards.length > 0) {
          unlinkSync(filePath);
          res.status(400).json({
            success: false,
            message: `vCard missing FN or N field in ${invalidCards.length} card(s)`,
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
      }
      logger.error('Unknown Error Occurred In Check Import File Middleware');
      next(error);
    }
  },
};

export default ContactsMiddlewares;
