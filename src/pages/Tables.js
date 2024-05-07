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
  const [formData, setFormData] = useState({
    rollno: "",
    name: "",
    email: "",
    department: "",
    batch: "",
    semester:"",
    year:"",
    sgpa:"",
    arrears:""
  });

  const resultsPerPage = 8;
  const totalResults = dataTable2.length;

  const [pageTable2, setPageTable2] = useState(1);

  useEffect(() => {
    fetchOverallStudentData();
  }, []);
  function addStudentModalOpen() {
    setAddStudentModalOpen(true);
  }
  function closeaddStudentModalOpen() {
    setAddStudentModalOpen(false);
  }

  const handleformsubmit = async () => {
    try {
      const response = await fetch("https://course-api-delta.vercel.app/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  async function fetchOverallStudentData() {
    try {
      const response = await fetch("https://course-api-delta.vercel.app/getdata");
      const data = await response.json();
      const mappedData = data.map((student) => ({
        rollno: student.rollno,
        name: student.name,
        email: student.email,
        department: student.department,
        batch: student.batch,
        semester: student.semester,
        year: student.year,
        sgpa:student.sgpa,
        arrears:student.arrears
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
          (user.rollno &&
            user.rollno.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.name &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.batch &&
            user.batch.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.semester &&
            user.semester.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.year &&
            user.year.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.sgpa &&
              user.sgpa.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (user.arrears &&
                user.arrears.toLowerCase().includes(searchTerm.toLowerCase()))
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
    let csvContent = "Roll no,Name,Email,Department,Batch,Semester,Year\n";
    dataTable2.forEach((user) => {
      if (
        user.rollno &&
        user.name &&
        user.email &&
        user.department &&
        user.batch &&
        user.semester &&
        user.year &&
        user.sgpa &&
        user.arrears
      ) {
        csvContent += `${user.rollno},${user.name},${user.email},${user.department},${user.batch},${user.semester},${user.year},${user.sgpa},${user.arrears}\n`;
      }
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_details.csv";
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
  
  function handleInputAddChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
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
      // Close the modal after updating
      closeEditModal();
      // Send the updated data to the backend
      updateDataInBackend(updatedRowData);
    }
  }

  async function updateDataInBackend(updatedRowData) {
    try {
      const response = await fetch(
        `https://course-api-delta.vercel.app/userupdate/${updatedRowData.rollno}`,
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
    try {
      const response = await fetch(
        `https://course-api-delta.vercel.app/deleteuser/${rowDataToEdit.rollno}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("Data deleted successfully");
        const updatedDataTable = dataTable2.filter(
          (row) => row.rollno !== rowDataToEdit.rollno
        );
        setDataTable2(updatedDataTable);
        closeDeleteModal(); // Close the modal after deletion
      } else {
        console.error("Failed to delete data");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
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
  // var name = sessionStorage.getItem('name')
  // console.log(name);
  return (
    <>
      <PageTitle>Student Master</PageTitle>

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
              <option value="email">Email</option>
              <option value="department">Department</option>
              <option value="semester">Semester</option>
              <option value="sgpa">SGPA</option>
              <option value="arrears">Arrears</option>
              <option value="year">Year</option>
              <option value="batch">Batch</option>
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
            <Button className="bg-red-color text-white hover:bg-red-color-dark" onClick={handleExportData}>
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
              <TableCell>Roll no</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>SGPA</TableCell>
              <TableCell>Arrears</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Status</TableCell>
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
                      <p className="font-semibold">{user.rollno}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.department}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.semester}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.sgpa}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.arrears}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.year}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.batch}</span>
                </TableCell>
                <TableCell>
                  <Badge type="success">Active</Badge>
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
        <ModalHeader>Student Details</ModalHeader>
        <ModalBody>
          {/* Display the row data in the modal */}
          {rowDataToEdit && (
            <>
              <p>{rowDataToEdit.rollno}</p>
              <p>{rowDataToEdit.name}</p>
              <p>{rowDataToEdit.email}</p>
              <p>{rowDataToEdit.department}</p>
              <p>{rowDataToEdit.batch}</p>
              <Label className="mt-4">
                <span>Name</span>
                <Input
                  className="mt-1"
                  name="name"
                  placeholder="Poovarasan"
                  value={editedData.name || ""}
                  onChange={handleInputChange}
                />
              </Label>
              <Label className="mt-4">
                <span>Email</span>
                <Input
                  className="mt-1"
                  name="email"
                  placeholder="poovarasan@bitsathy"
                  value={editedData.email || ""}
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
                <span>Year</span>
                <Input
                  className="mt-1"
                  name="year"
                  placeholder="III"
                  value={editedData.year || ""}
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
      <Modal isOpen={isAddStudentModalOpen} onClose={closeaddStudentModalOpen}>
        <ModalHeader>Add Student Details</ModalHeader>
        <ModalBody>
          <>
            <Label className="mt-4">
              <span>Roll No</span>
              <Input
                name="rollno"
                className="mt-1"
                placeholder="7376211CS239"
                value={formData.rollno}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Name</span>
              <Input
                name="name"
                className="mt-1"
                placeholder="Poovarasan"
                value={formData.name}
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
              <span>Semester</span>
              <Input
                name="semester"
                className="mt-1"
                placeholder="6"
                value={formData.semester}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Year</span>
              <Input
                name="year"
                className="mt-1"
                placeholder="III"
                value={formData.year}
                onChange={handleInputAddChange}
              />
            </Label>
            <Label className="mt-4">
              <span>Batch</span>
              <Input
                name="batch"
                className="mt-1"
                placeholder="2025"
                value={formData.batch}
                onChange={handleInputAddChange}
              />
            </Label>{" "}
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
