import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUser } from "@fortawesome/free-solid-svg-icons";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Employee {
  id: string;
  name: string;
  phone: string;
  startDate: string;
  jobType: string;
  photoUrl?: string;
}

interface EmployeePhotoModalProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeePhotoModal: React.FC<EmployeePhotoModalProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const photoSrc = employee.photoUrl
    ? `${NEXT_PUBLIC_API_BASE_URL}${employee.photoUrl}`
    : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-[#121212] p-6 rounded-lg shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Employee Photo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Employee Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white mb-1">
            {employee.name}
          </h3>
          <p className="text-sm text-gray-400">{employee.jobType}</p>
          <p className="text-sm text-gray-400">{employee.phone}</p>
        </div>

        {/* Photo */}
        <div className="flex justify-center mb-4">
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={`${employee.name} photo`}
              className="w-48 h-48 object-cover rounded-lg border-2 border-customBlue shadow-lg"
              onError={(e) => {
                // If image fails to load, show placeholder
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}

          {/* Placeholder when no photo or loading error */}
          <div
            className={`w-48 h-48 bg-gray-700 rounded-lg border-2 border-gray-600 flex flex-col items-center justify-center ${
              photoSrc ? "hidden" : ""
            }`}
          >
            <FontAwesomeIcon
              icon={faUser}
              className="text-gray-500 text-6xl mb-2"
            />
            <p className="text-gray-500 text-sm">No photo available</p>
          </div>
        </div>

        {/* Employee Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Start Date:</span>
            <span className="text-white">{employee.startDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Employee ID:</span>
            <span className="text-white text-xs">{employee.id}</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-customBlue text-black font-semibold px-6 py-2 rounded-lg hover:bg-customHoverBlue transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeePhotoModal;
