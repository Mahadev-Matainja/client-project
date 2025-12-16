"use client";

import MainLayout from "@/components/layout/main-layout";
import Image from "next/image";

// LEFT SIDE DATA
const doctorData = {
  name: "Dr. Saheli Das",
  speciality: "General Physician",
  hospital: "Srl Diagnostics Centre",
  image: "/icon/Doctor.png",
  aboutTitle: "DR. SAHELI DAS – TRUSTED & EXPERIENCED HEALTHCARE PROFESSIONAL",
  about1:
    "Welcome to the profile of Dr. Saheli Das, a dedicated and highly skilled medical professional committed to providing exceptional healthcare services.",
  about2:
    "With extensive expertise in [General Physician], Dr. Saheli Das ensures that every patient receives personalized and high-quality medical care.",
};

// RIGHT SIDE DATA
const similarDoctors = [
  {
    name: "Dr. L K Nath",
    speciality: "General Physician",
    qualification: "MBBS, M.D",
    image: "/icon/Doctor.png",
  },
  {
    name: "Dr. Archisman",
    speciality: "General Physician",
    qualification: "",
    image: "/icon/Doctor.png",
  },
];

export default function DoctorProfile() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT SIDE ================================================= */}
        <div className="lg:col-span-2 flex gap-10 items-start">
          {/* Doctor Image Box */}
          <div className="w-3/5  rounded-2xl border shadow-sm bg-[#EAF7FB] flex flex-col items-center justify-between pb-6">
            <div className="p-1.5 ">
              <Image
                src={doctorData.image}
                alt={doctorData.name}
                width={200}
                height={200}
                className="object-contain rounded-2xl"
              />
            </div>
            <p className="text-gray-600 text-base">Experience</p>
          </div>

          {/* Doctor Info */}
          <div>
            <div className="text-2xl font-semibold ">{doctorData.name}</div>
            <div className="text-base text-gray-700 mb-4">
              {doctorData.speciality}
            </div>

            <p className="text-gray-700 mb-6">
              <span className="font-semibold text-base">Hospital - </span>
              {doctorData.hospital}
            </p>

            <h2 className="text-sm font-semibold text-black mb-3">
              {doctorData.aboutTitle}
            </h2>

            <p className="text-gray-700 text-sm leading-relaxed italic mb-3">
              {doctorData.about1}
            </p>
            <p className="text-gray-700 text-sm leading-relaxed italic">
              {doctorData.about2}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE ================================================= */}
        <div className="">
          <h2 className="text-2xl font-semibold mb-3">Similar Doctors</h2>
          <p className="text-gray-600 mb-6">
            Explore more options available near you.
          </p>

          <div className="flex flex-col gap-5">
            {similarDoctors.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-[#d5f0f9] border border-teal-100 rounded-xl hover:shadow-md transition cursor-pointer"
              >
                {/* Doctor Small Image Box */}
                <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center border">
                  <Image
                    src={doc.image}
                    width={45}
                    height={45}
                    alt={doc.name}
                    className="object-contain"
                  />
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-lg font-semibold">{doc.name}</h3>
                  <p className="text-gray-700">{doc.speciality}</p>
                  {doc.qualification && (
                    <p className="text-gray-500 text-sm">{doc.qualification}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#d5f0f9] p-6 rounded-2xl w-full mt-4">
        <h2 className="text-2xl font-semibold text-grey-700]">
          Dr. Saheli Das not available right now
        </h2>

        <div className="mt-1 w-20 h-[3px] bg-gray-800"></div>
      </div>
    </MainLayout>
  );
}
