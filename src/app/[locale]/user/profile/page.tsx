"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import {
  CartesianGrid,
  LineChart,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts";
import EditProfileModal from "./components/EditProfileModal";
import { jwtDecode } from "jwt-decode";
import {
  downloadMemberId,
  FormattedName,
} from "../../admin/gym-member/[memberDetail]/helperFunctions";
import LoadingPage from "@/src/app/[locale]/user/loading";
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// interface BmiData {
//   id: string;
//   userId: string;
//   value: number;
// }
interface Service {
  id: string;
  name: string;
  price: string;
  benefits: string[];
  category: string;
  description?: string[];
}

interface Attendance {
  date: string;
}
interface CustomJwtPayload {
  id: string;
}

interface User {
  id: string;
  barcode: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  email: string | null;
  address: string | null;
  dob: string | null;
  emergencyContact: string | null;
  firstRegisteredAt: string;
  startDate: string;
  totalAttendance: number;
  preFreezeAttendance: number;
  preFreezeDaysCount: number;
  daysLeft: number;
  height: number | null;
  weight: number | null;
  bmis: {
    createdAt: Date;
    updatedAt: Date;
    id: string;
    userId: string;
    value: number;
  }[];
  healthCondition: {
    exerciseRestriction: false;
    painDuringExercise: true;
    dizzinessOrFainting: false;
    boneOrJointDisease: false;
    heartHypertensionMeds: false;
    chronicDiseases: "";
    additionalRemarks: "";
  };
  level: string | null;
  goal: string | null;
  role: string;
  password: string;
  status: string;
  freezeDate: string | null;
  createdAt: string;
  updatedAt: string;
  serviceId: string | null;
  profileImageUrl: string | null;
  attendance: Attendance[];
  service: Service;
}

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [memberDetails, setMemberDetails] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    // Decode the token to extract the userId
    const decodeToken = () => {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        console.log(decodedToken.id); // Extract and store the userId
        setUserId(decodedToken.id);
        console.log(userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    decodeToken();
  }, []);

  const fetchMemberDetails = useCallback(async () => {
    if (!userId) return;
    setIsPageLoading(true);

    setLoading(true);
    setIsPageLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/memberManagement/${userId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch member details");
      }

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.message || "Failed to load member details");
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
      setIsPageLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      fetchMemberDetails().then((fetchedData) => {
        setMemberDetails(fetchedData);
      });
    }
  }, [userId, fetchMemberDetails]);

  if (loading) {
    return <div>Loading member details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!memberDetails) {
    return <div>No member details available.</div>;
  }

  if (isPageLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-black p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#151515] to-[#252525] p-4 sm:p-6 rounded-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={
                    `${NEXT_PUBLIC_API_BASE_URL}${memberDetails.profileImageUrl}` ||
                    ""
                  }
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-16 h-16 sm:w-20 sm:h-20"
                />
              </div>
              <div className="flex-1">
                <FormattedName fullName={memberDetails?.fullName || ""} />
                <p className="text-white text-sm mt-1">
                  Member since{" "}
                  {new Date(
                    memberDetails?.firstRegisteredAt || ""
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-customBlue">
                  {memberDetails?.daysLeft || 0}
                </div>
                <div className="text-xs text-gray-400">Days Left</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-customBlue">
                  {memberDetails?.totalAttendance || 0}
                </div>
                <div className="text-xs text-gray-400">Attendance</div>
              </div>

              <div className="flex flex-col items-center">
                <Image
                  src={memberDetails?.barcode || ""}
                  alt="barcode"
                  width={64}
                  height={24}
                  className="h-6 w-16 bg-white rounded"
                />
                <span className="text-customBlue text-xs mt-1">Member ID</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Contact Information */}
          <div className="bg-[#151515] p-4 sm:p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Contact Information
              </h2>
              <button
                onClick={() => setShowEditForm(true)}
                className="bg-customBlue text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-customHoverBlue transition-colors"
              >
                Edit Profile
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Phone Number", value: memberDetails?.phoneNumber },
                {
                  label: "Email Address",
                  value: memberDetails?.email || "N/A",
                },
                { label: "Address", value: memberDetails?.address || "N/A" },
                {
                  label: "Date of Birth",
                  value: memberDetails?.dob
                    ? new Date(memberDetails?.dob).toLocaleDateString()
                    : "N/A",
                },
                {
                  label: "Emergency Contact",
                  value: memberDetails?.emergencyContact || "N/A",
                },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  <span className="text-white text-sm text-right max-w-[60%] break-words">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Stats */}
          <div className="bg-[#151515] p-4 sm:p-6 rounded-xl">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Physical Stats
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-[#1C1C1C] p-4 rounded-lg">
                  <div className="text-xl font-bold text-customBlue">
                    {memberDetails?.weight
                      ? `${memberDetails.weight} kg`
                      : "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">Weight</div>
                </div>
                <div className="text-center bg-[#1C1C1C] p-4 rounded-lg">
                  <div className="text-xl font-bold text-customBlue">
                    {memberDetails?.height
                      ? `${memberDetails.height} cm`
                      : "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">Height</div>
                </div>
              </div>

              <div className="text-center bg-[#1C1C1C] p-4 rounded-lg">
                <div className="text-xl font-bold text-customBlue">
                  {memberDetails.bmis.at(-1)
                    ? `${memberDetails.bmis.at(-1)!.value} kg/m²`
                    : "N/A"}
                </div>
                <div className="text-xs text-gray-400">Current BMI</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Fitness Level</span>
                  <span className="text-customBlue text-sm">
                    {memberDetails.level || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Fitness Goal</span>
                  <span className="text-customBlue text-sm">
                    {memberDetails.goal || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Details */}
          <div className="bg-[#151515] p-4 sm:p-6 rounded-xl">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Membership Details
            </h2>

            <div className="space-y-4">
              <div className="bg-[#1C1C1C] p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-customBlue">
                    {memberDetails?.service?.name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">Membership Type</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span
                    className={`text-sm font-medium ${
                      memberDetails?.status === "active"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {memberDetails?.status
                      ? memberDetails.status.charAt(0).toUpperCase() +
                        memberDetails.status.slice(1)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Days Remaining</span>
                  <span className="text-customBlue text-sm">
                    {memberDetails?.daysLeft || 0} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">
                    Total Attendance
                  </span>
                  <span className="text-customBlue text-sm">
                    {memberDetails?.totalAttendance || 0} visits
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Information */}
        <div className="bg-[#151515] p-4 sm:p-6 rounded-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-6">
            Health Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: "Exercise Restrictions",
                value: memberDetails?.healthCondition?.exerciseRestriction
                  ? "Yes"
                  : "No",
                status: memberDetails?.healthCondition?.exerciseRestriction,
              },
              {
                label: "Pain During Exercise",
                value: memberDetails?.healthCondition?.painDuringExercise
                  ? "Yes"
                  : "No",
                status: memberDetails?.healthCondition?.painDuringExercise,
              },
              {
                label: "Dizziness or Fainting",
                value: memberDetails?.healthCondition?.dizzinessOrFainting
                  ? "Yes"
                  : "No",
                status: memberDetails?.healthCondition?.dizzinessOrFainting,
              },
              {
                label: "Bone or Joint Disease",
                value: memberDetails?.healthCondition?.boneOrJointDisease
                  ? "Yes"
                  : "No",
                status: memberDetails?.healthCondition?.boneOrJointDisease,
              },
              {
                label: "Heart/Hypertension Meds",
                value: memberDetails?.healthCondition?.heartHypertensionMeds
                  ? "Yes"
                  : "No",
                status: memberDetails?.healthCondition?.heartHypertensionMeds,
              },
            ].map((item, index) => (
              <div key={index} className="bg-[#1C1C1C] p-4 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                <div
                  className={`font-medium ${
                    item.status ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {item.value}
                </div>
              </div>
            ))}

            {memberDetails?.healthCondition?.chronicDiseases && (
              <div className="bg-[#1C1C1C] p-4 rounded-lg md:col-span-2 lg:col-span-3">
                <div className="text-xs text-gray-400 mb-1">
                  Chronic Diseases
                </div>
                <div className="text-white text-sm">
                  {memberDetails.healthCondition.chronicDiseases || "None"}
                </div>
              </div>
            )}

            {memberDetails?.healthCondition?.additionalRemarks && (
              <div className="bg-[#1C1C1C] p-4 rounded-lg md:col-span-2 lg:col-span-3">
                <div className="text-xs text-gray-400 mb-1">
                  Additional Remarks
                </div>
                <div className="text-white text-sm">
                  {memberDetails.healthCondition.additionalRemarks || "None"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <EditProfileModal
          setShowModal={setShowEditForm}
          fetchData={fetchMemberDetails}
          member={memberDetails}
        />
      )}
    </div>
  );
};

export default Page;
