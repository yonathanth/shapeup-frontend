import React, { useState } from "react";
import SmallLoading from "./SmallLoading";
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AddEmployeeModalProps {
  closeModal: () => void;
  addNewMember: (newMember: Member) => Promise<void>;
  errorModal: string | null;
  errorMessage: string | null;
}

interface Member {
  id: string;
  name: string;
  phone: string;
  startDate: string;
  jobType: string;
  photoUrl?: string;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  closeModal,
  addNewMember,
  errorModal,
  errorMessage,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [jobType, setJobType] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to handle photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle the form submission
  const handleAddEmployee = async () => {
    const token = localStorage.getItem("token");
    if (name && phone && startDate && jobType) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("startDate", startDate);
      formData.append("jobType", jobType);

      if (photo) {
        formData.append("photo", photo);
      }

      try {
        setLoading(true);

        const response = await fetch(
          `${NEXT_PUBLIC_API_BASE_URL}/api/employees/register`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              // Don't set Content-Type for FormData, let browser set it with boundary
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (data.success) {
          addNewMember(data.data);
          closeModal();
        } else {
          setError(data.message || "Error adding employee.");
        }
      } catch (error) {
        console.error("Error adding employee:", error);
        setError("Error adding employee. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill out all fields.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#121212] bg-opacity-50">
      <div className="bg-[#121212] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-300 mb-4">
          Add New Employee
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 rounded-md bg-[#1d1d1d] text-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full px-4 py-2 rounded-md bg-[#1d1d1d] text-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="date"
            className="w-full px-4 py-2 rounded-md bg-[#1d1d1d] text-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 rounded-md bg-[#1d1d1d] text-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">Select Job Type</option>
            <option value="Janitor">Janitor</option>
            <option value="Trainer">Trainer</option>
            <option value="Reception">Reception</option>
          </select>
          {/* Photo upload field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Employee Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 rounded-md bg-[#1d1d1d] text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-customBlue file:text-black hover:file:bg-customHoverBlue focus:outline-none focus:ring-2 focus:ring-customBlue"
            />
            {photoPreview && (
              <div className="mt-2">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-full border-2 border-customBlue"
                />
              </div>
            )}
          </div>
        </div>
        {/* Error message */}
        {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
        <div className="flex justify-end mt-4 space-x-3">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-customBlue text-white px-4 py-2 rounded-md hover:bg-customHoverBlue"
            onClick={handleAddEmployee}
            disabled={loading}
          >
            {loading ? <SmallLoading /> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
