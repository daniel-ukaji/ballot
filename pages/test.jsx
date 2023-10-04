import React from 'react';
import * as XLSX from "xlsx";

export default function Home() {
      
        const handleExportExcel = () => {
        
            // Replace this with your hardcoded data
  const customData = [
    ['Plot Name', 'Subscriber Name'],
    ['Value1', 'Value2'],
    ['Value3', 'Value4'],
    // Add more rows as needed
  ];
        
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(customData);
            XLSX.utils.book_append_sheet(wb, ws, 'Ballot Results');
        
            XLSX.writeFile(wb, 'ballot_results.xlsx');
        
          };
        
      
      
      

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button onClick={handleExportExcel} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Download Excel
      </button>
    </div>
  );
}
