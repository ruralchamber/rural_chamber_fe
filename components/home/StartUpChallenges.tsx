'use client'

import { motion , Variants} from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const StartupChallenges = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants : Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2,
      },
    },
  };

  const stats = [
    {
      value: "71%",
      title: "First Year Failure Rate",
      description: "71% of new small businesses fall within their first year."
    },
    {
      value: "70–80%",
      title: "Five-Year Failure Rate",
      description: "Between 70% and 80% of small businesses do not survive beyond five years."
    },
    {
      value: "1,907",
      title: "Business Liquidation",
      description: "In 2022, 1,907 businesses were liquidated, with sectors like financing, insurance, real estate, business services, trade, catering, and accommodation being the most affected."
    },
    {
      value: "10%",
      title: "Survival Rate After 10 Years",
      description: "With trial gravida sit cursus incidental elimination ulamcorper malassada et non sed per us."
    }
  ];

  return (
    <div className="w-full  max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="space-y-20"
      >
        {/* Main Title */}
        <motion.h1 
          variants={itemVariants} 
          className="text-3xl sm:text-4xl lg:text-5xl max-w-5xl mx-auto font-bold text-center mb-8"
          style={{ color: '#490F13' }}
        >
          Challenges Faced by Start-ups in South Africa
        </motion.h1>

        {/* Intro Paragraph */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed"
        >
          Start-ups in South Africa often fail due to limited funding, poor financial management, and economic instability. 
          High inflation, load shedding, and bureaucratic red tape increase costs and hinder growth. 
          Intense competition and lack of mentorship further challenge sustainability, causing many businesses to collapse within their first few years.
        </motion.p>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-6 lg:gap-8 mt-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className=" p-6 lg:p-8  hover:shadow-md transition-all duration-300"
            >
              <motion.div
                className="text-4xl lg:text-5xl font-bold text-[#490F13] mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 100 }}
              >
                {stat.value}
              </motion.div>
              <motion.h3
                className="text-xl lg:text-2xl font-semibold mb-3"
                style={{ color: '#A40F11' }}
              >
                {stat.title}
              </motion.h3>
              <motion.p
                className="text-gray-600 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                {stat.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        

        {/* Solution Section */}
        <motion.div
          variants={itemVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6"
            style={{ color: '#490F13' }}
          >
            The Solution
          </motion.h2>
          <motion.p
            className="text-lg text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            Entrepreneurs, particularly those in small, medium, and micro enterprises (SMMEs), face challenges in growing their businesses and accessing essential resources. 
            A support system that provides a networking platform can help accelerate business development, broaden market reach, and integrate SMMEs into the mainstream economy. 
            By offering master classes across various industries, entrepreneurs can gain valuable skills and knowledge to overcome challenges and drive success.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StartupChallenges;