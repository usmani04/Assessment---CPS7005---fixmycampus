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
    console.log('Update request body:', req.body);
    const { title, category, location, description, status, priority } = req.body;
    const update = typeof req.body.update === 'string' ? req.body.update.trim() : '';

    const updateFields = {
      updatedAt: Date.now(),
    };

    if (title !== undefined) updateFields.title = title;
    if (category !== undefined) updateFields.category = category;
    if (location !== undefined) updateFields.location = location;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;
    if (priority !== undefined) updateFields.priority = priority;

    console.log('Update fields:', updateFields);

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('reporter', 'name email');

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (update) {
      report.updates.push({ text: update });
      await report.save();
    }

    console.log('Updated report:', report);
    res.json(report);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user.userId })
      .populate('reporter', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      reporter: req.user.userId,
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found or you do not have permission to delete it' });
    }

    res.json({
      message: 'Report deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
