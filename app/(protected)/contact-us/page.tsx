"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import { ContactUs } from "@/services/contactUsServerce";
import { toast } from "@/hooks/use-toast";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    //  Limit message to 250 words
    if (name === "message") {
      const words = value.trim().split(/\s+/);
      if (words.length > 250) {
        return; // stop updating once limit is reached
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await ContactUs(formData);
      console.log("Form submitted successfully:", response);
      toast({
        title: "Message sent successfully ✅",
      });

      // Reset form only on success
      setFormData({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Failed to send message ",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-liner-to-br from-purple-100 via-purple-300 to-indigo-300 rounded-b-[80px]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Contact us
              </h2>
              <p className="text-gray-600 text-lg">
                We would love to hear from you.
              </p>
            </div>
            <div className="md:w-1/3 mt-8 md:mt-0 flex justify-center">
              <img
                src="/contact-us.jpg"
                alt="Contact us"
                className="w-1/2 rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* Contact Form + Info */}
        <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              Send us a message
            </h3>
            <p className="text-gray-500 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>

            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />

              {/* ✅ +91 with vertical divider */}
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <span className="flex items-center bg-gray-100 text-gray-700 px-3 py-3">
                  +91
                </span>
                <input
                  type="number"
                  name="mobile"
                  placeholder="Mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="flex-1 p-3 focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-purple-400 outline-none"
              />

              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-purple-400 outline-none"
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md font-medium transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Get in touch
            </h3>
            <p className="text-gray-500 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>

            <div className="space-y-6 text-gray-600">
              <div className="flex items-start space-x-3">
                <MapPin className="text-purple-600 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Location</h4>
                  <p>
                    216 Canal South Road
                    <br />
                    Chingrighata - Kolkata
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="text-purple-600 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Email us</h4>
                  <p>
                    support@gmail.com
                    <br />
                    matainja@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="text-purple-600 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Call us</h4>
                  <p>
                    +911234567890
                    <br />
                    +91911234567891
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-semibold text-gray-800 mb-2">
                Follow our social media
              </h4>
              <div className="flex space-x-4">
                <a href="#" className="text-purple-600 hover:text-purple-800">
                  <Facebook />
                </a>
                <a href="#" className="text-purple-600 hover:text-purple-800">
                  <Instagram />
                </a>
                <a href="#" className="text-purple-600 hover:text-purple-800">
                  <Youtube />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Google Map */}
        <div className="mt-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.555471299536!2d88.40544731436786!3d22.55831898519013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02742e9e4acc3b%3A0x924a4d8acf33a574!2sMatainja+Technologies!5e0!3m2!1sen!2sin!4v1477123195166"
            width="100%"
            height="400"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="map"
          ></iframe>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
