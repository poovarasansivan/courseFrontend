const role = sessionStorage.getItem('role'); // Ensure to pass the key as a string

let routes = [];
console.log(role);
switch (role) {
  case '1':
    routes = [
      {
        path: "/app/dashboard",
        icon: "HomeIcon",
        name: "Dashboard",
      },
      {
        path: "/app/studentmasters",
        icon: "TablesIcon",
        name: "StudentMaster",
      },
      {
        path: "/app/coursemaster",
        icon: "SiCoursera",
        name: "Course Master",
      },
      {
        path: "/app/assignedcourses",
        icon: "SiCoursera",
        name: "Assigned Courses",
      },
      {
        path: "/app/mycourse",
        icon: "SiCoursera",
        name: "MyCourse",
      },
      {
        path: "/app/courseregistration",
        icon: "FormsIcon",
        name: "CourseRegistration",
      },
      {
        path: "/app/honours",
        icon: "FormsIcon",
        name: "Honors Minors Registration",
      },
      {
        path: "/app/faculty",
        icon: "FaChalkboardTeacher",
        name: "Faculty Mapping",
      },
 
    ];
    break;
  case '2':
    routes = [
      {
        path: "/app/dashboard",
        icon: "HomeIcon",
        name: "Dashboard",
      },
      {
        path: "/app/mycourse",
        icon: "SiCoursera",
        name: "MyCourse",
      },
      {
        path: "/app/courseregistration",
        icon: "FormsIcon",
        name: "CourseRegistration",
      },
      {
        path: "/app/honours",
        icon: "FormsIcon",
        name: "Honors Minors Registration",
      },
    ];
    break;
  // Add more cases for different roles if needed
  default:
    // Default routes for unknown or unauthorized users
    routes = [
      {
        path: "/login",
        icon: "LoginIcon",
        name: "Login",
      },
    ];
    break;
}

export default routes;
