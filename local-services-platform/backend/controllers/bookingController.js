const Booking = require('../models/Booking');
const Service = require('../models/Service');

module.exports = {
  listMy: async (req, res, next) => {
    try {
      const bookings = await Booking.find({ user: req.user._id })
        .populate({ path: 'service', populate: { path: 'provider', select: 'name' } });
      res.json(bookings);
    } catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const created = await Booking.create({ ...req.body, user: req.user._id });
      res.status(201).json(created);
    } catch (err) { next(err); }
  },
  cancel: async (req, res, next) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      if (booking.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
      booking.status = 'cancelled';
      await booking.save();
      res.json(booking);
    } catch (err) { next(err); }
  },
  listForProvider: async (req, res, next) => {
    try {
      const services = await Service.find({ provider: req.user._id }).select('_id');
      const serviceIds = services.map(s => s._id);
      const bookings = await Booking.find({ service: { $in: serviceIds } })
        .populate('user', 'name email')
        .populate({ path: 'service', select: 'title price category', populate: { path: 'provider', select: 'name' } });
      res.json(bookings);
    } catch (err) { next(err); }
  },
  setStatus: async (req, res, next) => {
    try {
      const { status } = req.body; // expected: 'confirmed' | 'completed' | 'cancelled'
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      const service = await Service.findById(booking.service);
      if (!service) return res.status(404).json({ message: 'Service not found' });
      if (service.provider.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
      const allowed = ['confirmed', 'completed', 'cancelled'];
      if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
      booking.status = status;
      await booking.save();
      const populated = await booking.populate('user', 'name email');
      res.json(populated);
    } catch (err) { next(err); }
  },
};

