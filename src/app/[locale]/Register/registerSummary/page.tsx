"use client";
import { useRouter } from "next/navigation";
import { root } from "postcss";
import { useEffect, useState } from "react";

const RegisterSummary = () => {
  const router = useRouter();
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [total, setTotal] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const packagesQuery = searchParams.get("packages");
    const totalQuery = searchParams.get("total");

    if (packagesQuery) {
      try {
        setSelectedPackages(JSON.parse(packagesQuery));
      } catch (error) {
        console.error("Error parsing packages:", error);
      }
    }

    setTotal(totalQuery || "0");
  }, []);

  if (!selectedPackages.length) {
    return <p>Loading...</p>;
  }

  return (
    <div className="text-white flex justify-center items-center p-4 sm:p-10 h-lvh bg-black">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg w-full sm:w-3/4 lg:w-2/3">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Order Summary
        </h2>

        {/* Package Summary */}
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            Package Selected:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First column - Packages */}
            <ul>
              {selectedPackages.map((pkg, index) => (
                <li key={index} className="mb-1">
                  {pkg}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-customHoverBlue pt-4">
          <div className="flex justify-between font-semibold text-lg">
            <p>Total:</p>
            <p>{`Birr ${Number(total ?? "0") + 200}`} </p>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="mt-6">
          <h3 className="text-lg sm:text-xl font-semibold text-customBlue">
            Payment Instructions
          </h3>
          <div className="bg-[#c0ebff] p-4 mt-2 rounded-lg border border-customBlue">
            <p className="mb-2 text-black">
              Please transfer the total amount to one of the following accounts:
            </p>

            <ul className="text-sm text-black">
              <li>CBE: 1000629508655 - NURHUSSEN AND / OR YOHANNES </li>
              <li>ABYSSINIA: 190213978 - NURHUSSEN AND / OR YOHANNES </li>

              <li>AWASH: 013201349509600 - NURHUSSEN AND / OR YOHANNES</li>
            </ul>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            After making the payment, click the button below to confirm your
            order.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/en/Login")}
            className="bg-customBlue text-white py-2 px-6 rounded-lg font-semibold hover:bg-customHoverBlue w-full sm:w-auto"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSummary;
