import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Input, Label, Select } from "@windmill/react-ui";
import { Button } from "@windmill/react-ui";


function Forms() {
  const [selectedCourse1, setSelectedCourse1] = useState("");
  const [selectedCourse2, setSelectedCourse2] = useState("");
  const [openElective, setOpenElective] = useState("");
  const [addonCourse, setAddonCourse] = useState("");
  const [electiveCourseOptions, setElectiveCourseOptions] = useState([]);
  const [openElectiveCourseOptions, setOpenElectiveCourseOptions] = useState([]);
  const [addonCourseOptions, setAddonCourseOptions] = useState([]);
  const semester = sessionStorage.getItem("semester");
  const encodedDepartment = encodeURIComponent(sessionStorage.getItem("department"));

  useEffect(() => {
    if (semester && encodedDepartment) {
      fetchElectiveCourseOptions(semester, encodedDepartment);
      fetchOpenElectiveCourseOptions(semester, encodedDepartment);
      fetchAddonCourseOptions(semester, encodedDepartment);
    }
  }, [semester, encodedDepartment]);

  const handleCourseChange = (courseIndex, courseValue) => {
    if (courseIndex === 1) {
      setSelectedCourse1(courseValue);
    } else if (courseIndex === 2) {
      setSelectedCourse2(courseValue);
    }
  };

  const handleOpenElectiveChange = (e) => {
    setOpenElective(e.target.value);
  };

  const handleAddonCourseChange = (e) => {
    setAddonCourse(e.target.value);
  };

  const fetchElectiveCourseOptions = async (semester, encodedDepartment) => {
    try {
      const response = await fetch(`https://course-api-delta.vercel.app/electivecourseoption/${semester}/${encodedDepartment}`);
      if (response.ok) {
        const data = await response.json();
        const courseNames = data.map((course) => course.course_name);
        setElectiveCourseOptions(courseNames);
      } else {
        console.error("Failed to fetch elective course options");
      }
    } catch (error) {
      console.error("Error fetching elective course options:", error);
    }
  };

  const fetchOpenElectiveCourseOptions = async (semester, encodedDepartment) => {
    try {
      const response = await fetch(`https://course-api-delta.vercel.app/openelectiveoption/${semester}/${encodedDepartment}`);
      if (response.ok) {
        const data = await response.json();
        const courseNames = data.map((course) => course.course_name);
        setOpenElectiveCourseOptions(courseNames);
      } else {
        console.error("Failed to fetch open elective course options");
      }
    } catch (error) {
      console.error("Error fetching open elective course options:", error);
    }
  };

  const fetchAddonCourseOptions = async (semester, encodedDepartment) => {
    try {
      const response = await fetch(`https://course-api-delta.vercel.app/addoncourseoption/${semester}/${encodedDepartment}`);
      if (response.ok) {
        const data = await response.json();
        const courseNames = data.map((course) => course.course_name);
        setAddonCourseOptions(courseNames);
      } else {
        console.error("Failed to fetch addon course options");
      }
    } catch (error) {
      console.error("Error fetching addon course options:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Form data to submit
      const newRegistration = {
        rollno: sessionStorage.getItem("rollno"),
        name: sessionStorage.getItem("name"),
        academic_year: sessionStorage.getItem("batch"),
        semester: sessionStorage.getItem("semester"),
        department: sessionStorage.getItem("department"),
        honours: sessionStorage.getItem("honours"),
        electivecourse_1: selectedCourse1,
        electivecourse_2: selectedCourse2,
        open_electivecourse: openElective,
        addon_course: addonCourse,
        minours: sessionStorage.getItem("minours"),
      };

      const response = await fetch("https://course-api-delta.vercel.app/registerCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRegistration),
      });

      if (response.ok) {
        console.log("Form submitted successfully");
        setSelectedCourse1("");
        setSelectedCourse2("");
        setOpenElective("");
        setAddonCourse("");
      } else {
        console.error("Failed to submit form");
        // Handle error
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error
    }
  };

  return (
    <>
      <PageTitle>Course Registration</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="mt-4">
          <Label>Elective Course 1</Label>
          <div className="mt-2">
            <Select
              className="mt-1"
              value={selectedCourse1}
              onChange={(e) => handleCourseChange(1, e.target.value)}
            >
              <option value="">Select Course</option>
              {electiveCourseOptions.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Label>Elective Course 2</Label>
          <div className="mt-2">
            <Select
              className="mt-1"
              value={selectedCourse2}
              onChange={(e) => handleCourseChange(2, e.target.value)}
            >
              <option value="">Select Course</option>
              {electiveCourseOptions
                .filter((course) => course !== selectedCourse1) // Filter out the selected course for Elective Course 1
                .map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label>Open Elective Course</Label>
          <div className="mt-2">
            <Select
              className="mt-1"
              value={openElective}
              onChange={handleOpenElectiveChange}
            >
              <option value="">Select Course</option>
              {openElectiveCourseOptions.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {sessionStorage.getItem("honours") === "NO" &&
          sessionStorage.getItem("minours") === "NO" &&
          addonCourseOptions.length > 0 && (
            <div className="mt-4">
              <Label>Addon Course</Label>
              <div className="mt-2">
                <Select
                  className="mt-1"
                  value={addonCourse}
                  onChange={handleAddonCourseChange}
                >
                  <option value="">Select Course</option>
                  {addonCourseOptions.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}

        <div className="mt-5">
          <Button onClick={handleSubmit}>Register</Button>
        </div>
      </div>
    </>
  );
}

export default Forms;
