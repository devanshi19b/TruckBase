import ExcelJS from 'exceljs';
import Trip from '../models/Trip.js';

export const exportTrips = async (req, res) => {
  try {
    const { startDate, endDate, user } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "startDate and endDate are required (YYYY-MM-DD)" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    // include entire end day
    end.setHours(23, 59, 59, 999);

    const filter = { date: { $gte: start, $lte: end } };
    if (user) filter.user = user;

    const trips = await Trip.find(filter)
      .populate('truck')
      .populate('driver')
      .populate('bilties') // if you have bilty relation; otherwise ignore
      .lean();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Trip Report');

    sheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "From", key: "from", width: 20 },
      { header: "To", key: "to", width: 20 },
      { header: "Consignor", key: "consignor", width: 25 },
      { header: "Truck Number", key: "truck", width: 15 },
      { header: "Driver Name", key: "driver", width: 20 },
      { header: "Freight", key: "freight", width: 15 },
      { header: "Advance", key: "advance", width: 15 },
      { header: "Balance", key: "balance", width: 15 },
      { header: "Bilty Number", key: "bilty", width: 20 },
      { header: "Payment Status", key: "status", width: 15 },
    ];

    trips.forEach(trip => {
      sheet.addRow({
        date: trip.date ? trip.date.toISOString().split('T')[0] : '',
        from: trip.origin || '',
        to: trip.destination || '',
        consignor: trip.consignor || '',
        truck: trip.truck?.truckNumber || 'N/A',
        driver: trip.driver?.name || 'N/A',
        freight: trip.freight ?? 0,
        advance: trip.advance ?? 0,
        balance: trip.balance ?? 0,
        bilty: trip.biltyNumber || (trip.bilty?.biltyNumber) || 'N/A',
        status: trip.paymentStatus || 'N/A'
      });
    });

    // style header
    sheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Trip_Report_${startDate}_to_${endDate}.xlsx`);

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error('Error exporting trips:', error);
    res.status(500).json({ message: 'Failed to export trips' });
  }
};
