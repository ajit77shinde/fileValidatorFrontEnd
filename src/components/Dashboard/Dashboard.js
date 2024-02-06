import React, { useState } from "react";
import { useCSVReader, formatFileSize } from "react-papaparse";
// import csv from "csvtojson";
import axios from "axios";
import "./dashboard.css";

export default function Dashboard({ setLoginUser }) {
  const { CSVReader } = useCSVReader();
  const [col, setCol] = useState([]);
  const [val, setVal] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [errorCsv, setErrorCsv] = useState([]);

  const validationHeaders = [
    ["GROUP NAME*", "string"],
    ["GROUP NUM*\n(nnnnnn)", "string"],
    ["SUB-GROUP NUM*\n(nnnnnn)", "string"],
    ["LAST NAME*\n**Must be entered on all family members (No punctuation)", "string"],
    ["FIRST NAME*             (No punctuation)", "string"],
    ["M/I", "Number"],
    ["Suffix", "Number"],
    ["DATE OF\nBIRTH*\n(yyyymmdd)", "Number"],
    ["MOBILE PHONE \n(no hypens)", "Number"],
    ["HOME PHONE\n(no hyphens)", "Number"],
    ["Work Phone\n(No hyphens)", "Number"],
    ["Email Address", "Number"],
    ["GENDER*\n(M / F)", "Number"],
    ["Subscriber SSN*", "Number"],
    ["MEMBER SSN \n(no hyphens)", "Number"],
    ["MAILING ADDRESS LINE 1*                              (No punctuation)", "Number"],
    ["MAILING ADDRESS LINE 2 (No puctuation)", "Number"],
    ["CITY*", "Number"],
    ["STATE*", "Number"],
    ["ZIP*", "Number"],
    ["Correspondence Addr Ln 1", "Number"],
    ["Correspondence Addr Ln 2", "Number"],
    ["Correspondence City*", "Number"],
    ["Correspondence State*", "Number"],
    ["Correspondence Zip*", "Number"],
    ["RELATIONSHIP* \n**Must List Employee first, then family members**", "Number"],
    ["PCP SELECTION*", "Number"],
    ["MEDICAL PLAN*", "Number"],
    ["MEDICAL BEGIN DATE*\n(yyyymmdd)", "Number"],
    ["MEDICAL END DATE*\n(yyyymmdd)", "Number"],
    ["ACU/CHIRO PLAN*", "Number"],
    ["ACU/CHIRO BEGIN DATE*\n(yyyymmdd)", "Number"],
    ["ACU/CHIRO END DATE*\n(yyyymmdd)", "Number"],
    ["DENTAL PLAN*", "Number"],
    ["DENTAL BEGIN DATE*\n(yyyymmdd)", "Number"],
    ["DENTAL END DATE*\n(yyyymmdd)", "Number"],
    ["VISION PLAN*", "Number"],
    ["VISION BEGIN DATE*\n(yyyymmdd)", "Number"],
    ["VISION END DATE*\n(yyyymmdd)", "Number"],
    ["Infertility Plan[", "Number"],
    ["Infertility Begin Date (yyyymmdd)", "Number"],
    ["Infertility End Date (yyyymmdd)", "Number"],
    ["Original Effective Date", "Number"],
    ["Language", "Number"],
    ["Existing patient of PCP?\n(not loaded)", "Number"],
    ["COMMENTS\n(Not loaded into system)"]
  ]
  const handleFileUpload = (results) => {
    const value = results.data;
    // value[0].push('Error Field');
    validationHeaders.map((header, i) => {
      if (value[0].indexOf(header[0]) !== -1) {
      } else {
        setErrorLogs((oldValue) => [...oldValue, ` Column ${header} is NOT present in the file.`])
      }
    })
    const filtered = value.filter((_, i) => i !== 0);
    console.log('value =====================', value);
    value.map(async (row, i) => {
      // console.log("validationHeaders = = ",validationHeaders[i][1] )
      let errArr = []
      row.map(async (cell, j) => {
        if (i !== 0) {
          console.log('cell =', typeof (cell) === validationHeaders[j][1])
          if (typeof (cell) === validationHeaders[j][1]) {
            errArr.push('noError')
          } else {
            errArr.push('error')
          }
        }
      });
      // debugger;
      // console.log(`${cell}  ${i} ${j}`)
      console.log("errArr = ",errArr)
      setErrorCsv((oldValue) => [...oldValue, errArr]);

    })
    // debugger;
    
    // const filterederrorCsv = errorCsv?.filter((_, i) => i !== 0);
    console.log("errorCsv = ", errorCsv)

    setCol(value[0]);
    setVal(filtered);
    // setErrorCsv(filterederrorCsv)

    // console.log("filtered = ", filterederrorCsv)
  }
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
      <body>
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
                    <tbody>
                      {val.map((val, i) => (
                        <tr key={i}>
                          {val.map((v, j) => (
                            <td key={j} className={errorCsv[i][j]}>{v}</td>
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

      </body>

    </>
  );

}
