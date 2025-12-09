import { useContext, useState } from 'react'
import React from 'react'
import { AppContext } from './AppContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import { Routes,Route} from 'react-router-dom';
import Home from './components/Home';
import Medicines from './components/Medicines';
import Racks from './components/Racks';
import Vendors from './components/Vendors';
import Sales from './components/Sales';
import LowStockMedicines from './components/LowStockMedicines';
import Purchase from './components/Purchase';
import ExpiredMedicines from './components/ExpiredMedicines';
import StaffList from './components/StaffList';
import VendorMedicines from './components/VendorMedicines';
import DisplayProfits from './components/DisplayProfits'

function App() {
  const { showLogin, owner,vendor } = useContext(AppContext);


  return (
    <>
      <Navbar/>
      {showLogin && <Login/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medicines" element={<Medicines/>}/>
        <Route path="/racks" element={<Racks/>}/>
        <Route path="/vendor" element={<Vendors/>}/>
        <Route path="/sales" element={<Sales/>}/>
        <Route path="/lowstockmedicines" element={<LowStockMedicines/>}/>
        <Route path="/purchase" element={<Purchase/>}/>
        <Route path="/expiredMedicines" element={<ExpiredMedicines/>}/>
        {owner && <Route path="/getAllStaff" element={<StaffList/>}/>}
        {vendor && <Route path="/vendorMedicines" element={<VendorMedicines/>}/>}
        <Route path="/displayProfits" element={<DisplayProfits/>}/>
      </Routes>
    </>
  )
}

export default App
