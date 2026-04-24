import Discount from '../models/Discount.js';

export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json({ discounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDiscount = async (req, res) => {
  try {
    const { code, percentage, description, expiryDate, maxUses } = req.body;

    if (!code || !percentage || !expiryDate) {
      return res.status(400).json({ error: 'Code, percentage, and expiry date required' });
    }

    const discount = new Discount({
      code: code.toUpperCase(),
      percentage,
      description,
      expiryDate,
      maxUses,
      createdBy: req.admin.id
    });

    await discount.save();
    res.status(201).json({ discount, message: 'Discount created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, percentage, description, expiryDate, maxUses, isActive } = req.body;

    const discount = await Discount.findByIdAndUpdate(
      id,
      { code: code?.toUpperCase(), percentage, description, expiryDate, maxUses, isActive },
      { new: true }
    );

    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    res.json({ discount, message: 'Discount updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const discount = await Discount.findByIdAndDelete(id);

    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    res.json({ message: 'Discount deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const validateDiscount = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code required' });
    }

    const discount = await Discount.findOne({ code: code.toUpperCase() });

    if (!discount) {
      return res.status(404).json({ error: 'Invalid discount code' });
    }

    if (!discount.isActive) {
      return res.status(400).json({ error: 'Discount is inactive' });
    }

    if (new Date() > discount.expiryDate) {
      return res.status(400).json({ error: 'Discount expired' });
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return res.status(400).json({ error: 'Discount limit reached' });
    }

    res.json({ discount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
