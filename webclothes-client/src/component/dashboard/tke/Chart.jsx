
import React, { useEffect, useState } from 'react';
import { getTotalAmountForYear } from '../../../api/Order';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const Chart = () => {
  const [year, setYear] = useState(new Date().getFullYear()); // Khởi tạo với năm hiện tại
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await getTotalAmountForYear(year);
        setMonthlyRevenue(response);
      } catch (error) {
        console.error('Error fetching monthly revenue:', error);
      }
    };

    fetchMonthlyRevenue();
  }, [year]);

  const data = {
    labels: ['Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    datasets: [
      {
        label: `Tổng doanh thu tháng trong năm ${year}`,
        data: monthlyRevenue,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 5
      },
    ],
  };

  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value, 10));
  };

  return (
    <>
      <div className='mx-5 bg-white pb-5 mt-5 d-flex flex-column justify-content-start align-items-center' style = {{height: '550px'}}>
        <div className='d-flex justify-content-start align-items-center mt-3' style = {{height: '50px'}}>
            <h5 className='m-0 mt-4'>Thống kê doanh thu theo tháng trong năm</h5>
            <select className='mx-2 mt-4 m-0' value={year} onChange={handleYearChange}>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
            ))}
            </select>
        </div>
        <Line data={data} className='mx-4 py-5' style = {{height: '450px'}}/>
      </div>
    </>
  );
};

export default Chart;
