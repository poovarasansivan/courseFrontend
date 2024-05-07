import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Input,
  Label,
  Select
} from "@windmill/react-ui";
import { FaDownload } from "react-icons/fa6";
import { EditIcon } from "../icons";
import PageTitle from "../components/Typography/PageTitle";
import * as XLSX from "xlsx";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";

function Assignedcourse() {
  const [dataTable2, setDataTable2] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null); // State to store data of the row being edited
  const [editedData, setEditedData] = useState({});
  const [selectedAttribute, setSelectedAttribute] = useState(""); // State to hold selected attribute
  const [filterValue, setFilterValue] = useState(""); //
  const resultsPerPage = 8;
  const totalResults = dataTable2.length;

  const [pageTable2, setPageTable2] = useState(1);
  useEffect(() => {
    const startIndex = (pageTable2 - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    setFilteredData(dataTable2.slice(startIndex, endIndex));
  }, [pageTable2, dataTable2]);



  function handleAttributeChange(event) {
    setSelectedAttribute(event.target.value);
  }

  function handleFilterValueChange(event) {
    setFilterValue(event.target.value);
  }

  useEffect(() => {
    setFilteredData(
      dataTable2.filter((user) =>
        user[selectedAttribute]
          ? user[selectedAttribute]
              .toLowerCase()
              .includes(filterValue.toLowerCase())
          : false
      )
    );
  }, [filterValue, selectedAttribute, dataTable2]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://course-api-delta.vercel.app/overallregisteredcourse"
        );
        const data = await response.json();
        const mappedData = data.map((courseregistered) => ({
          rollno: courseregistered.rollno,
          name: courseregistered.name,
          department: courseregistered.department,
          coreSubject1: courseregistered.coreSubject1,
          coreSubject2: courseregistered.coreSubject2,
          coreSubject3: courseregistered.coreSubject3,
          coreSubject4: courseregistered.coreSubject4,
          electivecourse_1: courseregistered.electivecourse_1,
          electivecourse_2: courseregistered.electivecourse_2,
          open_electivecourse: courseregistered.open_electivecourse,
          addon_course: courseregistered.addon_course,
          honoursCourses1: courseregistered.honoursCourses1,
          honoursCourses2: courseregistered.honoursCourses2,
        }));
        setDataTable2(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  function openEditModal(rowData) {
    setRowDataToEdit(rowData); // Set the data of the row being edited
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }
  function openDeleteModal() {
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  const fileInputRef = useRef(null); // Ref for file input element

  function handleImportButtonClick() {
    fileInputRef.current.click(); // Simulate click on file input
  }
  function handleImportFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();
      if (fileExtension === "xlsx" || fileExtension === "xls") {
        try {
          const importedData = parseExcelData(event.target.result);
          console.log("Imported Excel data:", importedData);
          setDataTable2(importedData);
        } catch (error) {
          console.error("Error parsing Excel data:", error);
        }
      } else if (fileExtension === "csv") {
        try {
          const importedData = parseCSVData(event.target.result);
          console.log("Imported CSV data:", importedData);
          setDataTable2(importedData);
        } catch (error) {
          console.error("Error parsing CSV data:", error);
        }
      } else {
        console.error("Unsupported file format");
      }
    };
    reader.readAsBinaryString(file);
  }

  useEffect(() => {
    setFilteredData(
      dataTable2.filter(
        (user) =>
          (user.rollno &&
            user.rollno.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.name &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.coreSubject1 &&
            user.coreSubject1.toLowerCase().includes(
              searchTerm.toLowerCase()
            )) ||
          (user.coreSubject2 &&
            user.coreSubject2.toLowerCase().includes(
              searchTerm.toLowerCase()
            )) ||
          (user.coreSubject3 &&
            user.coreSubject3.toLowerCase().includes(
              searchTerm.toLowerCase()
            )) ||
          (user.coreSubject4 &&
            user.coreSubject4.toLowerCase().includes(
              searchTerm.toLowerCase()
            )) ||
          (user.electivecourse_1 &&
            user.electivecourse_1.toLowerCase().includes(
              searchTerm.toLowerCase()
            )) ||
          (user.electivecourse_2 &&
            user.electivecourse_2.toLowerCase().includes(
              searchTerm.toLowerCase()
            )) ||
          (user.open_electivecourse &&
            user.open_electivecourse.toLowerCase().includes(
              searchTerm.toLowerCase()
            )) ||
          (user.addon_course &&
            user.addon_course.toLowerCase().includes(
              searchTerm.toLowerCase()
            )) ||
          (user.honoursCourses1 &&
            user.honoursCourses1.toLowerCase().includes(
              searchTerm.toLowerCase()
            )) ||
          (user.honoursCourses2 &&
            user.honoursCourses2.toLowerCase().includes(
              searchTerm.toLowerCase()
            ))
      )
    );
  }, [searchTerm, dataTable2]);

  function parseExcelData(excelData) {
    const workbook = XLSX.read(excelData, { type: "binary" });
    const sheetName = workbook.SheetNames[0]; // Assuming there's only one sheet
    const sheet = workbook.Sheets[sheetName];
    // Convert the sheet data into an array of objects
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    // Assuming the first row contains headers
    const headers = data[0];
    // Start from the second row to parse data
    const parsedData = data.slice(1).map((row) => {
      const rowData = {};
      row.forEach((value, index) => {
        rowData[headers[index]] = value;
      });
      return rowData;
    });
    console.log(parsedData);
    return parsedData;
  }
  function parseCSVData(csvData) {
    const rows = csvData.split("\n"); // Split CSV data by newline to get rows
    const headers = rows[0].split(","); // Assuming the first row contains headers
    const parsedData = [];
    // Start from the second row to parse data
    for (let i = 1; i < rows.length; i++) {
      const rowData = {};
      const values = rows[i].split(",");
      // Assign each value to its corresponding header
      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });
      parsedData.push(rowData);
    }
    return parsedData;
  }

  function handleExportData() {
    let csvContent =
      "Roll no,Name,Department,CoreSubject1,CoreSubject2,CoreSubject3,CoreSubject4,ElectiveCourse1,ElectiveCourse2,OpenElective,AddonCourse,HonoursCourse1,HonoursCourse2 \n";
    dataTable2.forEach((user) => {
      // Replace null values with an empty string
      const rowValues = [
        user.rollno || "",
        user.name || "",
        user.department || "",
        user.coreSubject1 || "",
        user.coreSubject2 || "",
        user.coreSubject3 || "",
        user.coreSubject4 || "",
        user.electivecourse_1 || "",
        user.electivecourse_2 || "",
        user.open_electivecourse || "",
        user.addon_course || "Not Applicable",
        user.honoursCourses1 || "",
        user.honoursCourses2 || "Not Applicable",
      ];
      csvContent += rowValues.join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assigned_course.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleUpdate() {
    // Find the index of the row to be updated
    const rowIndex = dataTable2.findIndex(
      (row) => row.rollno === rowDataToEdit.rollno
    );
    if (rowIndex !== -1) {
      // Update the row data with edited values
      const updatedRowData = { ...dataTable2[rowIndex], ...editedData };
      const updatedDataTable = [...dataTable2];
      updatedDataTable[rowIndex] = updatedRowData;
      setDataTable2(updatedDataTable);
      closeEditModal();
      updatedDatainBackend(updatedRowData);
      console.log(updatedRowData);
      // Close the modal after updating
    }
  }

  async function updatedDatainBackend(updatedRowData) {
    try {
      const response = await fetch(
        `https://course-api-delta.vercel.app/editassignedcourse/${updatedRowData.rollno}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRowData),
        }
      );
      if (response.ok) {
        console.log("Data updated successfully");
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }
  return (
    <>
      <PageTitle>Assigned Course</PageTitle>

      <TableContainer className="mb-8">
        <div className="m-4 flex justify-between items-center">
          <div className="flex justify-start items-center">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
              <Select
              className="ml-4"
              value={selectedAttribute}
              onChange={handleAttributeChange}
            >
              <option value="">Select Attribute</option>
              <option value="rollno">Roll No</option>
              <option value="name">Name</option>
              <option value="department">Department</option>
              <option value="coreSubject1">Core Subject1</option>
              <option value="coreSubject2">Core Subject2</option>
              <option value="coreSubject3">Core Subject3</option>
              <option value="coreSubject4">Core Subject4</option>
              <option value="electivecourse_1">Elective Course 1</option>
              <option value="electivecourse_2">Elective Course 2</option>
              <option value="open_electivecourse">Open Elective Course 1</option>
              <option value="addon_course">Addon Course 1</option>
              <option value="honoursCourses1">Honours Course 1</option>
              <option value="honoursCourses2">Honours Course 2</option>
            </Select>
            <Input
              className="ml-4"
              placeholder="Enter filter value"
              value={filterValue}
              onChange={handleFilterValueChange}
            />
          </div>
          <div className="flex justify-end items-center">
            <Button onClick={handleImportButtonClick}>Import</Button>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleImportFile}
              id="import-file"
              style={{ display: "none" }}
              ref={fileInputRef} // Associate ref with file input
            />

            {/* Add a gap between import and download button */}
            <div style={{ width: "15px" }}></div>
            <Button onClick={handleExportData}>
              <FaDownload className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <hr className="border-t-1 w-full" />

        <Table>
          <TableHeader>
            <tr>
              <TableCell>S no</TableCell>
              <TableCell>Roll no</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>CoreSubject1</TableCell>
              <TableCell>CoreSubject2</TableCell>
              <TableCell>CoreSubject3</TableCell>
              <TableCell>CoreSubject4</TableCell>
              <TableCell>ElectiveCourse1</TableCell>
              <TableCell>ElectiveCourse2</TableCell>
              <TableCell>OpenElective</TableCell>
              <TableCell>AddonCourse</TableCell>
              <TableCell>HonoursCourse1</TableCell>
              <TableCell>HonoursCourse2</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {filteredData.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  {" "}
                  <span className="text-sm">
                    {(pageTable2 - 1) * resultsPerPage + i + 1}
                  </span>
                </TableCell>{" "}
                {/* Calculate S.no */}
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{user.rollno}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.department}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.coreSubject1}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.coreSubject2}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.coreSubject3}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.coreSubject4}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.electivecourse_1}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.electivecourse_2}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.open_electivecourse}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {user.addon_course
                      ? user.addon_course
                      : "Not Applicable"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {user.honoursCourses1
                      ? user.honoursCourses1
                      : "Not Applicable"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {user.honoursCourses2
                      ? user.honoursCourses2
                      : "Not Applicable"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                      onClick={() => openEditModal(user)}
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    {/* <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={openDeleteModal}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
      <div></div>
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Assigned Course Details</ModalHeader>
        <ModalBody className="overflow-y-auto max-h-22">
          {rowDataToEdit && (
            <>
              <p>Student Rollno : {rowDataToEdit.rollno}</p>

              <Label className="mt-4">
                <span>ElectiveCourse1</span>
                <Input
                  className="mt-1"
                  name="electivecourse_1"
                  placeholder="XML Web Services"
                  value={editedData.electivecourse_1 || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>ElectiveCourse2</span>
                <Input
                  className="mt-1"
                  name="electivecourse_2"
                  placeholder="Modern Cryptography"
                  value={editedData.electivecourse_2 || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>OpenElective</span>
                <Input
                  className="mt-1"
                  name="open_electivecourse"
                  placeholder="Java Fundamentals"
                  value={editedData.open_electivecourse || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>AddonCourse</span>
                <Input
                  className="mt-1"
                  name="addon_course"
                  placeholder="Digital Marketing"
                  value={editedData.addon_course || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>HonoursCourse1</span>
                <Input
                  className="mt-1"
                  name="honoursCourses1"
                  placeholder="Big Data Analytics"
                  value={editedData.honoursCourses1 || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>HonoursCourse2</span>
                <Input
                  className="mt-1"
                  name="honoursCourses2"
                  placeholder="Cloud Computing"
                  value={editedData.honoursCourses2 || ""}
                  onChange={handleInputChange}
                />
              </Label>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeEditModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={handleUpdate}>Accept</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              layout="outline"
              onClick={closeEditModal}
            >
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleUpdate}>
              Update
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalHeader>Student Deletion</ModalHeader>
        <ModalBody>Your Deleting student Data</ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button>Delete</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              layout="outline"
              onClick={closeDeleteModal}
            >
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large">
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Assignedcourse;
