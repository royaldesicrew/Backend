import React, { useState, useEffect, useCallback } from 'react';
import { discountsAPI } from '../services/api';
import './Manager.css';

const DiscountsManager = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [percentage, setPercentage] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const fetchDiscounts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await discountsAPI.getAll();
      setDiscounts(response.data.discounts || []);
    } catch (err) {
      setError('Failed to load discounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await discountsAPI.create({ code, percentage, expiryDate });
      setCode('');
      setPercentage('');
      setExpiryDate('');
      setShowForm(false);
      fetchDiscounts();
    } catch (err) {
      setError('Failed to create discount');
    }
  };

  const handleDelete = async (discountId) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await discountsAPI.delete(discountId);
      fetchDiscounts();
    } catch (err) {
      setError('Failed to delete discount');
    }
  };

  if (loading) return <div className="manager"><p>Loading...</p></div>;

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Discounts Manager</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Discount'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="manager-form">
          <div className="form-group">
            <label>Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., SAVE20"
              required
            />
          </div>
          <div className="form-group">
            <label>Discount %</label>
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min="0"
              max="100"
              required
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      <div className="discounts-list">
        {discounts.map((discount) => (
          <div key={discount._id} className="discount-item">
            <div className="discount-info">
              <h3>{discount.code}</h3>
              <p className="discount-percentage">{discount.percentage}% off</p>
              <p className="discount-expiry">Expires: {new Date(discount.expiryDate).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => handleDelete(discount._id)}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountsManager;
