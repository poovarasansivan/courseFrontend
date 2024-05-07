import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Forms = lazy(() => import("../pages/courseForms"));
const Cards = lazy(() => import("../pages/Cards"));
const Assignedcourse = lazy(() => import("../pages/assignedcourse"));
const MyCourse = lazy(()=>import("../pages/myCourses")); 
const Modals = lazy(() => import("../pages/Modals"));
const StudentMaster = lazy(() => import("../pages/Tables"));
const Page404 = lazy(() => import("../pages/404"));
const Faculty = lazy(()=>import("../pages/faculty"))
const CourseMaster = lazy(()=>import("../pages/courseMaster"));
const HonoursMinors = lazy(()=>import("../pages/honours"));
const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/courseregistration",
    component: Forms,
  },
  {
   path:"/coursemaster",
   component:CourseMaster,
  },
  {
    path:"/honours",
    component:HonoursMinors,
   },
  {
    path: "/assignedcourses",
    component: Assignedcourse,
  },
  {
    path: "/mycourse",
    component: MyCourse,
  },
  {
    path: "/studentmasters",
    component: StudentMaster,
  },
  {
    path: "/faculty",
    component: Faculty,
  },

  {
    path: "/cards",
    component: Cards,
  },
  {
    path: "/modals",
    component: Modals,
  },
  {
    path: "/404",
    component: Page404,
  },
];
//
export default routes;
