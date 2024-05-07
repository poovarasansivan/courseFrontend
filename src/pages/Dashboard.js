import React, { useState, useEffect } from "react";

import InfoCard from "../components/Cards/InfoCard";
import PageTitle from "../components/Typography/PageTitle";
import { FaUsers } from "react-icons/fa";
import { SiUnacademy } from "react-icons/si";
import { SiCoursera } from "react-icons/si";
import { SiNextra } from "react-icons/si";
import { Card, CardBody } from "@windmill/react-ui";
import { GoDotFill } from "react-icons/go";
import SectionTitle from "../components/Typography/SectionTitle";
import RoundIcon from "../components/RoundIcon";

export const Instruction = [
  {
    icon: <GoDotFill />,
    rule: "The main objective is to Make the Course Registration Easier way.",
  },
  {
    icon: <GoDotFill />,
    rule: "For Addon Course no limitions of Students count.",
  },
  {
    icon: <GoDotFill />,
    rule: "Student should register the course only the selected course is not in the core subjects of any semester.",
  },
  {
    icon: <GoDotFill />,
    rule: "For Honours Registration the student should must have CGPA above 7.5 and no histroy of arrears",
  },
  {
    icon: <GoDotFill />,
    rule: "For Minor Registration the student should must have CGPA above 7.0",
  },
];

function Dashboard() {
  const [totalstudentcount, setTotalStudentCount] = useState(null);
  const [totaldepartmentcount, setTotalDepartmentCount] = useState(null);
  const [totalopenelectivecount, setTotalOpenElectiveCount] = useState(null);
  const [totalelectivecount, setTotalElectiveCount] = useState(null);

  useEffect(() => {
    fetchOverallStudentCount();
    fetchOveralldepartmentCount();
    fetchOverallOpenelctiveCount();
    fetchOverallelctiveCount();
  }, []);

  const fetchOverallStudentCount = async () => {
    try {
      const response = await fetch("http://localhost:5555/totalstudent");
      const data = await response.json();
      setTotalStudentCount(data.totalStudents);
    } catch (error) {
      console.error("Error fetching overall count:", error);
    }
  };
  const fetchOveralldepartmentCount = async () => {
    try {
      const response = await fetch("http://localhost:5555/departmentcount");
      const data = await response.json();
      setTotalDepartmentCount(data.totaldepartment);
    } catch (error) {
      console.error("Error fetching overall count:", error);
    }
  };
  const fetchOverallOpenelctiveCount = async () => {
    try {
      const response = await fetch("http://localhost:5555/openelectivecount");
      const data = await response.json();
      setTotalOpenElectiveCount(data.totalOpenelective);
    } catch (error) {
      console.error("Error fetching overall count:", error);
    }
  };
  const fetchOverallelctiveCount = async () => {
    try {
      const response = await fetch("http://localhost:5555/totalElectivecount");
      const data = await response.json();
      setTotalElectiveCount(data.totalelective);
    } catch (error) {
      console.error("Error fetching overall count:", error);
    }
  };
//  console.log(totalelectivecount)

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <div className="grid gap-6 mb-8  md:grid-cols-2 xl:grid-cols-4">
        
        <InfoCard title="Total Students" className="" value={totalstudentcount}>
          <RoundIcon
            icon={FaUsers}
            iconColorClass="text-blue-500 dark:text-orange-100"
            bgColorClass="bg-red-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard> 
        <Card>
      <CardBody className="flex items-center bg-pink-500">
        {FaUsers}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          Total Students  
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {totalstudentcount}
          </p>
        </div>
      </CardBody>
    </Card>

        <InfoCard title="Total Departments" value={totaldepartmentcount}>
          <RoundIcon
            icon={SiUnacademy}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Open Elective Courses" value={totalopenelectivecount}>
          <RoundIcon
            icon={SiCoursera}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Elective Courses" value={totalelectivecount}>
          <RoundIcon
            icon={SiNextra}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <div>
        <SectionTitle>Instructions</SectionTitle>

        <Card className="mb-8 shadow-md">
          <CardBody>
            {Instruction.map((instruction, index) => (
              <div key={index} className="flex items-center mb-2">
                <div className="mr-2 text-blue-500">{instruction.icon}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {instruction.rule}
                </p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Dashboard;
