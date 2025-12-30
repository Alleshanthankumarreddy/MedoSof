import React, { useState } from "react";
import SalesMedicines from "./SalesMedicines";
import ReceiptMedicines from "./ReceiptMedicines";
import GenerateReceiptBtn from "./GenerateReceiptBtn";

function Sales() {
  const [selectedMedicines, setSelectedMedicines] = useState([]);

  return (
    <div className="bg-white">
    <SalesMedicines/>
    <ReceiptMedicines/>
    <GenerateReceiptBtn/>
    </div>
  );
}

export default Sales;
