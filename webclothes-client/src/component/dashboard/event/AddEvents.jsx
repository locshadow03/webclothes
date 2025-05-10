import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAllBrands } from '../../../api/Brand';
import { getAllCategores } from '../../../api/Category';
import { getAllProducts } from '../../../api/Product';
import Select from 'react-select';
import { addDiscountEvent } from '../../../api/Event';

const AddEvent = () => {
  const [formData, setFormData] = useState({
    name_event: '',
    description_event: '',
    startDate: '',
    endDate: '',
    discountAmount: '',
    percentage: false,
    products: [],
    brands: [],
    categories: [],
    img_event: null
  });

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, brandRes, cateRes] = await Promise.all([
          getAllProducts(),
          getAllBrands(),
          getAllCategores()
        ]);
        setProducts(prodRes);
        setBrands(brandRes);
        setCategories(cateRes);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMultiSelectChange = (selectedOptions, field) => {
    console.log('selectedOptions:', selectedOptions);
    setFormData(prev => ({
      ...prev,
      [field]: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addDiscountEvent(
        formData.name_event,
        formData.description_event,
        formData.startDate,
        formData.endDate,
        formData.discountAmount,
        formData.percentage,
        formData.brands,
        formData.categories,
        formData.products,
        formData.img_event
      );

      console.log(formData)
  
      if (result) {
        alert('Thêm sự kiện thành công!');
        navigate('/dashboard/event');
      } else {
        alert('Thêm sự kiện thất bại!');
      }
    } catch (err) {
      console.error('Lỗi khi thêm sự kiện:', err);
      alert('Thêm sự kiện thất bại!');
    }
  };

  const mapToOptions = (items, labelKey = 'name', valueKey = 'id') =>
    items.map(item => ({ value: item[valueKey], label: item[labelKey] }));

  return (
    <div className="container mt-5">
      <h4>Thêm sự kiện mới</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Tên sự kiện</label>
          <input
            type="text"
            name="name_event"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Mô tả</label>
          <textarea
            name="description_event"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Ảnh sự kiện</label>
          <input
            type="file"
            name="img_event"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Ngày bắt đầu</label>
          <input
            type="date"
            name="startDate"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Ngày kết thúc</label>
          <input
            type="date"
            name="endDate"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Mức giảm giá (áp dụng chung)</label>
          <input
            type="number"
            name="discountAmount"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="percentage"
            onChange={handleChange}
          />
          <label className="form-check-label">Tính theo phần trăm</label>
        </div>

        <div className="mb-3">
          <label>Chọn sản phẩm</label>
          <Select
            isMulti
            options={mapToOptions(products, 'name','productId')}
            onChange={(selected) => handleMultiSelectChange(selected, 'products')}
          />
        </div>

        <div className="mb-3">
          <label>Chọn thương hiệu</label>
          <Select
            isMulti
            options={mapToOptions(brands, 'nameBrand')}
            onChange={(selected) => handleMultiSelectChange(selected, 'brands')}
          />
        </div>

        <div className="mb-3">
          <label>Chọn danh mục</label>
          <Select
            isMulti
            options={mapToOptions(categories, 'nameCategory')}
            onChange={(selected) => handleMultiSelectChange(selected, 'categories')}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Thêm sự kiện
        </button>
      </form>
    </div>
  );
};

export default AddEvent;