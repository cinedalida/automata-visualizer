import { motion } from 'motion/react';
import { State, Transition, PDAState, PDATransition } from '../types';

interface GraphViewProps {
  states: State[] | PDAState[];
  transitions: Transition[] | PDATransition[];
  activeStateId?: string;
  activeTransitionIdx?: number;
  width?: number;
  height?: number;
}

export default function GraphView({ 
  states, 
  transitions, 
  activeStateId, 
  activeTransitionIdx,
  width = 800, 
  height = 400 
}: GraphViewProps) {
  
  // Helper to find state by id
  const findState = (id: string) => states.find(s => s.id === id);

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden" style={{ width, height }}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <svg width={width} height={height} className="relative z-10 overflow-visible">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
          </marker>
        </defs>

        {/* Transitions */}
        {transitions.map((t, idx) => {
          const from = findState(t.from);
          const to = findState(t.to);
          if (!from || !to) return null;

          const isActive = idx === activeTransitionIdx;
          const symbol = 'symbol' in t ? (t as Transition).symbol : 
                         `${(t as PDATransition).input || 'ε'},${(t as PDATransition).pop || 'ε'}→${(t as PDATransition).push || 'ε'}`;

          // Self loop
          if (t.from === t.to) {
            return (
              <g key={`t-${idx}`}>
                <path
                  d={`M ${from.x} ${from.y - 20} C ${from.x - 40} ${from.y - 80}, ${from.x + 40} ${from.y - 80}, ${from.x} ${from.y - 20}`}
                  fill="none"
                  stroke={isActive ? '#0077B6' : '#334155'}
                  strokeWidth="2"
                  markerEnd={`url(#${isActive ? 'arrowhead-active' : 'arrowhead'})`}
                />
                <text
                  x={from.x}
                  y={from.y - 85}
                  textAnchor="middle"
                  className={`text-[10px] font-mono ${isActive ? 'fill-sky-400 font-bold' : 'fill-slate-500'}`}
                >
                  {symbol}
                </text>
              </g>
            );
          }

          // Straight line with slight curve if bidirectional
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const angle = Math.atan2(dy, dx);
          
          // Offset to avoid overlapping with circles
          const nodeRadius = 25;
          const startX = from.x + Math.cos(angle) * nodeRadius;
          const startY = from.y + Math.sin(angle) * nodeRadius;
          const endX = to.x - Math.cos(angle) * nodeRadius;
          const endY = to.y - Math.sin(angle) * nodeRadius;

          // Curve logic for bidirectional edges
          const isBidirectional = transitions.some(other => other.from === t.to && other.to === t.from);
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          
          let pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
          let textX = midX;
          let textY = midY - 10;

          if (isBidirectional) {
            const cpX = midX + Math.cos(angle + Math.PI/2) * 20;
            const cpY = midY + Math.sin(angle + Math.PI/2) * 20;
            pathD = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
            textX = cpX;
            textY = cpY - 5;
          }

          return (
            <g key={`t-${idx}`}>
              <motion.path
                d={pathD}
                fill="none"
                stroke={isActive ? '#0077B6' : '#334155'}
                strokeWidth="2"
                markerEnd={`url(#${isActive ? 'arrowhead-active' : 'arrowhead'})`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                className={`text-[10px] font-mono ${isActive ? 'fill-sky-400 font-bold' : 'fill-slate-500'}`}
              >
                {symbol}
              </text>
            </g>
          );
        })}

        {/* States */}
        {states.map((s) => {
          const isActive = s.id === activeStateId;
          return (
            <g key={s.id}>
              {s.isStart && (
                <path
                  d={`M ${s.x - 50} ${s.y} L ${s.x - 25} ${s.y}`}
                  stroke="#64748b"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              )}
              <motion.circle
                cx={s.x}
                cy={s.y}
                r="25"
                className={`${
                  isActive 
                    ? 'fill-[#0077B6] stroke-sky-400' 
                    : s.isAccept 
                      ? 'fill-emerald-900/40 stroke-emerald-500' 
                      : 'fill-slate-800 stroke-slate-700'
                }`}
                strokeWidth="2"
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              />
              {s.isAccept && (
                <circle
                  cx={s.x}
                  cy={s.y}
                  r="20"
                  fill="none"
                  stroke={isActive ? '#818cf8' : '#10b981'}
                  strokeWidth="1"
                />
              )}
              <text
                x={s.x}
                y={s.y + 5}
                textAnchor="middle"
                className={`text-xs font-bold pointer-events-none ${isActive ? 'fill-white' : 'fill-slate-300'}`}
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
