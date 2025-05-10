import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../../../api/Event';
import { Link } from 'react-router-dom';

const AllEvent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      setEvents(response);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sự kiện:", error);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mt-5 mx-5">
        <h4>Danh sách các sự kiện</h4>
        <Link to="/dashboard/event/add-event" className="btn btn-primary">
          Thêm sự kiện
        </Link>
      </div>

      <div className="mx-5 mt-4">
        <table className="table table-hover" style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Tên sự kiện</th>
              <th>Mô tả</th>
              <th>Ảnh sự kiện</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Giảm giá</th>
              <th>Phần trăm (%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event, index) => (
                <tr key={event.id} className="text-center align-middle">
                  <td>{index + 1}</td>
                  <td>{event.name_event}</td>
                  <td>{event.descriptionEvent}</td>
                  <td>
                    {event.img_event ? (
                      <img
                        src={event.img_event}
                        alt="ảnh sự kiện"
                        style={{ width: '80px', height: 'auto', objectFit: 'cover' }}
                      />
                    ) : (
                      <span className="text-muted">Không có ảnh</span>
                    )}
                  </td>
                  <td>{event.startDate}</td>
                  <td>{event.endDate}</td>
                  <td>{event.discountAmount}</td>
                  <td>{event.percentage ? '✔️' : '❌'}</td>
                  <td>
                    <Link to = {`/dashboard/event/edit-event/${event.id}`} className="btn btn-sm btn-warning me-2">Sửa</Link>
                    <button className="btn btn-sm btn-danger">Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  Không có sự kiện nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEvent;
