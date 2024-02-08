import React, { useEffect, useState } from "react";
import { useCSVReader, formatFileSize } from "react-papaparse";
// import csv from "csvtojson";
import axios from "axios";
import "./dashboard.css";

export default function Dashboard({ setLoginUser }) {
  const { CSVReader } = useCSVReader();
  const [col, setCol] = useState([]);
  const [val, setVal] = useState([]);
  const [valObj, setValObj] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [errorCsv, setErrorCsv] = useState([]);

  const validationHeaders =  {
      "GROUP NAME*":"string",
      "GROUP NUM*\n(nnnnnn)":"number",
      "SUB-GROUP NUM*\n(nnnnnn)":"number",
      "LAST NAME*\n**Must be entered on all family members (No punctuation)":"string",
      "FIRST NAME*             (No punctuation)":"string",
      "M/I":"string",
      "Suffix":"string",
      "DATE OF\nBIRTH*\n(yyyymmdd)":"number",
      "MOBILE PHONE \n(no hypens)":"number",
      "HOME PHONE\n(no hyphens)":"number",
      "Work Phone\n(No hyphens)":"number",
      "Email Address":"string",
      "GENDER*\n(M / F)":"string",
      "Subscriber SSN*":"number",
      "MEMBER SSN \n(no hyphens)":"number",
      "MAILING ADDRESS LINE 1*                              (No punctuation)":"string",
      "MAILING ADDRESS LINE 2 (No puctuation)":"string",
      "CITY*":"string",
      "STATE*":"string",
      "ZIP*":"number",
      "Correspondence Addr Ln 1":"string",
      "Correspondence Addr Ln 2":"string",
      // "Correspondence City*":"string",
      // "Correspondence State*":"string",
      // "Correspondence Zip*":"number",
      // "RELATIONSHIP* \n**Must List Employee first:then family members**":"string",
      // "PCP SELECTION*":"number",
      // "MEDICAL PLAN*":"string",
      // "MEDICAL BEGIN DATE*\n(yyyymmdd)":"number",
      // "MEDICAL END DATE*\n(yyyymmdd)":"number",
      // "ACU/CHIRO PLAN*":"number",
      // "ACU/CHIRO BEGIN DATE*\n(yyyymmdd)":"number",
      // "ACU/CHIRO END DATE*\n(yyyymmdd)":"number",
      // "DENTAL PLAN*":"string",
      // "DENTAL BEGIN DATE*\n(yyyymmdd)":"number",
      // "DENTAL END DATE*\n(yyyymmdd)":"number",
      // "VISION PLAN*":"string",
      // "VISION BEGIN DATE*\n(yyyymmdd)":"number",
      // "VISION END DATE*\n(yyyymmdd)":"number",
      // "Infertility Plan":"string",
      // "Infertility Begin Date (yyyymmdd)":"string",
      // "Infertility End Date (yyyymmdd)":"number",
      // "Original Effective Date":"number",
      // "Language":"string",
      // "Existing patient of PCP?\n(not loaded)":"string",
      // "COMMENTS\n(Not loaded into system)":"string"
    }
    
    const handleBlur = (rowIndex, colIndex) => {
      const updatedValObj = [...valObj];
      updatedValObj[rowIndex][colIndex].editable = false;
      setValObj(updatedValObj);
    };

    const handleChange = (event, rowIndex, colIndex) => {
      debugger;
      const newValue = event.target.value;
      const updatedValObj = [...valObj];
      updatedValObj[rowIndex][colIndex].value = newValue;
      setValObj(updatedValObj);
    };

    const handleEdit = (rowIndex, colIndex) => {
      debugger;
      const updatedValObj = [...valObj];
      updatedValObj[rowIndex][colIndex].editable = true;
      setValObj(updatedValObj);
    };
  const handleFileUpload = (results) => {
    let ValueObject = [];

    function isNumeric(value) {
      return /^-?\d+$/.test(value);
    }
    function isPhoneNumber(value) {
      return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value);
    }
    function isMail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    const value = results.data;
    // value[0].push('Error Field');
    //================================Headers validation ======================================
    const validationHeadersArr =  Object.keys(validationHeaders);
    validationHeadersArr.map((header, i) => {
      if (value[0].indexOf(header) !== -1) {
      } else {
        setErrorLogs((oldValue) => [...oldValue, ` Column ${header} is NOT present in the file.`])
      }
    })
    //====================================================================================
    const filtered = value.filter((_, i) => i !== 0);

    console.log('value =====================', value);

    ValueObject = filtered.map((row, i) => {

      let errArr = [];

      //=====================iterate over each cell=====================
      return row.map((cell, j) => {
        console.log('value = ', value[0][j]);
        console.log('validationHeadersArr[value[0][j]] = ', validationHeaders[value[0][j]]);
        let valueObjectTemp = {}

        // console.log("isNumeric(cell) = = =", isNumeric(cell))
        let type;
        if (isNumeric(cell) === true) {
          type = 'number'
        } else {
          type = 'string'
        }
        // if (i !== 0) {
        console.log('cell =',cell, ", validationHeaders[value[0][j]] = ", validationHeaders[value[0][j]])
        if(!cell){
          valueObjectTemp['errorMessage'] = `Field is Empty`;
          valueObjectTemp['cssClass'] = 'red';

        }else if (type === validationHeaders[value[0][j]]) {
          errArr.push('noError')
          valueObjectTemp['isError'] = false;
          // valueObjectTemp['errorMessage'] = `Field is ${validationHeaders[value[0][j]]} format`;
          valueObjectTemp['cssClass'] = 'normal';
        } else {
          errArr.push('error');
          valueObjectTemp['isError'] = true;
          valueObjectTemp['errorMessage'] = `Field is not in ${validationHeaders[value[0][j]]} format`;
          valueObjectTemp['cssClass'] = 'red';

        }
        // }
        valueObjectTemp['type'] = validationHeaders[value[0][j]];
        valueObjectTemp['value'] = cell;

        return valueObjectTemp;
      });
    });

    // console.log('ValueObject = ', ValueObject)
    setValObj(ValueObject);
    console.log("errorCsv = ", errorCsv)
    setCol(value[0]);
    setVal(filtered);
  }

  // useEffect(() => {
  //   console.log("errorCsv ===============", errorCsv);
  //   // console.log("ValueObject ===============",ValueObject);
  // }, [errorCsv])
  return (
    <>
      <header className="header">
        <div className="headerTitle">
          Data Validator
        </div>
        <div className="logOutButton" onClick={() => setLoginUser({})}>
          <img src={require('./logout.svg').default} alt='mySvgImage' />
        </div>
      </header>
      <div>
        <CSVReader
          onUploadAccepted={handleFileUpload}
          config={{ worker: true }}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
            Remove,
          }) => (
            <>
              <div {...getRootProps()}>
                {acceptedFile ? (
                  <>
                    <div className="info-container uploadPanel">
                      <div className="file-info">
                        <p><b>File Name:</b> {acceptedFile.name}</p>
                        <span><b>File size:</b> {formatFileSize(acceptedFile.size)}</span>
                      </div>
                      <div className="info__progress">
                        <ProgressBar />
                      </div>
                      <div {...getRemoveFileProps()} className="info__remove">
                        <Remove color={"red"} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="uploadPanel">
                      <div>Upload your file here</div>
                      <button className="uploadButton">Upload file</button>
                    </div>
                    {
                      (!acceptedFile?.name) &&
                      <div className="info-container uploadPanel">
                        Pleaes upload your file to validate!
                      </div>
                    }
                  </div>
                )}
              </div>

              <div className="tableWraper">
                <div className="erro-wraper">
                  {errorLogs.map((errorEntry, i) => (<p className="error-logs">{i + 1}. {errorEntry}</p >))}
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      {col.length > 0 &&
                        col.map((col, i) => <th key={i}>{col}</th>)}
                    </tr>
                  </thead>
                  {/* <tbody>
                    {valObj.map((row, i) => (
                      <tr key={i}>
                        {row.map((v, j) => (
                          <td key={j} 
                          title={v.errorMessage? v.errorMessage : '' }
                          // onMouseEnter={v.errorMessage}
                          className={v.cssClass}
                          >{v.value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody> */}

<tbody>
  {valObj.map((row, rowIndex) => (
    <tr key={rowIndex}>
      {row.map((v, colIndex) => (
        <td key={colIndex} title={v.errorMessage ? v.errorMessage : ''} className={v.cssClass} onClick={()=>handleEdit(rowIndex, colIndex)} >
          {v.editable ? (
            <input
              type="text"
              value={v.value}
              onChange={(event) => handleChange(event, rowIndex, colIndex)}
              onBlur={() => handleBlur(rowIndex, colIndex)}
            />
          ) : (
            v.value
          )}
        </td>
      ))}
    </tr>
  ))}
</tbody>
                </table>
              </div>
            </>
          )}
        </CSVReader>
      </div>
    </>
  );

}