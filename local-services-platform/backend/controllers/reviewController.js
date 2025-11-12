const Review = require('../models/Review');
const Booking = require('../models/Booking');

module.exports = {
  listForService: async (req, res, next) => {
    try {
      const reviews = await Review.find({ service: req.params.serviceId }).populate('user', 'name');
      res.json(reviews);
    } catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      // Only allow reviews from users who completed a booking for this service
      const eligible = await Booking.exists({
        user: req.user._id,
        service: req.params.serviceId,
        status: 'completed',
      });
      if (!eligible) {
        return res.status(400).json({ message: 'You can review only after a completed booking.' });
      }
      const created = await Review.create({ ...req.body, user: req.user._id, service: req.params.serviceId });
      res.status(201).json(created);
    } catch (err) {
      // Handle duplicate key error (unique user+service review)
      if (err && err.code === 11000) {
        return res.status(400).json({ message: 'You have already reviewed this service' });
      }
      next(err);
    }
  },
};

