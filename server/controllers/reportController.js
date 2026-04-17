import Report from '../models/Report.js';
import { sendEmail } from '../../config/mailer.js';

export const createReport = async (req, res) => {
  try {
    const { title, category, location, description, priority } = req.body;

    if (!title || !category || !location || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const report = new Report({
      title,
      category,
      location,
      description,
      priority,
      reporter: req.user.userId,
    });

    await report.save();
    await report.populate('reporter', 'name email');

    res.status(201).json({
      message: 'Report submitted successfully',
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const reports = await Report.find(query)
      .populate('reporter', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name email')
      .populate('assignedTo', 'name email');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { status, priority, update } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status,
        priority,
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate('reporter', 'name email');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (update) {
      report.updates.push({ text: update });
      await report.save();
    }

    res.json({
      message: 'Report updated successfully',
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user.userId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
