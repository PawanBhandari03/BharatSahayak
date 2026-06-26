import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const DEFAULT_CHART = [
  { name: 'Received',  value: 0, color: '#1D9E75' },
  { name: 'Available', value: 0, color: '#7C3AED' },
  { name: 'Pending',   value: 0, color: '#E65100' },
  { name: 'Future',    value: 0, color: '#2196F3' },
];

function MetricCard({ label, value, color, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl border"
      style={{ background: `${color}0D`, borderColor: `${color}30` }}
    >
      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className="text-xl font-black rupee" style={{ color }}>
        ₹{inView && value > 0
          ? <CountUp end={value} duration={1.8} separator="," />
          : value.toLocaleString('en-IN')
        }
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    const d = payload[0];
    return (
      <div className="px-4 py-3 rounded-xl border text-sm"
        style={{ background: '#221E3D', borderColor: '#2E2856' }}>
        <div className="font-bold" style={{ color: d.payload.color }}>{d.name}</div>
        <div className="text-white">₹{d.value.toLocaleString('en-IN')}</div>
      </div>
    );
  }
  return null;
}

// wallet prop is passed from Dashboard (computed dynamically)
// Falls back to zeros if not provided
export default function BenefitWallet({ wallet }) {
  const w = wallet || {
    total: 0, received: 0, available: 0, pending: 0, future: 0, count: 0,
    chartData: DEFAULT_CHART,
  };

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  const hasData = w.total > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border overflow-hidden"
      style={{ background: '#221E3D', borderColor: '#2E2856' }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-dark-border flex items-center justify-between"
        style={{ background: '#1A1633' }}>
        <div>
          <h3 className="text-white font-bold text-lg">💰 Benefit Wallet</h3>
          <p className="text-white/40 text-xs">
            {hasData
              ? `${w.count} scheme${w.count !== 1 ? 's' : ''} matched for your profile`
              : 'Register to see your matched schemes'}
          </p>
        </div>
        {hasData && (
          <div className="text-right">
            <div className="text-white/40 text-xs">Total Eligible</div>
            <div className="text-2xl font-black text-secondary rupee">
              ₹{inView
                ? <CountUp end={w.total} duration={2.2} separator="," />
                : w.total.toLocaleString('en-IN')
              }
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {!hasData ? (
          <div className="text-center py-10 text-white/30">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No schemes matched yet.</p>
            <p className="text-xs mt-1">Register with your details to see your benefit wallet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Chart */}
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={w.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={inView ? 0 : 9999}
                    animationDuration={1200}
                  >
                    {w.chartData.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={val => (
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{val}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Received"  value={w.received}  color="#1D9E75" delay={0.1} />
              <MetricCard label="Available" value={w.available} color="#7C3AED" delay={0.2} />
              <MetricCard label="Pending"   value={w.pending}   color="#E65100" delay={0.3} />
              <MetricCard label="Future"    value={w.future}    color="#2196F3" delay={0.4} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
