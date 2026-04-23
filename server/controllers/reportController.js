import Report from '../models/Report.js';
import { sendStatusEmail } from '../../config/mailer.js';


export const getReports = async (req, res, next) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (req.user.role === 'student') filter.reporter = req.user._id;
    if (status   && status   !== 'All') filter.status   = status;
    if (category && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { title:    { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .populate('reporter',          'name email studentId department')
      .populate('updates.updatedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      data:  reports,
    });
  } catch (err) { next(err); }
};


export const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter',          'name email studentId department')
      .populate('updates.updatedBy', 'name');

    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    if (req.user.role === 'student' && report.reporter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to view this report' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (err) { next(err); }
};


export const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .populate('reporter',          'name email studentId department')
      .populate('updates.updatedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reports });
  } catch (err) { next(err); }
};


export const createReport = async (req, res, next) => {
  try {
    const { title, category, location, description, priority, photo, photoUrl } = req.body;
    const report = await Report.create({
      title,
      category,
      location,
      description,
      priority,
      photo: photo || photoUrl,
      reporter: req.user._id,
    });
    const populated = await report.populate('reporter', 'name email studentId department');
    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
};


export const updateReport = async (req, res, next) => {
  try {
    console.log('[updateReport] req.user:', req.user);
    console.log('[updateReport] req.body:', req.body);
    
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name email notifEmail');

    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    if (req.user.role === 'student' && report.reporter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }

    const prevStatus = report.status;


    const allowed = ['title', 'category', 'location', 'description', 'priority', 'photoUrl'];

    if (['staff', 'admin'].includes(req.user.role)) allowed.push('status');

    console.log('[updateReport] allowed fields:', allowed);
    console.log('[updateReport] before update - title:', report.title, 'category:', report.category);

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        console.log(`[updateReport] updating ${key} from ${report[key]} to ${req.body[key]}`);
        report[key] = req.body[key];
      }
    });
    
    console.log('[updateReport] after update - title:', report.title, 'category:', report.category);

    if (req.body.update && req.body.update.trim()) {
      report.updates.push({
        message:   req.body.update.trim(),
        updatedBy: req.user._id,
      });
    }
  
    await report.save();

    const fresh = await Report.findById(report._id)
      .populate('reporter',          'name email studentId department')
      .populate('updates.updatedBy', 'name');

    if (req.body.status && req.body.status !== prevStatus && report.reporter.notifEmail) {
      await sendStatusEmail(report.reporter.email, report.reporter.name, {
        title:  fresh.title,
        status: fresh.status,
      });
    }

    res.status(200).json({ success: true, data: fresh });
  } catch (err) { next(err); }
};


export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    if (req.user.role === 'student' && report.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }
    if (req.user.role === 'staff') {
      return res.status(403).json({ success: false, message: 'Staff cannot delete reports' });
    }

    await report.deleteOne();
    res.status(200).json({ success: true, message: 'Report deleted' });
  } catch (err) { next(err); }
};


export const addUpdate = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Update message is required' });
    }

    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name email notifEmail');
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    report.updates.push({ message: message.trim(), updatedBy: req.user._id });
    await report.save();

    const fresh = await Report.findById(report._id)
      .populate('reporter',          'name email studentId department')
      .populate('updates.updatedBy', 'name');

    if (report.reporter.notifEmail) {
      await sendStatusEmail(report.reporter.email, report.reporter.name, {
        title:  report.title,
        status: report.status,
      });
    }

    res.status(200).json({ success: true, data: fresh });
  } catch (err) { next(err); }
};


export const getAnalytics = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [byCategory, byStatus, byMonth, hotspots] = await Promise.all([
      Report.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort:  { count: -1 } },
      ]),
      Report.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Report.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Report.aggregate([
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort:  { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.status(200).json({ success: true, data: { byCategory, byStatus, byMonth, hotspots } });
  } catch (err) { next(err); }
};
