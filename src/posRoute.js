
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import PosOrderIndex from "./pages/pos/PosOrderIndex";
import InvoiceIndex from "./pages/invoice/InvoiceIndex";
import { faSalesforce } from "@fortawesome/free-brands-svg-icons";

export let posRoutes = [
    
   
    { path: "/bookings",component: PosOrderIndex, title:"Bookings",icon:faGamepad },
    
  ];
