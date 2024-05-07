import React, { useState, useEffect} from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Card, CardBody } from "@windmill/react-ui";
import RoundIcon from "../components/RoundIcon";
import { GrTechnology } from "react-icons/gr";
import { FaBook, FaCode, FaDatabase } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";

const curriculum = [
  {
    id: 1,
    icon: FaDatabase,
    name: "Database Management Systems",
    faculty: "John Doe",
  },
  {
    id: 2,
    icon: FaCode,
    name: "Data Structures",
    faculty: "John Doe",
  },
  {
    id: 3,
    icon: FaBook,
    name: "Computer Architecture",
    faculty: "John Doe",
  },
  {
    id: 4,
    icon: GrTechnology,
    name: "Internet Of Things",
    faculty: "John Doe",
  },
];

function Mycourse() {
  const rollno = "7376211CS239";
  const semester = "6";
  const [assignedcoursedata, setAssignedcoursedata] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://course-api-delta.vercel.app/myassignedcourse/${rollno}/${semester}`
        );
        const data = await response.json();
        const { assignedcourses } = data;
        
        // Extract the course names
        const courseNames = {
          core_1: assignedcourses[0].course_name1,
          core_2: assignedcourses[0].course_name2,
          core_3: assignedcourses[0].course_name3,
          core_4: assignedcourses[0].course_name4,
          elective_1: assignedcourses[0].electivecourse_1,
          elective_2: assignedcourses[0].electivecourse_2,
          open_elective: assignedcourses[0].open_electivecourse,
          addon_course: assignedcourses[0].addon_course,
        };
  
        setAssignedcoursedata(courseNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  
  return (
    <>
      <PageTitle>My Course</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(assignedcoursedata).map(([key, value]) => (
          <Card key={key}>
            <CardBody className="flex flex-col items-center">
              <RoundIcon
                icon={getIcon(key)}
                iconColorClass="text-orange-500 dark:text-orange-100"
                bgColorClass="bg-orange-100 dark:bg-orange-500"
                className="mx-auto mb-4"
              />
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getCourseType(key)}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}

function getIcon(key) {
  switch (key) {
    case "core_1":
    case "core_2":
    case "core_3":
    case "core_4":
      return FaBook;
    case "electivecourse_1":
    case "electivecourse_2":
    case "open_electivecourse":
    case "addon_course":
    case "honoursCourses1":
    case "honoursCourses2":
      return GrTechnology;
    default:
      return SiCoursera;
  }
}
function getCourseType(key) {
  switch (key) {
    case "core_1":
    case "core_2":
    case "core_3":
    case "core_4":
      return "Core Course";
    case "elective_1":
    case "elective_2":
      return "Elective Course";
    case "open_elective":
      return "Open Elective Course";
    case "addon_course":
      return "Addon Course";
    default:
      return "Unknown";
  }
}

export default Mycourse;
