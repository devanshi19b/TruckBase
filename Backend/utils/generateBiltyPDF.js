// utils/generateBiltyPDF.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const generateBiltyPDF = (biltyData, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 20 });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // HEADER
      doc.fontSize(22).fillColor('black').text(
        biltyData.transportName || (biltyData.user?.companyName || "TRANSPORT COMPANY"),
        { align: "center" }
      );

      doc.moveDown(0.3);
      doc.fontSize(11).fillColor('black').text("Transport Contractor & Leading Road Carrier", { align: "center" });

      doc.moveDown(0.6);

      // Top boxes info
      // left box: bilty no; right box: date, vehicle
      doc.rect(20, 110, 260, 50).stroke();
      doc.rect(300, 110, 260, 50).stroke();

      doc.fontSize(12).text(`CONSIGNMENT NOTE NO.: ${biltyData.biltyNumber}`, 30, 120);
      doc.text(`Date: ${new Date(biltyData.date || Date.now()).toLocaleDateString()}`, 310, 120);
      doc.text(`Vehicle No.: ${biltyData.truckNumber || "-"}`, 310, 135);

      doc.moveDown(3);

      // CONSIGNOR / CONSIGNEE
      doc.fontSize(13).fillColor('black').text("CONSIGNOR", 30);
      doc.fontSize(11).fillColor('black').text(`${biltyData.consignor || "-"}`, { indent: 10 });
      doc.text(`GST No.: ${biltyData.consignorGstNumber || "—"}`, { indent: 10 });

      doc.moveDown(0.7);

      doc.fontSize(13).fillColor('black').text("CONSIGNEE", 300);
      doc.fontSize(11).fillColor('black').text(`${biltyData.consignee || "-"}`, 300);
      doc.text(`GST No.: ${biltyData.consigneeGstNumber || "—"}`, 300);

      doc.moveDown(1.2);

      doc.text(`From: ${biltyData.origin || "-"}`, { continued: false });
      doc.text(`To: ${biltyData.destination || "-"}`);

      doc.moveDown(0.8);

      // GOODS TABLE header
      const startY = doc.y;
      doc.rect(20, startY, 560, 22).fill('#f2f2f2').stroke();
      doc.fillColor('black').fontSize(11);
      doc.text("Packages", 25, startY + 6);
      doc.text("Description", 115, startY + 6);
      doc.text("Actual Wt.", 315, startY + 6);
      doc.text("Charged Wt.", 390, startY + 6);
      doc.text("Amount (Rs.)", 470, startY + 6);

      let y = startY + 22;
      doc.rect(20, y, 560, 120).stroke();

      doc.text(biltyData.packages || biltyData.privateMarka || "-", 25, y + 10, { width: 80 });
      doc.text(biltyData.goodsDescription || "-", 115, y + 10, { width: 180 });
      doc.text(`${biltyData.weight ?? 0} Kg`, 315, y + 10);
      doc.text(`${biltyData.weight ?? 0} Kg`, 390, y + 10);
      doc.text(`${biltyData.freight ?? 0}`, 470, y + 10);

      // PAYMENT BOX
      y += 140;
      doc.rect(20, y, 560, 70).stroke();

      doc.fontSize(11).text(`Freight: ₹${biltyData.freight ?? 0}`, 30, y + 10);
      doc.text(`Advance: ₹${biltyData.advance ?? 0}`, 30, y + 30);

      doc.text(`Balance: ₹${biltyData.balance ?? 0}`, 300, y + 10);
      doc.text(`Payment Status: ${biltyData.paymentStatus || "Pending"}`, 300, y + 30);

      // Footer
      doc.fontSize(12).text("Authorized Signatory", 420, y + 60);

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

export default generateBiltyPDF;
