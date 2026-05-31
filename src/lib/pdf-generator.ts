import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

interface PDFGeneratorParams {
  id: string;
  projectName: string;
  clientName: string;
  description: string;
  driveLink: string;
  status: string;
  createdAt: Date;
  approvedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  host: string; // Digunakan untuk membuat URL QR Code lengkap
}

export async function generateBASTPdf(params: PDFGeneratorParams): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  
  // Ukuran A4 (595.276 x 841.890 points)
  const width = 595.28;
  const height = 841.89;
  const page = pdfDoc.addPage([width, height]);
  
  // Font standar
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Warna Palette (Navy, Slate, Emerald Green, Light Grey)
  const colorNavy = rgb(15/255, 23/255, 42/255);       // #0f172a
  const colorSlate = rgb(100/255, 116/255, 139/255);    // #64748b
  const colorLightSlate = rgb(241/255, 245/255, 249/255); // #f1f5f9
  const colorEmerald = rgb(16/255, 185/255, 129/255);   // #10b981
  const colorRed = rgb(239/255, 68/255, 68/255);        // #ef4444
  const colorBorder = rgb(226/255, 232/255, 240/255);   // #e2e8f0
  
  // 1. Gambar Border Luar (Bingkai Dokumen Resmi)
  const margin = 40;
  page.drawRectangle({
    x: margin,
    y: margin,
    width: width - margin * 2,
    height: height - margin * 2,
    borderColor: colorBorder,
    borderWidth: 1.5,
  });
  
  // 2. Header Bagian Atas
  page.drawRectangle({
    x: margin,
    y: height - margin - 70,
    width: width - margin * 2,
    height: 70,
    color: colorNavy,
  });
  
  page.drawText('TEKEN', {
    x: margin + 20,
    y: height - margin - 40,
    size: 20,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  page.drawText('PLATFORM SERAH TERIMA PROYEK DIGITAL', {
    x: margin + 20,
    y: height - margin - 55,
    size: 8,
    font: helveticaFont,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Status Banner di Header
  const isApproved = params.status === 'APPROVED';
  const statusText = isApproved ? 'APPROVED (SAH)' : 'DRAFT (PENDING)';
  const statusColor = isApproved ? colorEmerald : colorRed;
  const statusTextWidth = helveticaBold.widthOfTextAtSize(statusText, 10);
  
  page.drawRectangle({
    x: width - margin - statusTextWidth - 30,
    y: height - margin - 48,
    width: statusTextWidth + 16,
    height: 22,
    color: statusColor,
  });
  
  page.drawText(statusText, {
    x: width - margin - statusTextWidth - 22,
    y: height - margin - 42,
    size: 10,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  // 3. Judul Dokumen
  let currentY = height - margin - 110;
  page.drawText('BERITA ACARA SERAH TERIMA PEKERJAAN', {
    x: width / 2 - 170,
    y: currentY,
    size: 14,
    font: helveticaBold,
    color: colorNavy,
  });
  
  currentY -= 15;
  const docNumber = `Nomor Dokumen: TKN-${params.id.toUpperCase()}`;
  page.drawText(docNumber, {
    x: width / 2 - helveticaFont.widthOfTextAtSize(docNumber, 9) / 2,
    y: currentY,
    size: 9,
    font: helveticaFont,
    color: colorSlate,
  });
  
  // Garis Pembatas
  currentY -= 20;
  page.drawLine({
    start: { x: margin + 20, y: currentY },
    end: { x: width - margin - 20, y: currentY },
    thickness: 1,
    color: colorBorder,
  });
  
  // 4. Pembukaan BAST
  currentY -= 35;
  const formattedDate = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(params.createdAt);
  const openingText = `Pada hari ini, ${formattedDate}, bertempat di platform digital TEKEN, telah diadakan serah terima pekerjaan digital berupa aset final proyek secara sah sesuai ketentuan hukum yang disepakati oleh para pihak di bawah ini:`;
  
  // Helper untuk wrapping teks paragraf
  const drawParagraph = (text: string, x: number, y: number, fontSize: number, font: any, color: any, maxWidth: number, lineHeight = 14) => {
    const words = text.split(' ');
    let line = '';
    let currentHeight = y;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && n > 0) {
        page.drawText(line.trim(), { x, y: currentHeight, size: fontSize, font, color });
        line = words[n] + ' ';
        currentHeight -= lineHeight;
      } else {
        line = testLine;
      }
    }
    page.drawText(line.trim(), { x, y: currentHeight, size: fontSize, font, color });
    return currentHeight - lineHeight;
  };
  
  currentY = drawParagraph(openingText, margin + 20, currentY, 9, helveticaFont, colorNavy, width - margin * 2 - 40, 14);
  
  // 5. Tabel Detil Proyek
  currentY -= 15;
  // Background Box
  const tableHeight = 110;
  page.drawRectangle({
    x: margin + 20,
    y: currentY - tableHeight,
    width: width - margin * 2 - 40,
    height: tableHeight,
    borderColor: colorBorder,
    borderWidth: 1,
  });
  
  // Header Box
  page.drawRectangle({
    x: margin + 20,
    y: currentY - 22,
    width: width - margin * 2 - 40,
    height: 22,
    color: colorLightSlate,
  });
  
  page.drawText('RINCIAN SERAH TERIMA PROYEK', {
    x: margin + 30,
    y: currentY - 14,
    size: 8,
    font: helveticaBold,
    color: colorNavy,
  });
  
  let rowY = currentY - 38;
  const drawRow = (label: string, val: string, isLink = false) => {
    page.drawText(label, { x: margin + 35, y: rowY, size: 9, font: helveticaBold, color: colorNavy });
    
    if (isLink) {
      page.drawText(val, { x: margin + 140, y: rowY, size: 9, font: helveticaOblique, color: colorSlate });
      // Tambahkan garis bawah link
      const textW = helveticaOblique.widthOfTextAtSize(val, 9);
      page.drawLine({
        start: { x: margin + 140, y: rowY - 1 },
        end: { x: margin + 140 + textW, y: rowY - 1 },
        thickness: 0.5,
        color: colorSlate,
      });
    } else {
      // Potong text jika terlalu panjang
      const maxLen = 60;
      const displayVal = val.length > maxLen ? val.substring(0, maxLen) + '...' : val;
      page.drawText(displayVal, { x: margin + 140, y: rowY, size: 9, font: helveticaFont, color: colorNavy });
    }
    
    // Garis horizontal antar baris
    page.drawLine({
      start: { x: margin + 20, y: rowY - 6 },
      end: { x: width - margin - 20, y: rowY - 6 },
      thickness: 0.5,
      color: colorBorder,
    });
    
    rowY -= 18;
  };
  
  drawRow('Nama Proyek', params.projectName);
  drawRow('Nama Klien', params.clientName);
  drawRow('Deskripsi Proyek', params.description);
  drawRow('Tautan Aset Proyek', params.driveLink, true);
  
  // 6. Pernyataan Hukum / Keabsahan
  currentY = rowY - 20;
  const legalText = `DENGAN INI Pihak Pertama menyerahkan hasil pekerjaan digital tersebut di atas secara utuh, dan Pihak Kedua menyatakan Menerima pekerjaan tersebut tanpa syarat tambahan apa pun. Segala revisi setelah disetujuinya Berita Acara ini dianggap di luar lingkup kerja awal (Scope Creep). Persetujuan ini ditandatangani secara elektronik menggunakan Tanda Tangan Elektronik Implisit (Implicit Electronic Signature) yang sah berdasarkan Undang-Undang Informasi dan Transaksi Elektronik (UU ITE) Republik Indonesia.`;
  
  currentY = drawParagraph(legalText, margin + 20, currentY, 8, helveticaFont, colorSlate, width - margin * 2 - 40, 12);
  
  // 7. Area Tanda Tangan & Log Keamanan
  currentY -= 25;
  const sigBoxWidth = (width - margin * 2 - 60) / 2;
  const sigBoxHeight = 150;
  
  // Tanda Tangan Freelancer (Pihak Pertama)
  page.drawRectangle({
    x: margin + 20,
    y: currentY - sigBoxHeight,
    width: sigBoxWidth,
    height: sigBoxHeight,
    borderColor: colorBorder,
    borderWidth: 1,
  });
  
  page.drawRectangle({
    x: margin + 20,
    y: currentY - 22,
    width: sigBoxWidth,
    height: 22,
    color: colorLightSlate,
  });
  
  page.drawText('PIHAK PERTAMA (Freelancer)', {
    x: margin + 30,
    y: currentY - 14,
    size: 8,
    font: helveticaBold,
    color: colorNavy,
  });
  
  // Tanda tangan Freelancer otomatis disubmit
  page.drawText('DITANDATANGANI SECARA DIGITAL', {
    x: margin + 30,
    y: currentY - 60,
    size: 8,
    font: helveticaBold,
    color: colorNavy,
  });
  page.drawText(`Nama: ${params.projectName ? 'Freelancer Project' : 'Pihak Pertama'}`, {
    x: margin + 30,
    y: currentY - 78,
    size: 8,
    font: helveticaFont,
    color: colorSlate,
  });
  page.drawText(`Waktu: ${formattedDate}`, {
    x: margin + 30,
    y: currentY - 92,
    size: 8,
    font: helveticaFont,
    color: colorSlate,
  });
  page.drawText('Sertifikat: TEKEN-GENUINE-KEY', {
    x: margin + 30,
    y: currentY - 106,
    size: 8,
    font: helveticaOblique,
    color: colorEmerald,
  });
  
  // Tanda Tangan Klien (Pihak Kedua)
  page.drawRectangle({
    x: margin + 30 + sigBoxWidth,
    y: currentY - sigBoxHeight,
    width: sigBoxWidth,
    height: sigBoxHeight,
    borderColor: colorBorder,
    borderWidth: 1,
  });
  
  page.drawRectangle({
    x: margin + 30 + sigBoxWidth,
    y: currentY - 22,
    width: sigBoxWidth,
    height: 22,
    color: isApproved ? colorLightSlate : rgb(254/255, 242/255, 242/255),
  });
  
  page.drawText('PIHAK KEDUA (Klien)', {
    x: margin + 40 + sigBoxWidth,
    y: currentY - 14,
    size: 8,
    font: helveticaBold,
    color: isApproved ? colorNavy : colorRed,
  });
  
  if (isApproved) {
    page.drawText('DISETUJUI & TEKEN ELEKTRONIK', {
      x: margin + 40 + sigBoxWidth,
      y: currentY - 45,
      size: 8,
      font: helveticaBold,
      color: colorEmerald,
    });
    
    // Digital Footprint info
    page.drawText(`Nama Klien: ${params.clientName}`, {
      x: margin + 40 + sigBoxWidth,
      y: currentY - 60,
      size: 7.5,
      font: helveticaFont,
      color: colorNavy,
    });
    
    const approvedDateStr = params.approvedAt 
      ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(params.approvedAt)
      : formattedDate;
    page.drawText(`Waktu: ${approvedDateStr}`, {
      x: margin + 40 + sigBoxWidth,
      y: currentY - 72,
      size: 7.5,
      font: helveticaFont,
      color: colorSlate,
    });
    
    page.drawText(`IP Address: ${params.ipAddress || 'Unknown'}`, {
      x: margin + 40 + sigBoxWidth,
      y: currentY - 84,
      size: 7.5,
      font: helveticaFont,
      color: colorSlate,
    });
    
    // Wrap User Agent
    const ua = params.userAgent || 'Unknown Device';
    const displayUA1 = ua.length > 32 ? ua.substring(0, 32) : ua;
    const displayUA2 = ua.length > 32 ? ua.substring(32, 64) : '';
    page.drawText(`Device: ${displayUA1}`, {
      x: margin + 40 + sigBoxWidth,
      y: currentY - 96,
      size: 7.5,
      font: helveticaFont,
      color: colorSlate,
    });
    if (displayUA2) {
      page.drawText(displayUA2, {
        x: margin + 40 + sigBoxWidth + 30,
        y: currentY - 105,
        size: 7.5,
        font: helveticaFont,
        color: colorSlate,
      });
    }
    
    page.drawText('Implicit Signature: VERIFIED LEGAL', {
      x: margin + 40 + sigBoxWidth,
      y: currentY - 120,
      size: 8,
      font: helveticaBold,
      color: colorEmerald,
    });
    
  } else {
    page.drawText('BELUM DISETUJUI / DRAFT ONLY', {
      x: margin + 40 + sigBoxWidth,
      y: currentY - 70,
      size: 8,
      font: helveticaBold,
      color: colorRed,
    });
    page.drawText('Menunggu persetujuan klien di halaman verifikasi.', {
      x: margin + 40 + sigBoxWidth,
      y: currentY - 88,
      size: 7,
      font: helveticaOblique,
      color: colorSlate,
    });
  }
  
  // 8. Footer & QR Code Verifikasi
  const verifyUrl = `${params.host}/verify/${params.id}`;
  
  // Generate QR Code as PNG Buffer
  const qrPngBuffer = await QRCode.toBuffer(verifyUrl, {
    type: 'png',
    margin: 1,
    width: 90,
  });
  
  const qrImage = await pdfDoc.embedPng(qrPngBuffer);
  
  const footerY = margin + 15;
  page.drawImage(qrImage, {
    x: width - margin - 95,
    y: footerY,
    width: 80,
    height: 80,
  });
  
  page.drawText('PINDAI QR CODE DI SAMPING', {
    x: margin + 20,
    y: footerY + 55,
    size: 8,
    font: helveticaBold,
    color: colorNavy,
  });
  
  page.drawText('Untuk memverifikasi keabsahan secara digital, melihat log sidik jari,', {
    x: margin + 20,
    y: footerY + 40,
    size: 7.5,
    font: helveticaFont,
    color: colorSlate,
  });
  
  page.drawText('atau mengunduh versi sertifikat legal terbaru dari database TEKEN.', {
    x: margin + 20,
    y: footerY + 28,
    size: 7.5,
    font: helveticaFont,
    color: colorSlate,
  });
  
  page.drawText(`Halaman Verifikasi Klien: ${verifyUrl}`, {
    x: margin + 20,
    y: footerY + 12,
    size: 7,
    font: helveticaOblique,
    color: colorNavy,
  });
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
