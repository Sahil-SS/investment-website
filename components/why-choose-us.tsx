"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Zap, LineChart } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Bank-Level Security",
    description: "Your investments are protected with enterprise-grade encryption and security protocols.",
    icon: Shield,
    color: "from-blue-600 to-blue-400",
  },
  {
    title: "Lightning Fast",
    description: "Execute trades and manage your portfolio in real-time with our optimized platform.",
    icon: Zap,
    color: "from-purple-600 to-purple-400",
  },
  {
    title: "Smart Analytics",
    description: "Make informed decisions with advanced analytics and market insights powered by AI.",
    icon: LineChart,
    color: "from-green-600 to-green-400",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="py-24 px-6 bg-black/80">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Why Choose <span className="text-blue-400">InvestWise</span>?
        </motion.h2>
        <motion.p
          className="text-gray-300 text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Experience the future of investment management with our cutting-edge platform
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="glass-card bg-white/5 backdrop-blur-md border border-white/10 group hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-tr ${feature.color} group-hover:animate-glow-pulse`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseSection;
