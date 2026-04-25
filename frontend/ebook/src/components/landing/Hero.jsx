import { ArrowRight, Sparkles, BookOpen, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import HERO_IMG from "../../assets/hero-img.png";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-20 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="max-w-xl space-y-8">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-100 shadow-sm">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-violet-900 font-medium text-sm">
              AI-Powered Publishing
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Create Stunning
            <span className="block mt-2 bg-gradient-to-r from-violet-600 via-purple-600 to-purple-600 text-transparent bg-clip-text">
            Ebooks in Minutes
            </span>
           </h1>
           <p className="text-lg text-gray-600 leading-relaxed">
            From idea to published ebook, this AI-powered platform helps you write and design your thoughts and ideas into professional ebooks.
           </p>
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="group inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-200">
              <span>Start Creating for Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </Link>

            <a href="#demo" className="inline-flex items-center space-x-2 text-gray-700 font-medium hover:text-violet-900 transition-colors duration-200">
                <span>Watch Demo</span>
                <span className="text-violet-600">-</span>
            </a>
           </div>
           <div className="flex items-center gap-8 pt-4">
            <div>
                <div className="text-2xl font-bold text-gray-900">50k+</div>
                <div className="text-sm text-gray-600">Books Created</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div>
                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">User Rating</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div>
                <div className="text-2xl font-bold text-gray-900">10min</div>
                <div className="text-sm text-gray-600">Avg. Creation</div>
            </div>
           </div>
        </div>

        <div className="relative pl-6 lg:pl-8">
            <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl opacity-20 blur-2xl"></div>
                <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    <img src={HERO_IMG} alt="AI EBook Creator Dashboard" className="w-full h-auto" />

                    <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-xl p-4 backdrop-blur-sm border border-gray-100 animate-in fade-in slide-in-from-right duration-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-900">Processing</div>
                                <div className="text-sm text-gray-900 font-semibold">AI Generation</div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4 backdrop-blur-sm border border-gray-100 animate-in fade-in slide-in-from-left duration-700 delay-300">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Completed</div>
                                <div className="text-sm text-gray-900 font-semibold">247 Pages</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute -top-8 -left-8 w-20 h-20 bg-violet-400/20 rounded-2xl rotate-12 animate-[spin_20s_linear_infinite] hover:animate-[spin_5s_linear_infinite] transition-all duration-300 z-20"></div>
            <div className="absolute -bottom-8 -right-6 w-32 h-32 bg-purple-400/20 rounded-full -rotate-12 animate-[spin_25s_linear_infinite_reverse] hover:animate-[spin_8s_linear_infinite_reverse] transition-all duration-300 z-20"></div>
        </div>
      </div>
    </div>
  </div>;
};

export default Hero;
