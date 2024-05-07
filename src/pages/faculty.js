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
import { FaDownload } from "react-icons/fa6";
import { EditIcon, TrashIcon } from "../icons";
import { IoIosAddCircleOutline } from "react-icons/io";
import PageTitle from "../components/Typography/PageTitle";
import response from "../utils/demo/tableData";
import * as XLSX from "xlsx";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";
import { Label,Select } from "@windmill/react-ui";

function Tables() {
  const [dataTable2, setDataTable2] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddFacultyModalOpen, setAddFacultyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(""); // State to hold selected attribute
  const [filterValue, setFilterValue] = useState(""); //
  const [rowDataToEdit, setRowDataToEdit] = useState(null); // State to store data of the row being edited
  const [editedData, setEditedData] = useState({}); // State to track edited data
  const [formData, setFormData] = useState({
    faculty_id: "",
    faculty_name: "",
    email: "",
    department: "",
    level: "",
    course: "",
  });
  

  const resultsPerPage = 8;
  const totalResults = dataTable2.length;

  const [pageTable2, setPageTable2] = useState(1);

  function openEditModal(rowData) {
    setRowDataToEdit(rowData); // Set the data of the row being edited
    setIsEditModalOpen(true);
  }
  function addFacultyModalOpen() {
    setAddFacultyModalOpen(true);
  }
  function closeAddFacultyModal() {
    setAddFacultyModalOpen(false);
  }
  function closeEditModal() {
    setIsEditModalOpen(false);
  }

  function openDeleteModal(user) {
    setRowDataToEdit(user);
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
    fetchOverallFacultyData();
  }, []);

  async function fetchOverallFacultyData() {
    try {
      const response = await fetch("http://localhost:5555/getfaculty");
      const data = await response.json();
      const mappedData = data.map((faculty) => ({
        faculty_id: faculty.faculty_id,
        faculty_name: faculty.faculty_name,
        email: faculty.email,
        department: faculty.department,
        level: faculty.level,
        course: faculty.course,
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
          (user.faculty_id &&
            user.faculty_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.faculty_name &&
            user.faculty_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.level &&
            user.level.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.course &&
            user.course.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, dataTable2]);

  useEffect(() => {
    const startIndex = (pageTable2 - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    setFilteredData(dataTable2.slice(startIndex, endIndex));
  }, [pageTable2, dataTable2]);

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
          setDataTable2(importedData);
        } catch (error) {
          console.error("Error parsing Excel data:", error);
        }
      } else if (fileExtension === "csv") {
        try {
          const importedData = parseCSVData(event.target.result);
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
    // Logic to export data as a CSV file
    // This depends on the format of your data and how you want to export it
    // Example logic:
    let csvContent = "Faculty ID,Name,Email,Department,Level,Assigned Course\n";
    dataTable2.forEach((user) => {
      // Check if user object has all required properties
      if (
        user.faculty_id &&
        user.faculty_name &&
        user.email &&
        user.department &&
        user.level &&
        user.course
      ) {
        csvContent += `${user.faculty_id},${user.faculty_name},${user.email},${user.department},${user.level},${user.course}\n`;
      }
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Faculty_details.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  // console.log(dataTable2);
  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  function handleInputAddChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }  

  function handleUpdate() {
    // Find the index of the row to be updated
    const rowIndex = dataTable2.findIndex((row) => row.faculty_id === rowDataToEdit.faculty_id); // Use "id" as the key
    if (rowIndex !== -1) {
      // Update the row data with edited values
      const updatedRowData = { ...dataTable2[rowIndex], ...editedData };
      const updatedDataTable = [...dataTable2];
      updatedDataTable[rowIndex] = updatedRowData;
      setDataTable2(updatedDataTable);
      closeEditModal(); // Close the modal after updating
      updateDataInBackend(updatedRowData);
    }
  }
  async function updateDataInBackend(updatedRowData) {
    try {
      const response = await fetch(
        `http://localhost:5555/editfaculty/${updatedRowData.faculty_id}`,
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

  async function handleDelete() {
    try{
      const response = await fetch(
        `http://localhost:5555/deletefaculty/${rowDataToEdit.faculty_id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("Data deleted successfully");
        const updatedDataTable = dataTable2.filter(
          (row) => row.faculty_id !== rowDataToEdit.faculty_id
        );
        setDataTable2(updatedDataTable);
        closeDeleteModal(); // Close the modal after deletion
      } else {
        console.error("Failed to delete data");
      }
    }
 catch (error) {
    console.error("Error deleting data:", error);
  }
  }

  const handleformsubmit = async () => {
    console.log(formData)
    try {
      const response = await fetch("http://localhost:5555/addfaculty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([formData]),
      });
      if (response.ok) {
        console.log("Form Data sent successfully");
        closeAddFacultyModal();
      } else {
        console.error("Failed to send form data");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
    }
  };
  return (
    <>
      <PageTitle>Faculty Master</PageTitle>

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
              <option value="faculty_id">Faculty ID</option>
              <option value="faculty_name">Faculty Name</option>
              <option value="email">Email</option>
              <option value="department">Department</option>
              <option value="level">Level Of Proficiency</option>
              <option value="course">Assignedcourse</option>
             
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
            <Button onClick={addFacultyModalOpen}>
              <IoIosAddCircleOutline className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <hr className="border-t-1 w-full" />

        <Table>
          <TableHeader>
            <tr>
              <TableCell>S no</TableCell>
              <TableCell>Faculty Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Level Of Proficiency </TableCell>
              <TableCell>Assignedcourse</TableCell>
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
                      <p className="font-semibold">{user.faculty_id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.faculty_name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.department}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.level}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.course}</span>
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
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => openDeleteModal(user)} // Pass the row data to the delete modal
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
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
        <ModalHeader>Faculty Details</ModalHeader>
        <ModalBody>
          {/* Display the row data in the modal */}
          {rowDataToEdit && (
            <>
              <p>{rowDataToEdit.faculty_id}</p>
              <p>{rowDataToEdit.faculty_name}</p>
              <p>{rowDataToEdit.email}</p>
              <p>{rowDataToEdit.department}</p>

              <Label className="mt-4">
                <span>Course</span>
                <Input
                  className="mt-1"
                  name="course"
                  placeholder="CSE"
                  value={editedData.course || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Level Of Proficiency</span>
                <Input
                  className="mt-1"
                  name="level"
                  placeholder="AP level 3"
                  value={editedData.level || ""}
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
      <Modal isOpen={isAddFacultyModalOpen} onClose={closeAddFacultyModal}>
        <ModalHeader>Add Faculty Details</ModalHeader>
        <ModalBody>
          <>
            <Label className="mt-4">
              <span>Faculty ID</span>
              <Input
                name="faculty_id"
                className="mt-1"
                placeholder="18CS023"
                value={formData.faculty_id}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Name</span>
              <Input
                name="faculty_name"
                className="mt-1"
                placeholder="Poovarasan"
                value={formData.faculty_name}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Email</span>
              <Input
                name="email"
                className="mt-1"
                placeholder="abc@bitsathy.ac.in"
                value={formData.email}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Department</span>
              <Input
                name="department"
                className="mt-1"
                placeholder="CSE"
                value={formData.department}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Level Of Proficiency</span>
              <Input
                name="level"
                className="mt-1"
                placeholder="Ap level 1"
                value={formData.level}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Assigned Course</span>
              <Input
                name="course"
                className="mt-1"
                placeholder="DataBase Management"
                value={formData.course}
                onChange={handleInputAddChange}
              />
            </Label>{" "}
          </>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeAddFacultyModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={handleformsubmit}>Add Faculty</Button>
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
        <ModalHeader>Faculty Deletion</ModalHeader>
        <ModalBody>Your Deleting Faculty Data</ModalBody>
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
      </Modal>
    </>
  );
}

export default Tables;
