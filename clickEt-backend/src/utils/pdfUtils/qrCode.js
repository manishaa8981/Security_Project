// generateQrCode.js
import QRCode from 'qrcode';

export const generateQrCode = async (data, outputPath) => {
  try {
    // Generate QR code
    QRCode.toFile(outputPath, JSON.stringify(data), {
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      width: 200,
      height: 200,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export default generateQrCode;