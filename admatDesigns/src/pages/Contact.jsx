import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "../api/api";
import { FaUser, FaEnvelope } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [sending, setSending] = useState(false)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return
    } 
      setErrors({});
      setSending(true);

      try {
        await apiFetch("/contact/", {
          method: "POST",
          body: JSON.stringify(formData),
        });
          setSubmitted(true);
          setFormData({ name: "", email: "", message: "" }); // reset form
          toast.success("Message sent");

      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Message not sent");
      }finally {
        setSending(false)
      }
  };

  const blockedDomains = [
    "tempmail.com",
    "10minutemail.com",
    "mailinator.com",
    "guerrillamail.com",
    "yopmail.com",
    "dispostable.com",
    "trashmail.com",
    "fakeinbox.com",
  ];

  const validate = () => {
    let newErrors = {};

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else {
      const domain = formData.email
        .split("@")[1]
        ?.toLowerCase();

      if (blockedDomains.includes(domain)) {
        newErrors.email =
          "Temporary email addresses are not allowed";
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    return newErrors;
  };


  return (
    <div className="pt-10 flex justify-center bg-white rounded-lg mx-4">
        {/*Form */}
        <form onSubmit={handleSubmit} className="xl:min-w-3xl lg:min-w-2xl md:min-w-xl items-center text-sm text-slate-80 mx-auto">
          <div className="text-center mb-6">
            <p className="text-md bg-orange-200 text-orange-600 font-semibold px-3 py-1 rounded">Contact Us</p> 
            <h1 className="text-4xl font-semibold py-4 text-center">Let’s Get In Touch.</h1>
            <p className="max-md:text-sm text-gray-500 pb-10 text-center">
                Or just reach out manually to us at <a href="mailto:footerfurniture@gmail.com" className="text-orange-600 hover:underline">footerfurniture@gmail.com</a>
            </p>
          </div>
          <div>
            <label className="block font-medium">Name</label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-orange-600 rounded focus-within:ring-2 focus-within:ring-orange-400 transition-all overflow-hidden">
              <FaUser className="text-orange-600 mr-2" />              
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={sending}
                className="bg-white h-full px-2 w-full outline-none bg-transparent py-2 focus:outline-none focus:ring-orange-300"
              />
            </div>
            {errors.name && (
              <span className="bg-red-600 rounded mt-2 text-white p-1 text-sm">{errors.name}</span>
            )}
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-orange-600 rounded focus-within:ring-2 focus-within:ring-orange-400 transition-all overflow-hidden">
              <FaEnvelope className="text-orange-600 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={sending}
                className="bg-white h-full px-2 w-full outline-none bg-transparent py-2 focus:outline-none  focus:ring-orange-300"
              />
            </div>
            {errors.email && (
              <span className="bg-red-600 rounded mt-2 text-white p-1 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="">
            <label className="block font-medium">Message</label>
            <textarea
              name="message"
              placeholder="Tell us how we can help..."
              value={formData.message}
              onChange={handleChange}
              disabled={sending}
              rows={5}
              className="bg-transparent w-full px-3 py-2 border border-orange-600 rounded-md resize-none outline-none focus:outline-none focus-within:ring-orange-400 focus:ring-orange-300 transition-all min-h-[100px]"
            />
            {errors.message && (
              <span className="bg-red-600 rounded mt-2 text-white p-1 text-sm">{errors.message}</span>
            )}
          </div>

          <button
            disabled={sending}
            type="submit"
            className={`flex items-center justify-center mt-5 py-2.5 w-full rounded transition ${
              sending
                ? "bg-orange-600/80 text-white cursor-not-allowed"
                : "bg-orange-600 text-white cursor-pointer"
            }`}
          >
            {sending ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>

      {submitted && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center max-w-md w-full p-8">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 text-gray-800">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for contacting Footer Furniture. We have received your message and will get back to you as soon as possible.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                navigate("/");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;