const Service = require('../models/Service');
const Review = require('../models/Review');

module.exports = {
  list: async (req, res, next) => {
    try {
      const services = await Service.find().populate('provider', 'name').lean();

      // Aggregate average rating and count per service
      const aggregations = await Review.aggregate([
        { $match: { service: { $in: services.map(s => s._id) } } },
        {
          $group: {
            _id: '$service',
            averageRating: { $avg: '$rating' },
            reviewCount: { $count: {} },
          },
        },
      ]);
      const byServiceId = new Map(aggregations.map(a => [String(a._id), a]));

      const enriched = services.map(s => {
        const agg = byServiceId.get(String(s._id));
        return {
          ...s,
          averageRating: agg ? Number(agg.averageRating.toFixed(2)) : 0,
          reviewCount: agg ? agg.reviewCount : 0,
        };
      });

      res.json(enriched);
    } catch (err) { next(err); }
  },
  listMine: async (req, res, next) => {
    try {
      const services = await Service.find({ provider: req.user._id });
      res.json(services);
    } catch (err) { next(err); }
  },
  getById: async (req, res, next) => {
    try {
      const service = await Service.findById(req.params.id).populate('provider', 'name').lean();
      if (!service) return res.status(404).json({ message: 'Service not found' });

      const agg = await Review.aggregate([
        { $match: { service: service._id } },
        {
          $group: {
            _id: '$service',
            averageRating: { $avg: '$rating' },
            reviewCount: { $count: {} },
          },
        },
        { $limit: 1 },
      ]);

      const meta = agg[0];
      res.json({
        ...service,
        averageRating: meta ? Number(meta.averageRating.toFixed(2)) : 0,
        reviewCount: meta ? meta.reviewCount : 0,
      });
    } catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const created = await Service.create({ ...req.body, provider: req.user._id });
      res.status(201).json(created);
    } catch (err) { next(err); }
  },
  update: async (req, res, next) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) return res.status(404).json({ message: 'Service not found' });
      if (req.user.role === 'provider' && service.provider.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      Object.assign(service, req.body);
      const updated = await service.save();
      if (!updated) return res.status(404).json({ message: 'Service not found' });
      res.json(updated);
    } catch (err) { next(err); }
  },
  remove: async (req, res, next) => {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) return res.status(404).json({ message: 'Service not found' });
      if (req.user.role === 'provider' && service.provider.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const deleted = await Service.findByIdAndDelete(service._id);
      if (!deleted) return res.status(404).json({ message: 'Service not found' });
      res.json({ message: 'Deleted' });
    } catch (err) { next(err); }
  },
};

