import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Input, Label, Select } from "@windmill/react-ui";
import { Button } from "@windmill/react-ui";

function HonoursMinors() {
  const [honours, setHonours] = useState("");
  const [minors, setMinors] = useState("");
  const [eligibleForHonours, setEligibleForHonours] = useState(false);
  const [eligibleForMinors, setEligibleForMinors] = useState(false);

  useEffect(() => {
    const sgpa = parseFloat(sessionStorage.getItem("sgpa"));
    const arrearsCount = parseInt(sessionStorage.getItem("arrears"));

    if (sgpa >= 7.5 && arrearsCount === 0) {
      setEligibleForHonours(true);  
    } else if (sgpa >= 6.0) {
      setEligibleForMinors(true);
    }
  }, []);

  const handleHonoursChange = (e) => {
    setHonours(e.target.value);
  };

  const handleMinorsChange = (e) => {
    setMinors(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("Form submitted successfully");
   
  };

  return (
    <>
      <PageTitle>Honours/Minors Course Registration</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="mt-4">
          <Label>Honour Registration</Label>
          <div className="mt-2">
            <Select
              className="mt-1"
              onChange={handleHonoursChange}
              value={honours}
              disabled={!eligibleForHonours}
            >
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </Select>
          </div>
          {!eligibleForHonours && eligibleForMinors && (
            <p className="mt-2 text-sm text-red-500">
              You are not eligible for honours registration, but you are
              eligible for minors.
            </p>
          )}
          {eligibleForHonours && (
            <div className="mt-5">
              <Button onClick={handleSubmit}>Register</Button>
            </div>
          )}
        </div>
      </div>
      {(eligibleForMinors || !eligibleForHonours) && (
        <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <Label>Minors Course Selection</Label>
          <div className="mt-2">
            <Select
              className="mt-1"
              onChange={handleMinorsChange}
              value={minors}
              disabled={!eligibleForMinors}
            >
              <option value="">Select</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </Select>
          </div>
          {eligibleForMinors && (
            <div className="mt-5">
              <Button onClick={handleSubmit}>Register</Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default HonoursMinors;
