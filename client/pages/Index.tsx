import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Star,
  ArrowRight,
  GraduationCap,
  Calculator,
  FlaskConical,
  Globe,
  Book,
  Microscope,
  Users,
  Award,
  Target,
} from "lucide-react";
import { loadResources, type Resource } from "../utils/localStorage";

const Index = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadResources();
      setResources(data);
      setFeaturedResources(data.filter((r) => r.featured).slice(0, 3));
    };
    loadData();
  }, []);

  const subjects = [
    {
      name: "Math",
      icon: Calculator,
      color: "bg-blue-500",
      count: resources.filter((r) => r.subject === "Math").length,
    },
    {
      name: "Physics",
      icon: Target,
      color: "bg-purple-500",
      count: resources.filter((r) => r.subject === "Physics").length,
    },
    {
      name: "Chemistry",
      icon: FlaskConical,
      color: "bg-green-500",
      count: resources.filter((r) => r.subject === "Chemistry").length,
    },
    {
      name: "Biology",
      icon: Microscope,
      color: "bg-red-500",
      count: resources.filter((r) => r.subject === "Biology").length,
    },
    {
      name: "English",
      icon: Book,
      color: "bg-yellow-500",
      count: resources.filter((r) => r.subject === "English").length,
    },
    {
      name: "History",
      icon: Globe,
      color: "bg-indigo-500",
      count: resources.filter((r) => r.subject === "History").length,
    },
  ];

  const grades = [
  { grade: "10", count: resources.filter((r) => r.grade === "10").length },
  { grade: "11", count: resources.filter((r) => r.grade === "11").length },
  { grade: "12", count: resources.filter((r) => r.grade === "12").length },
  { grade: "Bachelors", count: resources.filter((r) => r.grade === "Bachelors").length },
];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-8"
            >
              <GraduationCap className="h-10 w-10 text-white" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
              Your Gateway to
              <span className="text-primary block">Academic Excellence</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Access thousands of high-quality study materials, practice papers,
              and educational resources to excel in your academic journey. All
              resources are carefully curated and completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/resources"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <BookOpen className="h-5 w-5" />
                <span>Browse Resources</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/request"
                className="btn-accent inline-flex items-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Request Material</span>
              </Link>
            </div>

            {/* Featured Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto"
            >
              <p className="text-lg font-medium text-gray-800 italic">
                \"Education is the most powerful weapon which you can use to
                change the world.\"
              </p>
              <p className="text-sm text-gray-600 mt-2">— Nelson Mandela</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Browse by Subject */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Browse by Subject
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive collection of study materials organized
              by subject areas
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {subjects.map((subject, index) => {
              const Icon = subject.icon;
              return (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Link
                    to={`/resources?subject=${subject.name}`}
                    className="block bg-white border-2 border-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center transition-all duration-200 hover:border-primary/20 hover:shadow-lg"
                  >
                    <div
                      className={`${subject.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-heading font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                      {subject.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {subject.count} resources
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse by Grade */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Browse by Grade
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find resources specifically tailored for your grade level
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {grades.map((item, index) => (
              <motion.div
                key={item.grade}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  to={`/resources?grade=${item.grade}`}
                  className="block bg-white border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center transition-all duration-200 hover:border-primary hover:shadow-lg group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="text-lg sm:text-2xl font-heading font-bold">
                      {item.grade}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-semibold text-gray-900 mb-2">
                    Grade {item.grade}
                  </h3>
                  <p className="text-gray-600">
                    {item.count} resources available
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Featured Resources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Top-rated study materials handpicked by our educational experts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-primary">
                          {resource.subject}
                        </span>
                        <p className="text-xs text-gray-500">
                          Grade {resource.grade}
                        </p>
                      </div>
                    </div>
                    <Star className="h-5 w-5 text-accent fill-current" />
                  </div>

                  <h3 className="font-heading font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/viewer/${resource.id}`}
                      className="text-primary hover:text-primary/80 text-sm font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/resources"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium"
            >
              <span>View All Resources</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-heading font-bold mb-2">
                {resources.length}
              </div>
              <div className="text-primary-foreground/80">Study Resources</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-3xl font-heading font-bold mb-2">
                {subjects.length}
              </div>
              <div className="text-primary-foreground/80">Subjects Covered</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl font-heading font-bold mb-2">
                {grades.length}
              </div>
              <div className="text-primary-foreground/80">Grade Levels</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl font-heading font-bold mb-2">100%</div>
              <div className="text-primary-foreground/80">Free Access</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
