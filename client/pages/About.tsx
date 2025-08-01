import { motion } from "framer-motion";
import {
  GraduationCap,
  Target,
  Users,
  Award,
  BookOpen,
  Heart,
  Lightbulb,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const About = () => {
  const stats = [
    { number: "10,000+", label: "Students Helped", icon: Users },
    { number: "500+", label: "Resources Available", icon: BookOpen },
    { number: "15+", label: "Subjects Covered", icon: Target },
    { number: "100%", label: "Free Access", icon: Heart },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Resources",
      description:
        "Access study notes, past papers, textbook solutions, and more across all major subjects.",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description:
        "All resources are carefully reviewed and verified by educators before being published.",
    },
    {
      icon: Zap,
      title: "Always Free",
      description:
        "Education should be accessible to everyone. All our resources are completely free forever.",
    },
    {
      icon: Globe,
      title: "Global Community",
      description:
        "Join students worldwide in sharing knowledge and supporting each other's academic journey.",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Academic Excellence",
      description:
        "We believe every student deserves access to high-quality educational resources to achieve their academic goals.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Our platform thrives on the contributions and collaboration of students, teachers, and educators worldwide.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We continuously improve our platform with modern technology to enhance the learning experience.",
    },
    {
      icon: Heart,
      title: "Accessibility",
      description:
        "Education is a fundamental right. We ensure our resources are free and accessible to students everywhere.",
    },
  ];

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Detect if app is opened as APK / standalone PWA
  const [isStandalone, setIsStandalone] = useState(false);
  useEffect(() => {
    const standalone =
      (window.matchMedia &&
        window.matchMedia("(display-mode: standalone)").matches) ||
      (navigator as any).standalone;
    setIsStandalone(standalone);
  }, []);

  useEffect(() => {
    if (isStandalone) return; // Skip adding click logic if inside APK

    const button = buttonRef.current;
    if (!button) return;

    const handleClick = () => {
      if (!button.classList.contains("animate")) {
        button.classList.add("animate");

        setTimeout(() => {
          const userAgent = navigator.userAgent;
          const apkUrl =
            "https://github.com/jubinkhatri/eduvault/releases/download/eduvault-v1.0/Eduvault.apk";

          // iOS detection - show PWA install prompt
          if (/iPhone|iPad|iPod/i.test(userAgent)) {
            alert(
              "iOS devices cannot install APK files.\n\n👉 Please install Eduvault as a Progressive Web App (PWA) by clicking the 'Share' button in Safari and then 'Add to Home Screen'."
            );
          }
          // Android devices - direct APK download
          else if (/Android/i.test(userAgent)) {
            window.open(apkUrl, "_blank");
          }
          // Desktop browsers - force download
          else {
            const link = document.createElement("a");
            link.href = apkUrl;
            link.download = "Eduvault-v1.0.apk";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }

          setTimeout(() => {
            button.classList.remove("animate");
          }, 1000);
        }, 10000);
      }
    };

    button.addEventListener("click", handleClick);
    return () => button.removeEventListener("click", handleClick);
  }, [isStandalone]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full mb-6 sm:mb-8"
            >
              <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-4 sm:mb-6">
              About
              <span className="text-primary block">Eduvault</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Empowering students worldwide with free, high-quality educational
              resources to unlock their academic potential and achieve excellence.
            </p>

            {/* Download Button (only if NOT standalone) */}
            {!isStandalone && (
              <div className="mt-8 flex justify-center">
                <button ref={buttonRef} className="order">
                  <span className="default">Download Android App</span>
                  <span className="success">
                    Download Started
                    <svg viewBox="0 0 12 10">
                      <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </svg>
                  </span>
                  <div className="box"></div>
                  <div className="truck">
                    <div className="back"></div>
                    <div className="front">
                      <div className="window"></div>
                    </div>
                    <div className="light top"></div>
                    <div className="light bottom"></div>
                  </div>
                  <div className="lines"></div>
                </button>
              </div>
            )}
  {/* Installation Note (only if NOT standalone) */}
{!isStandalone && (
  <div className="mt-4 text-sm text-gray-600 max-w-md mx-auto">
    <div className="p-2 bg-blue-50 border border-blue-100 rounded-md">
      <p className="text-xs text-blue-700">
        <span className="font-medium">Note:</span>There might be a security warning because this app isn't on the Play Store yet.
It's completely safe made by student for students
      </p>
    </div>
  </div>
)}
</div>
</div>
</div>

      {/* Mission Section */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-4 sm:mb-6">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                At Eduvault, we believe that quality education should be
                accessible to every student, regardless of their economic background
                or geographical location. Our mission is to democratize access to
                educational resources and create a global community of learners
                supporting each other.
              </p>
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                We curate, organize, and distribute high-quality study materials,
                practice papers, and educational content to help students excel in
                their academic pursuits. Every resource on our platform is carefully
                reviewed to ensure accuracy and relevance.
              </p>
              <div className="bg-primary/5 border-l-4 border-primary p-4 sm:p-6 rounded-r-lg">
                <blockquote className="text-base sm:text-lg italic text-gray-800">
                  "Education is the most powerful weapon which you can use to
                  change the world."
                </blockquote>
                <cite className="text-xs sm:text-sm text-gray-600 mt-2 block">
                  — Nelson Mandela
                </cite>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-accent/20 rounded-full -mr-8 sm:-mr-16 -mt-8 sm:-mt-16"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-primary/20 rounded-full -ml-6 sm:-ml-12 -mb-6 sm:-mb-12"></div>
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 mb-2 sm:mb-4">
                    What Drives Us
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 text-gray-700 text-base sm:text-lg">
                    <li className="flex items-start space-x-2 sm:space-x-3">
                      <Award className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <span>Commitment to academic excellence and student success</span>
                    </li>
                    <li className="flex items-start space-x-2 sm:space-x-3">
                      <Users className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                      <span>Building a supportive global learning community</span>
                    </li>
                    <li className="flex items-start space-x-2 sm:space-x-3">
                      <Heart className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                      <span>Passionate belief in education as a fundamental right</span>
                    </li>
                    <li className="flex items-start space-x-2 sm:space-x-3">
                      <Lightbulb className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <span>Innovation in educational technology and accessibility</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2 sm:mb-4">
              Our Impact
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              Numbers that reflect our commitment to making quality education accessible to everyone
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div className="text-xl sm:text-3xl font-heading font-bold text-gray-900 mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2 sm:mb-4">
              Why Choose Eduvault?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              We're more than just a resource library - we're your academic companion
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center p-4 sm:p-6 border border-gray-200 rounded-lg hover:border-primary/20 hover:shadow-lg transition-all duration-200 bg-white"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-4">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2 sm:mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              The principles that guide everything we do at Eduvault
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white border border-gray-200 rounded-lg p-4 sm:p-8 hover:border-primary/20 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-heading font-semibold text-gray-900 mb-2 sm:mb-3">
                        {value.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2 sm:mb-4">
              Meet the Creator
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              Eduvault was founded with a simple vision: to make quality education accessible to every student
            </p>
          </div>
          <div className="max-w-2xl sm:max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 sm:p-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-heading font-bold text-white">
                  Edu
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-heading font-bold text-gray-900 mb-1 sm:mb-2">
                Developer and creator
              </h3>
              <p className="text-primary font-medium mb-2 sm:mb-4">
               Jubin Khatri and sulav adhikari
              </p>
              <p className="text-gray-700 leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
                Started as a student who understood the struggle of finding quality study materials, Eduvault was born from the desire to create a platform where students could access and share educational resources freely. Today, we continue to expand our mission of making education accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2 sm:mb-4">
            Join Our Mission
          </h2>
          <p className="text-base sm:text-xl text-primary-foreground/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Be part of a community that believes in the power of education to
            transform lives. Start exploring our resources today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="/resources"
              className="bg-white text-primary px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Resources
            </a>
            <a
              href="/contact"
              className="border border-white/20 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
      <style jsx global>{`
        .order {
          -webkit-appearance: none;
             -moz-appearance: none;
                  appearance: none;
          border: 0;
          background: #1C212E;
          position: relative;
          height: 63px;
          width: 240px;
          padding: 0;
          outline: none;
          cursor: pointer;
          border-radius: 32px;
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          -webkit-tap-highlight-color: transparent;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .order span {
          --o: 1;
          position: absolute;
          left: 0;
          right: 0;
          text-align: center;
          top: 19px;
          line-height: 24px;
          color: #FFF;
          font-size: 16px;
          font-weight: 500;
          opacity: var(--o);
          transition: opacity 0.3s ease;
        }
        .order span.default {
          transition-delay: 0.3s;
        }
        .order span.success {
          --offset: 16px;
          --o: 0;
        }
        .order span.success svg {
          width: 12px;
          height: 10px;
          display: inline-block;
          vertical-align: top;
          fill: none;
          margin: 7px 0 0 4px;
          stroke: #16BF78;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 16px;
          stroke-dashoffset: var(--offset);
          transition: stroke-dashoffset 0.3s ease;
        }
        .order:active {
          transform: scale(0.96);
        }
        .order .lines {
          opacity: 0;
          position: absolute;
          height: 3px;
          background: #FFF;
          border-radius: 2px;
          width: 6px;
          top: 30px;
          left: 100%;
          box-shadow: 15px 0 0 #FFF, 30px 0 0 #FFF, 45px 0 0 #FFF, 60px 0 0 #FFF, 75px 0 0 #FFF, 90px 0 0 #FFF, 105px 0 0 #FFF, 120px 0 0 #FFF, 135px 0 0 #FFF, 150px 0 0 #FFF, 165px 0 0 #FFF, 180px 0 0 #FFF, 195px 0 0 #FFF, 210px 0 0 #FFF, 225px 0 0 #FFF, 240px 0 0 #FFF, 255px 0 0 #FFF, 270px 0 0 #FFF, 285px 0 0 #FFF, 300px 0 0 #FFF, 315px 0 0 #FFF, 330px 0 0 #FFF;
        }
        .order .back,
        .order .box {
          --start: #FFF;
          --stop: #CDD9ED;
          border-radius: 2px;
          background: linear-gradient(var(--start), var(--stop));
          position: absolute;
        }
        .order .truck {
          width: 60px;
          height: 41px;
          left: 100%;
          z-index: 1;
          top: 11px;
          position: absolute;
          transform: translateX(24px);
        }
        .order .truck:before, .order .truck:after {
          --r: -90deg;
          content: "";
          height: 2px;
          width: 20px;
          right: 58px;
          position: absolute;
          display: block;
          background: #FFF;
          border-radius: 1px;
          transform-origin: 100% 50%;
          transform: rotate(var(--r));
        }
        .order .truck:before {
          top: 4px;
        }
        .order .truck:after {
          --r: 90deg;
          bottom: 4px;
        }
        .order .truck .back {
          left: 0;
          top: 0;
          width: 60px;
          height: 41px;
          z-index: 1;
        }
        .order .truck .front {
          overflow: hidden;
          position: absolute;
          border-radius: 2px 9px 9px 2px;
          width: 26px;
          height: 41px;
          left: 60px;
        }
        .order .truck .front:before, .order .truck .front:after {
          content: "";
          position: absolute;
          display: block;
        }
        .order .truck .front:before {
          height: 13px;
          width: 2px;
          left: 0;
          top: 14px;
          background: linear-gradient(#6C7486, #3F4656);
        }
        .order .truck .front:after {
          border-radius: 2px 9px 9px 2px;
          background: #275EFE;
          width: 24px;
          height: 41px;
          right: 0;
        }
        .order .truck .front .window {
          overflow: hidden;
          border-radius: 2px 8px 8px 2px;
          background: #7699FF;
          transform: perspective(4px) rotateY(3deg);
          width: 22px;
          height: 41px;
          position: absolute;
          left: 2px;
          top: 0;
          z-index: 1;
          transform-origin: 0 50%;
        }
        .order .truck .front .window:before, .order .truck .front .window:after {
          content: "";
          position: absolute;
          right: 0;
        }
        .order .truck .front .window:before {
          top: 0;
          bottom: 0;
          width: 14px;
          background: #1C212E;
        }
        .order .truck .front .window:after {
          width: 14px;
          top: 7px;
          height: 4px;
          position: absolute;
          background: rgba(255, 255, 255, 0.14);
          transform: skewY(14deg);
          box-shadow: 0 7px 0 rgba(255, 255, 255, 0.14);
        }
        .order .truck .light {
          width: 3px;
          height: 8px;
          left: 83px;
          transform-origin: 100% 50%;
          position: absolute;
          border-radius: 2px;
          transform: scaleX(0.8);
          background: #f0dc5f;
        }
        .order .truck .light:before {
          content: "";
          height: 4px;
          width: 7px;
          opacity: 0;
          transform: perspective(2px) rotateY(-15deg) scaleX(0.94);
          position: absolute;
          transform-origin: 0 50%;
          left: 3px;
          top: 50%;
          margin-top: -2px;
          background: linear-gradient(90deg, #f0dc5f, rgba(240, 220, 95, 0.7), rgba(240, 220, 95, 0));
        }
        .order .truck .light.top {
          top: 4px;
        }
        .order .truck .light.bottom {
          bottom: 4px;
        }
        .order .box {
          --start: #EDD9A9;
          --stop: #DCB773;
          width: 21px;
          height: 21px;
          right: 100%;
          top: 21px;
        }
        .order .box:before, .order .box:after {
          content: "";
          top: 10px;
          position: absolute;
          left: 0;
          right: 0;
        }
        .order .box:before {
          height: 3px;
          margin-top: -1px;
          background: rgba(0, 0, 0, 0.1);
        }
        .order .box:after {
          height: 1px;
          background: rgba(0, 0, 0, 0.15);
        }
        .order.animate .default {
          --o: 0;
          transition-delay: 0s;
        }
        .order.animate .success {
          --offset: 0;
          --o: 1;
          transition-delay: 7s;
        }
        .order.animate .success svg {
          transition-delay: 7.3s;
        }
        .order.animate .truck {
          animation: truck 10s ease forwards;
        }
        .order.animate .truck:before {
          animation: door1 2.4s ease forwards 0.3s;
        }
        .order.animate .truck:after {
          animation: door2 2.4s ease forwards 0.6s;
        }
        .order.animate .truck .light:before, .order.animate .truck .light:after {
          animation: light 10s ease forwards;
        }
        .order.animate .box {
          animation: box 10s ease forwards;
        }
        .order.animate .lines {
          animation: lines 10s ease forwards;
        }

        @keyframes truck {
          10%, 30% {
            transform: translateX(-164px);
          }
          40% {
            transform: translateX(-104px);
          }
          60% {
            transform: translateX(-224px);
          }
          75%, 100% {
            transform: translateX(24px);
          }
        }
        @keyframes lines {
          0%, 30% {
            opacity: 0;
            transform: scaleY(0.7) translateX(0);
          }
          35%, 65% {
            opacity: 1;
          }
          70% {
            opacity: 0;
          }
          100% {
            transform: scaleY(0.7) translateX(-400px);
          }
        }
        @keyframes light {
          0%, 30% {
            opacity: 0;
            transform: perspective(2px) rotateY(-15deg) scaleX(0.88);
          }
          40%, 100% {
            opacity: 1;
            transform: perspective(2px) rotateY(-15deg) scaleX(0.94);
          }
        }
        @keyframes door1 {
          30%, 50% {
            transform: rotate(32deg);
          }
        }
        @keyframes door2 {
          30%, 50% {
            transform: rotate(-32deg);
          }
        }
        @keyframes box {
          8%, 10% {
            transform: translateX(40px);
            opacity: 1;
          }
          25% {
            transform: translateX(112px);
            opacity: 1;
          }
          26% {
            transform: translateX(112px);
            opacity: 0;
          }
          27%, 100% {
            transform: translateX(0px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
