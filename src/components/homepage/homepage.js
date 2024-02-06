import React from "react";
import CSVReader from "react-csv-reader";
import "./homepage.css";

const Homepage = ({ setLoginUser }) => {
  // debugger;
  console.log('User is loging off.........');
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().replace(/\W/g, "_"),
  };

  const handleCSVFile = (data, fileInfo) => {
    // 'data' is an array of arrays containing the CSV data
    console.log('Uploading the file..........',data);
  };
console.log('Component is mounted..........')
  return (
    <div className="homepage">
      <header>
        <div className="logOutButton" onClick={() => setLoginUser({})}>
          Logout
        </div>
      </header>
      <div>
        <CSVReader
          onFileLoaded={handleCSVFile}
          parserOptions={papaparseOptions}
        />
      </div>
    </div>
  );
};

export default Homepage;
