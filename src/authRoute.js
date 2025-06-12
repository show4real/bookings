import Presentation from "./pages/Presentation";
import Upgrade from "./pages/Upgrade";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import BootstrapTables from "./pages/tables/BootstrapTables";
import Index from "./pages/users/Index";
import Product from "./pages/products/Product";
import StockIndex from "./pages/stock/StockIndex";
import SingleProduct from "./pages/products/SingleProduct";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Lock from "./pages/examples/Lock";
import NotFoundPage from "./pages/examples/NotFound";
import ServerError from "./pages/examples/ServerError";
import {
  faBook,
  faBoxOpen,
  faChartPie,
  faShoppingBag,
  faCog,
  faFileAlt,
  faHandHoldingUsd,
  faIcons,
  faSignOutAlt,
  faTable,
  faTimes,
  faUsers,
  faTruck,
  faTruckLoading,
  faTruckMoving,
  faThermometer,
  faRuler,
  faCalculator,
  faFileInvoice,
  faUser,
  faCreditCard,
  faMoneyBillWaveAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faPlaystation,
  faProductHunt,
  faSalesforce,
} from "@fortawesome/free-brands-svg-icons";

import InvoiceIndex from "./pages/invoice/InvoiceIndex";
import Profile from "./pages/company/Profile";

export let routes = [
  {
    path: "/",
    component: DashboardOverview,
    title: "Dashboard",
    icon: faChartPie,
  },
  {
    path: "/company-profile",
    component: Profile,
    title: "Company Profile",
    icon: faUser,
  },
  { path: "/users", component: Index, title: "Users", icon: faUsers },
 
  {
    path: "/games",
    component: Product,
    title: "Refreshment & Play",
    icon: faPlaystation,
  },
  {
    path: "/sales",
    component: InvoiceIndex,
    title: "Sales",
    icon: faSalesforce,
  },
];
