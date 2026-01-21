import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LegislationDetailPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-07');
  const [currentPage, setCurrentPage] = useState(1);

  const legislationData = [
    { title: "Agricultural Land Act", date: "July 3, 2024" },
    { title: "Zoning & Land Use Laws", date: "July 5, 2024" },
    { title: "Land Redistribution & Reform Laws", date: "July 7, 2024" },
    { title: "Eminent Domain & Expropriation Laws", date: "July 8, 2024" },
    { title: "Land Conservation & Restoration Acts", date: "July 9, 2024" },
    { title: "Homestead & Smallholder Farming Acts", date: "July 10, 2024" },
    { title: "Leasehold & Tenant Farming Regulations", date: "July 11, 2024" },
    { title: "Indigenous & Tribal Land Rights Laws", date: "July 13, 2024" },
    { title: "Agro-Industrial Zoning Laws", date: "July 14, 2024" },
    { title: "Pastoral & Rangeland Management Laws", date: "July 15, 2024" },
    { title: "Property Tax & Exemptions for Farmers", date: "July 16, 2024" },
    { title: "Agricultural Easements", date: "July 17, 2024" },
  ];

  const filteredData = legislationData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = 10;

  const handlePageChange = (page: React.SetStateAction<number>) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    
    
    pages.push(
      <button
        key="prev"
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    );

    for (let i = 1; i <= 5; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded font-medium ${
            currentPage === i
              ? 'bg-[#9FC93B] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    
    pages.push(
      <span key="ellipsis" className="w-8 h-8 flex items-center justify-center text-gray-500">
        ...
      </span>
    );

    
    pages.push(
      <button
        key={totalPages}
        onClick={() => handlePageChange(totalPages)}
        className={`w-8 h-8 flex items-center justify-center rounded font-medium ${
          currentPage === totalPages
            ? 'bg-[#9FC93B] text-white'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        {totalPages}
      </button>
    );

    
    pages.push(
      <button
        key="next"
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    );

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Land Use & Ownership Laws
          </h1>


          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent"
              />
            </div>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent bg-white min-w-[150px] appearance-none cursor-pointer"
            >
              <option value="2024-07">2024-07</option>
              <option value="2024-06">2024-06</option>
              <option value="2024-05">2024-05</option>
              <option value="2024-04">2024-04</option>
            </select>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Legislation Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#9FC93B] hover:text-[#8AB82F] text-sm font-medium underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
         
          <button className="px-6 py-2.5 border-2 border-[#9FC93B] text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Back
          </button>


          <div className="flex items-center gap-1">
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
}