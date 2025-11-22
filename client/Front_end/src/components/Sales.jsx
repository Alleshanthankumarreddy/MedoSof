import React, { useState } from "react";
import SalesMedicines from "./SalesMedicines";
import ReceiptMedicines from "./ReceiptMedicines";
import GenerateReceiptBtn from "./GenerateReceiptBtn";

function Sales() {
  const [selectedMedicines, setSelectedMedicines] = useState([]);

  return (
    <>
    <SalesMedicines/>
    <ReceiptMedicines/>
    <GenerateReceiptBtn/>
    </>
  );
}

export default Sales;
