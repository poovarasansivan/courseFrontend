import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
  Input,
} from "@windmill/react-ui";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaDownload } from "react-icons/fa6";
import { EditIcon, TrashIcon } from "../icons";
import PageTitle from "../components/Typography/PageTitle";
import * as XLSX from "xlsx";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";
import { Label, Select } from "@windmill/react-ui";

const coursetype = [
  "CoreSubject",
  "Elective Course",
  "Open Elective Course",
  "Addon Course",
  "Honours Course",
  "Minors Course",
];

function Tables() {
  const [dataTable2, setDataTable2] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState(""); // State to hold selected attribute
  const [filterValue, setFilterValue] = useState(""); //

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState(null); // State to store data of the row being edited
  const [editedData, setEditedData] = useState({}); // State
  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [selectedCourseType, setSelectedCourseType] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseFaculty, setCourseFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");

  const resultsPerPage = 8;
  const totalResults = dataTable2.length;

  const [pageTable2, setPageTable2] = useState(1);

  useEffect(() => {
    fetchOverallCourseData();
  }, []);
  
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

  function addStudentModalOpen() {
    setAddStudentModalOpen(true);
  }
  function closeaddStudentModalOpen() {
    setAddStudentModalOpen(false);
  }
  const handleCourseNameChange = (e) => {
    setCourseName(e.target.value);
  };
  const handleCourseIdChange = (e) => {
    setCourseId(e.target.value);
  };
  const handleCourseFacultyChange = (e) => {
    setCourseFaculty(e.target.value);
  };
  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };
  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
  };
  const handleCourseTypeChange = (e) => {
    setSelectedCourseType(e.target.value);
  };
  console.log(selectedCourseType);
  const handleformsubmit = async () => {
    try {
      let apiUrl;
      // Determine the API endpoint based on the selected course type
      if (selectedCourseType == "CoreSubject") {
        apiUrl = "http://localhost:5555/addcoresubject";
      } else if (selectedCourseType == "Elective Course") {
        apiUrl = "http://localhost:5555/addelectivesubject";
      } else if (selectedCourseType == "Open Elective Course") {
        apiUrl = "http://localhost:5555/addopenelectivesubject";
      } else if (selectedCourseType == "Addon Course") {
        apiUrl = "http://localhost:5555/addonCourseSubject";
      } else if (selectedCourseType == "Honours Course") {
        apiUrl = "http://localhost:5555/AddHonours";
      } else if (selectedCourseType == "Minors Course") {
        apiUrl = "http://localhost:5555/AddMinours";
      } else {
        console.error("Invalid course type");
        return;
      }

      const newCourse = {
        course_id: courseId,
        course_name: courseName,
        course_faculty: courseFaculty,
        department: department,
        semester: semester,
        courseType: selectedCourseType,
      };
      console.log(newCourse);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([newCourse]), // Passing an array containing newCourse
      });

      if (response.ok) {
        console.log("Form Data sent successfully");
        closeaddStudentModalOpen();
      } else {
        console.error("Failed to send form data");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
    }
  };

  async function fetchOverallCourseData() {
    try {
      const response = await fetch("http://localhost:5555/coursemaster");
      const data = await response.json();
      const mappedData = data.courses.map((course) => ({
        course_id: course.course_id,
        course_name: course.course_name,
        course_faculty: course.course_faculty,
        department: course.department,
        semester: course.semester,
        coursetype: course.coursetype,
      }));

      setDataTable2(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    setFilteredData(
      dataTable2.filter(
        (user) =>
          (user.course_id &&
            user.course_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.course_name &&
            user.course_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.course_faculty &&
            user.course_faculty
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (String(user.semester) && // Ensure semester is treated as a string
            String(user.semester)
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.coursetype &&
            user.coursetype.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, dataTable2]);

  useEffect(() => {
    const startIndex = (pageTable2 - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    setFilteredData(dataTable2.slice(startIndex, endIndex));
  }, [pageTable2, resultsPerPage, dataTable2]);


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
      "Course ID,Course Name,Course Faculty Name,Department,Semester,Coursetype\n";
    dataTable2.forEach((user) => {
      if (
        user.course_id &&
        user.course_name &&
        user.course_faculty &&
        user.department &&
        user.semester &&
        user.coursetype
      ) {
        csvContent += `${user.course_id},${user.course_name},${user.course_faculty},${user.department},${user.semester},${user.coursetype}\n`;
      }
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "course_details.csv";
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

  async function handleUpdate() {
    const rowIndex = dataTable2.findIndex(
      (row) => row.course_id === rowDataToEdit.course_id
    ); // Assuming course_id is the unique identifier
    if (rowIndex !== -1) {
      const updatedRowData = { ...dataTable2[rowIndex], ...editedData };
      const updatedDataTable = [...dataTable2];
      updatedDataTable[rowIndex] = updatedRowData;
      setDataTable2(updatedDataTable);
      closeEditModal();
      let apiUrl;
      if (updatedRowData.coursetype === "Coresubject") {
        apiUrl = "http://localhost:5555/editcoresubject";
      } else if (updatedRowData.coursetype === "Addon Course") {
        apiUrl = "http://localhost:5555/editaddoncourse";
      } else if (updatedRowData.coursetype === "Elective Course") {
        apiUrl = "http://localhost:5555/editelective";
      } else if (updatedRowData.coursetype === "Openelective Course") {
        apiUrl = "http://localhost:5555/editopenelective";
      } else if (updatedRowData.coursetype === "Honours Course") {
        apiUrl = "http://localhost:5555/edithonours";
      } else {
        apiUrl = "http://localhost:5555/editminours";
      }
      updateDataInBackend(updatedRowData, apiUrl);
    }
  }

  async function updateDataInBackend(updatedRowData, apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/${updatedRowData.course_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRowData),
      });
      if (response.ok) {
        console.log("Data updated successfully");
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }

  function openEditModal(rowData) {
    setRowDataToEdit(rowData); // Set the data of the row being edited
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  function openDeleteModal(user) {
    setRowDataToEdit(user); // Set the data of the row being deleted
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }
  function handleAttributeChange(event) {
    setSelectedAttribute(event.target.value);
  }

  function handleFilterValueChange(event) {
    setFilterValue(event.target.value);
  }

  return (
    <>
      <PageTitle>Course Master</PageTitle>

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
            <option value="course_id">Course ID</option>
            <option value="course_name">Course Name</option>
            <option value="course_faculty">Course Faculty</option>
            <option value="department">Department</option>
            <option value="semester">Semester</option>
            <option value="coursetype">Course Type</option>
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
            <div style={{ width: "15px" }}></div>
            <Button onClick={addStudentModalOpen}>
              <IoIosAddCircleOutline className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <hr className="border-t-1 w-full" />

        <Table>
          <TableHeader>
            <tr>
              <TableCell>S no</TableCell>
              <TableCell>Course ID</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Course Type</TableCell>
              <TableCell>Actions</TableCell>
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
                      <p className="font-semibold">{user.course_id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.course_name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.department}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">Semester {user.semester}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.coursetype}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                      onClick={() => openEditModal(user)} // Pass the row data to the edit modal
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    {/* <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => openDeleteModal(user)} // Pass the row data to the delete modal
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
        <ModalHeader>Course Details</ModalHeader>
        <ModalBody>
          {rowDataToEdit && (
            <>
              <p>Course ID: {rowDataToEdit.course_id}</p>
              <p>Course Name: {rowDataToEdit.course_name}</p>
              <Label className="mt-4">
                <span>Course Name</span>
                <Input
                  className="mt-1"
                  name="course_name"
                  placeholder="Computer Architecture"
                  value={editedData.course_name || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Course Faculty</span>
                <Input
                  className="mt-1"
                  name="course_faculty"
                  placeholder="Poovarasan"
                  value={editedData.course_faculty || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Department</span>
                <Input
                  className="mt-1"
                  name="department"
                  placeholder="CSE"
                  value={editedData.department || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Semester</span>
                <Input
                  className="mt-1"
                  name="semester"
                  placeholder="6"
                  value={editedData.semester || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Course Type</span>
                <Input
                  className="mt-1"
                  name="coursetype"
                  placeholder="Coresubject"
                  value={editedData.coursetype || ""}
                  onChange={handleInputChange}
                />
              </Label>
              {/* Add input fields for editing */}
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
      {/* <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalHeader>Course Deletion</ModalHeader>
        <ModalBody>Your Deleting Course Data</ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={handleDelete}>Delete</Button>
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
            <Button block size="large" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </ModalFooter>
      </Modal> */}
      <Modal isOpen={isAddStudentModalOpen} onClose={closeaddStudentModalOpen}>
        <ModalHeader>Add Course Details</ModalHeader>
        <ModalBody>
          <>
            <Label className="mt-4">
              <span>Course ID</span>
              <Input
                name="course_id"
                className="mt-1"
                placeholder="18CS202"
                value={courseId}
                onChange={handleCourseIdChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Course Name</span>
              <Input
                name="course_name"
                className="mt-1"
                placeholder="Physics"
                value={courseName}
                onChange={handleCourseNameChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Course Faculty</span>
              <Input
                name="course_faculty"
                className="mt-1"
                placeholder="Sathish P"
                value={courseFaculty}
                onChange={handleCourseFacultyChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Department</span>
              <Input
                name="department"
                className="mt-1"
                placeholder="CSE"
                value={department}
                onChange={handleDepartmentChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Semester</span>
              <Input
                name="semester"
                className="mt-1"
                placeholder="6"
                value={semester}
                onChange={handleSemesterChange}
              />
            </Label>
            <div className="mt-4">
              <Label>Course Type</Label>
              <div className="mt-2">
                <Select
                  className="mt-1"
                  value={selectedCourseType}
                  onChange={handleCourseTypeChange}
                  name="coursetype" // Add name attribute to the Select component
                >
                  <option value="">Select Course</option>
                  {coursetype.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeaddStudentModalOpen}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={handleformsubmit}>Add Student</Button>
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
    </>
  );
}

export default Tables;
