import { useState, useEffect , useRef} from "react";
import toast from "react-hot-toast";
import { User, Mail , UploadCloud} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS , BASE_URL} from "../utils/apiPaths";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
const ProfilePage = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (user) {
    setFormData({ name: user.name, email: user.email, password: user.password});
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
    const originalName = user.name;

    const newName = formData.name;
    const isNameUnchanged = (newName === originalName);
    if (isNameUnchanged) {
      toast.error("Please make a change before updating your profile.");
      return;
    }
  setIsLoading(true);
  try {
    const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
      name: formData.name,
    });
    updateUser(response.data); // Update user in context
    toast.success("Profile updated successfully!");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update profile.");
  } finally {
    setIsLoading(false);
  }
};

if (authLoading) {
  return <div>Loading profile...</div>;
}
const textVariants ={
    hidden: {y: 20, opacity: 0},
    visible: {
        y:0,
        opacity:1,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
  };
  const imageVariants ={
    hidden: {x: 50, opacity: 0},
    visible: {
        x:0,
        opacity:1,
        transition: {
            duration: 1,
            ease: "easeOut",
            delay:0.5,
        },
    },
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);

  const coverImageUrl = user.avatar.startsWith('http')
      ? user.avatar
      : `${BASE_URL}/backend${user.avatar}`.replace(/\\/g, '/');

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true); 

    try {
        const formData = new FormData();
        formData.append('avatar', file); 
        const response = await axiosInstance.put(
            API_PATHS.AUTH.UPDATE_PROFILE, // e.g., '/profile'
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        updateUser(response.data); // Update user in context
        toast.success("Avatar uploaded successfully!");

    } catch (error) {
        toast.error("Avatar upload failed.");
    } finally {
    
        setIsUploading(false);
    }
};
  return (
    <DashboardLayout noMainStyle = {true}>
      <div className={`max-h-[120vh] lg:max-h-[calc(100vh-4rem)] overflow-hidden transition-all duration:500`}>
        <motion.section id="home" style={{ y: heroY }}
          className="h-full flex items-center justify-center relative px-6 py-10 ">

          <div className="max-w-7xl mx-auto w-full z-10 mt-20 mb-30">
            {/* desktop view */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
               {/* left side */}
              <div className="mx-auto px-5 w-full">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 mt-10">Profile</h1>
                <p className="text-sm text-slate-600 mb-8">Manage your account details.</p>

                <div className="bg-white border-slate-200 rounded-xl shadow-sm p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                      label="Full Name"
                      name="name"
                      type="text"
                      icon={User}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      icon={Mail}
                      value={formData.email}
                      disabled
                    />
                    <div className="flex justify-between">
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        variant="primary"
                        size="lg"
                      >
                        {isLoading ? "Updating..." : "Update Profile"}
                      </Button>
                      {/* <Button
                        type="button"
                        variant="ghost"
                        isLoading={isLoading}
                        icon={Lock}
                      >
                        Change Password
                      </Button> */}
                    </div>
                  </form>
                </div>
              </div>

              {/*  right content */}
              <motion.div
                initial='hidden'
                animate="visible"
                variants={imageVariants}
                className="flex justify-center lg:justify-end">
                  <div className="relative">

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`w-80 h-96 relative z-20 rounded-3xl overflow-hidden border-4 shadow-2xl`}
                >
                  <img src={coverImageUrl} alt="Cover" className="w-full aspect-[16/25] object-cover" />
                  
                </motion.div>
                {/* decorative rings */}
                <div className="flex justify-center mt-5 z-30">
                    <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                    <Button variant="primary" onClick={() => fileInputRef.current.click()} isLoading={isUploading} icon={UploadCloud} className= "z-40">
                      Upload avatar
                    </Button>
                  </div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-4 rounded-3xl border border-violet-500/10 mb-0 z-10 pointer-event-none"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-6 rounded-3xl border border-purple-500 mb-10 z-10 pointer-events-none"
                />
                </div>
              </motion.div>
              


            </div>

            {/* mobile view */}
            <div className="block lg:hidden">
              <motion.div
                initial="hidden"
                animate='visible'
                variants={containerVariants}
                className="text-center">
                {/* Profile Image-mobile */}
                <motion.div
                  variants={imageVariants}
                  className="mb-8">
                  <div className="w-32 h-32 mx-auto relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`w-full h-32 rounded-2xl overflow-hidden border-4 relative z-20 `}>
                      <img src={coverImageUrl}
                        alt="profile"
                        className="w-full h-full object-cover" />
                    </motion.div>
                    {/* Decorative ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -inset-2 rounded-2xl border boder-blue-500/20" />
                  </div>
                </motion.div>



                {/* content-mobile */}
                <div className="flex justify-center mt-5 z-30">
                  <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                  <Button variant="primary" onClick={() => fileInputRef.current.click()} isLoading={isUploading} icon={UploadCloud} className="z-40">
                    Upload avatar
                  </Button>
                </div>

                {/* bottom content */}
                <div className="mx-auto px-5 w-full">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 mt-10">Profile</h1>
                <p className="text-sm text-slate-600 mb-8">Manage your account details.</p>

                <div className="bg-white border-slate-200 rounded-xl shadow-sm p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                      label="Full Name"
                      name="name"
                      type="text"
                      icon={User}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      icon={Mail}
                      value={formData.email}
                      disabled
                    />
                    <div className="flex justify-between">
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        variant="primary"
                        size="lg"
                      >
                        {isLoading ? "Updating..." : "Update Profile"}
                      </Button>
                      {/* <Button
                        type="button"
                        variant="ghost"
                        isLoading={isLoading}
                        icon={Lock}
                      >
                        Change Password
                      </Button> */}
                    </div>
                  </form>
                </div>
              </div>

                
              </motion.div>
            </div>

            

          </div>
        </motion.section>

      </div>

    </DashboardLayout>
  )

};

export default ProfilePage;