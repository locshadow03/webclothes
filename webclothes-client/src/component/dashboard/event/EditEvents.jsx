import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllBrands } from '../../../api/Brand';
import { getAllCategores } from '../../../api/Category';
import { getAllProducts } from '../../../api/Product';
import { getEventById, updateEvent } from '../../../api/Event';
import Select from 'react-select';

const EditEvent = () => {
  const [formData, setFormData] = useState({
    name_event: '',
    description_event: '',
    startDate: '',
    endDate: '',
    discountAmount: '',
    isPercentage: false,
    products: [],
    brands: [],
    categories: [],
    imageEvent: null
  });

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const { eventId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, brandRes, cateRes, eventRes] = await Promise.all([
          getAllProducts(),
          getAllBrands(),
          getAllCategores(),
          getEventById(eventId)
        ]);

        console.log("hello", eventRes)

        setProducts(prodRes);
        setBrands(brandRes);
        setCategories(cateRes);

        const eventData = eventRes;
        setFormData({
        name_event: eventData.name_event,
        description_event: eventData.descriptionEvent,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        discountAmount: eventData.discountAmount,
        isPercentage: Boolean(eventData.isPercentage),
        products: eventData.product_id,
        brands: eventData.brand_id,
        categories: eventData.category_id,
        imageEvent: eventData.img_event
        });

        const fetchedData = formData.isPercentage;

        console.log("in ra", fetchedData)
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
      }
    };
    fetchData();
    console.log("in ra", formData)
  }, [eventId]);

  useEffect(() => {
    console.log("formData đã được cập nhật:", formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : e.target.value,
      });
    } else if (type === 'file') {
      setImage(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMultiSelectChange = (selectedOptions, field, options) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prev => ({
      ...prev,
      [field]: selectedValues
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name_event", formData.name_event);
      formDataToSend.append("description_event", formData.description_event);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("discountAmount", formData.discountAmount);
      formDataToSend.append("isPercentage", formData.isPercentage);
      formDataToSend.append("product_id", JSON.stringify(formData.products));
      formDataToSend.append("brand_id", JSON.stringify(formData.brands));
      formDataToSend.append("category_id", JSON.stringify(formData.categories));
      if (image) {
        formDataToSend.append("imageEvent", image);
      }

      const result = await updateEvent(eventId, formDataToSend);

      if (result) {
        alert('Cập nhật sự kiện thành công!');
        navigate('/dashboard/event');
      } else {
        alert('Cập nhật sự kiện thất bại!');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật sự kiện:', err);
      alert('Cập nhật sự kiện thất bại!');
    }
  };

  const mapToOptions = (items, labelKey = 'name', valueKey = 'id') =>
    items.map(item => ({ value: item[valueKey], label: item[labelKey] }));

  return (
    <div className="container mt-5">
      <h4>Cập nhật sự kiện</h4>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Tên sự kiện</label>
          <input
            type="text"
            name="name_event"
            className="form-control"
            value={formData.name_event}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Mô tả</label>
          <textarea
            name="description_event"
            className="form-control"
            value={formData.description_event}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Ảnh sự kiện</label><br></br>
          <img
            src={formData.imageEvent}
            alt="Color"
            className="img-thumbnail mb-2"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
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
            value={formData.startDate}
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
            value={formData.endDate}
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
            value={formData.discountAmount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="isPercentage"
            checked={!!formData.isPercentage}
            onChange={handleChange}
          />
          <label className="form-check-label">Tính theo phần trăm</label>
        </div>

        <div className="mb-3">
          <label>Chọn sản phẩm</label>
          <Select
            isMulti
            options={mapToOptions(products, 'name', 'productId')}
            value={mapToOptions(products.filter(product => formData.products.includes(product.productId)), 'name', 'productId')}
            onChange={(selected) => handleMultiSelectChange(selected, 'products', products)}
          />
        </div>

        <div className="mb-3">
          <label>Chọn thương hiệu</label>
          <Select
            isMulti
            options={mapToOptions(brands, 'nameBrand', 'id')}
            value={mapToOptions(brands.filter(brand => formData.brands.includes(brand.id)), 'nameBrand', 'id')}
            onChange={(selected) => handleMultiSelectChange(selected, 'brands', brands)}
          />
        </div>

        <div className="mb-3">
          <label>Chọn danh mục</label>
          <Select
            isMulti
            options={mapToOptions(categories, 'nameCategory', 'id')}
            value={mapToOptions(categories.filter(category => formData.categories.includes(category.id)), 'nameCategory', 'id')}
            onChange={(selected) => handleMultiSelectChange(selected, 'categories', categories)}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Cập nhật sự kiện
        </button>
      </form>
    </div>
  );
};

export default EditEvent;