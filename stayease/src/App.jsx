import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import Home from "./pages/customer/Home";
import BrowseProperties from "./pages/customer/BrowseProperties";
import PropertyDetails from "./pages/customer/PropertyDetails";

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<BrowseProperties />} />
          <Route path="/properties/:propertyId" element={<PropertyDetails />} />
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  );
}

export default App;