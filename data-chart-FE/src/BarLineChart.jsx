// BarLineChart.js
import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { useLocation, useNavigate } from 'react-router-dom';
const base_url = process.env.BASE_URL
const BarLineChart = () => {
    const [chartData, setChartData] = useState({});
    const [isCopied, setIsCopied] = useState(false);
    const [filters, setFilters] = useState({
      startDate: '',
      endDate: '',
      ageRange: '',
      gender: '',
    });
    const location = useLocation();
  const navigate = useNavigate();
  const setURLParams = (params) => {
    const query = new URLSearchParams(params).toString();
    navigate(`?${query}`);
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false); 
      }, 15000);
    });
  };
  const generateShareableLink = () => {
    const baseUrl = window.location.href.split('?')[0]; // get the base URL without query params
    const queryParams = new URLSearchParams(filters).toString();
    const shareableLink = `${baseUrl}?${queryParams}`;
    alert(`Share this link: ${shareableLink}`);
    copyToClipboard(shareableLink);
  };
  useEffect(() => {
    // Check if URL contains query params
    const queryParams = new URLSearchParams(location.search);
    const startDate = queryParams.get('startDate');
    const endDate = queryParams.get('endDate');
    const ageRange = queryParams.get('ageRange');
    const gender = queryParams.get('gender');
    
    if (startDate || endDate || ageRange || gender) {
      setFilters({
        startDate: startDate || '',
        endDate: endDate || '',
        ageRange: ageRange || '',
        gender: gender || '',
      });
    }
  }, [location.search])
    const fetchData = async () => {
      const token = localStorage.getItem('token'); 

    if (!token) {
      const currentUrl = `${location.pathname}${location.search}`;
      localStorage.setItem('redirectUrl', currentUrl);
      navigate('/login');
      return 
    }
      const startDate = filters.startDate ? new Date(filters.startDate).toISOString() : null;
      const endDate = filters.endDate ? new Date(filters.endDate).toISOString() : null;
      console.log("filters" , filters)
      try {
        const response = await axios.get(`${base_url}/api/data/analytics`, {
          headers : {
            Authorization: `Bearer ${token}`,
          },
          params: {
            startDate,
            endDate,
            ageRange: filters.ageRange,
            gender: filters.gender,
          }
        });
        console.log(response)
        const data = response.data;
        const dates = data.map((item) => new Date(item.day).toLocaleDateString());
        const AData = data.map((item) => item.A);
        const BData = data.map((item) => item.B);
        const CData = data.map((item) => item.C);
        const DData = data.map((item) => item.D);
  
        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'A',
              data: AData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderWidth: 1,
              borderColor: 'rgba(75, 192, 192, 1)',
            },
            {
              label: 'B',
              data: BData,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderWidth: 1,
              borderColor: 'rgba(153, 102, 255, 1)',
            },
            {
              label: 'C',
              data: CData,
              backgroundColor: 'rgba(255, 159, 64, 0.6)',
              borderWidth: 1,
              borderColor: 'rgba(255, 159, 64, 1)',
            },
            {
              label: 'D',
              data: DData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderWidth: 1,
              borderColor: 'rgba(255, 99, 132, 1)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    // useEffect(()=>{
    //   fetchData();
    // } , [[filters, navigate]])
    useEffect(() => {
      const storedFilters = JSON.parse(localStorage.getItem('filters'));
      if (storedFilters) {
        setFilters(storedFilters); // Apply filters after login
        localStorage.removeItem('filters'); // Clean up stored filters
      } else {
        fetchData();
      }
    }, [filters, navigate]);
    // useEffect(() => {
    //   fetchData();
    //   setURLParams(filters)
    // }, [filters]);
  
    const handleFilterChange = (e) => {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value,
      });
    };
  
    return (
      <div className="container mx-auto p-4">
        <div className='flex flex-row justify-between items-center'>
        <h2 className="text-2xl font-bold text-center mb-6">Data Analytics Chart</h2>
        <button
        className="p-2 m-2 bg-blue-500 text-white rounded"
        onClick={generateShareableLink}
      >
        {isCopied ? 'Link Copied!' : 'Copy Link'}
      </button>
        </div>
        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <label className="block">
          <span className="text-gray-700">Start Date</span>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>
          <label>
          <span className="text-gray-700">End Date</span>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </label>
          <label className='block'>
          <span className="text-gray-700">Age Range</span>
  <select name="ageRange" value={filters.ageRange} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="">All</option>
              <option value="15-25">15-25</option>
              <option value=">25">above 25</option>
            </select>
          </label>
          <label className='block'>
            <span className='text-gray-700'>Gender:</span>
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
        </div>
  
        {chartData.labels && chartData.datasets && (
          <div className='flex flex-row p-2 justify-center items-center'>
            {/* Bar Chart */}
            <div style={{ width: '70%', margin: 'auto' }}>
              <Bar
                data={chartData}
                options={{
                  indexAxis: 'y', // Makes the bar chart horizontal
                  scales: {
                    x: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
  
            {/* Line Chart */}
            <div style={{ width: '70%', margin: 'auto', marginTop: '50px' }}>
              <Line data={chartData} />
            </div>
          </div>
        )}

      </div>
    );
  };

export default BarLineChart;
