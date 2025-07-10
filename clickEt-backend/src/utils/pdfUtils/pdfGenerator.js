// generatePdf.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import fsPromises from 'fs/promises';
import Handlebars from 'handlebars';
import generateQrCode from './qrCode.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generatePdf = async (bookingData, outputPath) => {
  try {
    // Generate QR code
    const qrCodePath = path.join(__dirname, 'qr-code.png');
    await generateQrCode(bookingData, qrCodePath);

    // Correct path to the Handlebars template
    const templatePath = path.join(__dirname, 'bookingTemplate.handlebars');
    const templateSource = await fsPromises.readFile(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);

    // Render the template with booking data
    const html = template(bookingData);

    // Create a PDF document
    const doc = new PDFDocument();

    // Pipe the PDF document to a file
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Add HTML content to the PDF
    doc.text(html, 50, 50);

    // Add QR code image to the PDF
    doc.image(qrCodePath, 50, 500, { width: 200 });

    // Finalize the PDF document
    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        resolve(outputPath);
      });
      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export default generatePdf;