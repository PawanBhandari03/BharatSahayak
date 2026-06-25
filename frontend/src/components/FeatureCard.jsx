import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export default function FeatureCard({ icon, title, description, badge, color, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group rounded-2xl p-6 border transition-all duration-300 cursor-default"
      style={{
        background: '#1A1A26',
        borderColor: '#2A2A3E',
      }}
    >
      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `0 0 40px ${color}25`, border: `1px solid ${color}40` }}
      />

      {/* Top colored accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        {icon}
      </div>

      {/* Badge */}
      {badge && (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-3"
          style={{ background: `${color}20`, color }}
        >
          {badge}
        </span>
      )}

      {/* Content */}
      <h3 className="text-white font-bold text-lg mb-2 leading-snug">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>

      {/* Arrow indicator */}
      <div
        className="absolute bottom-5 right-5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
        style={{ background: `${color}25` }}
      >
        <span style={{ color }} className="text-sm">→</span>
      </div>
    </motion.div>
  );
}
