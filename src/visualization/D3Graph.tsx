import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { State, Transition } from "../types";

interface D3GraphProps {
  states: State[];
  transitions: Transition[];
  activeStateId?: string;
  activeTransitionIdx?: number;
  width?: number;
  height?: number;
}

const D3Graph: React.FC<D3GraphProps> = ({
  states,
  transitions,
  activeStateId,
  activeTransitionIdx,
  width = 800,
  height = 500,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Marker for arrows
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26)
      .attr("refY", 0)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#4b5563");

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead-active")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26)
      .attr("refY", 0)
      .attr("markerWidth", 7)
      .attr("markerHeight", 7)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#6366f1");

    // Simulation nodes and links
    const nodes = states.map((s) => ({ ...s }));

    // Group transitions by source and target to avoid overlapping lines
    const linkGroups = new Map<string, any>();
    transitions.forEach((t, i) => {
      const key = `${t.from}-${t.to}`;
      const isActive = i === activeTransitionIdx;
      if (!linkGroups.has(key)) {
        linkGroups.set(key, {
          source: t.from,
          target: t.to,
          labels: [{ text: t.symbol, active: isActive }],
          isActive: isActive,
        });
      } else {
        const group = linkGroups.get(key);
        group.labels.push({ text: t.symbol, active: isActive });
        if (isActive) group.isActive = true;
      }
    });

    const links = Array.from(linkGroups.values());

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(90));

    // Draw links
    const link = g
      .append("g")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "transition-path")
      .attr("stroke", (d: any) => (d.isActive ? "#6366f1" : "#1e293b"))
      .attr("stroke-width", (d: any) => (d.isActive ? 3 : 2))
      .attr("fill", "none")
      .attr("marker-end", (d: any) =>
        d.isActive ? "url(#arrowhead-active)" : "url(#arrowhead)",
      );

    // Link labels
    const linkLabel = g
      .append("g")
      .selectAll("text")
      .data(links)
      .enter()
      .append("text")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("text-anchor", "middle")
      .each(function (d: any) {
        const el = d3.select(this);
        d.labels.forEach((label: any, i: number) => {
          el.append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? 0 : "1.1em")
            .attr(
              "fill",
              label.active ? "#818cf8" : d.isActive ? "#334155" : "#64748b",
            )
            .attr("font-weight", label.active ? "bold" : "normal")
            .attr("opacity", label.active ? 1 : d.isActive ? 0.3 : 1)
            .text(label.text);
        });
      });

    // Draw nodes
    const node = g.append("g").selectAll("g").data(nodes).enter().append("g");

    node
      .append("circle")
      .attr("r", 28)
      .attr("fill", (d: any) =>
        d.id === activeStateId ? "#6366f1" : "#0f172a",
      )
      .attr("stroke", (d: any) => {
        if (d.id === activeStateId) return "#818cf8";
        if (d.isAccept) return "#10b981";
        return "#334155";
      })
      .attr("stroke-width", (d: any) => (d.isAccept ? 3 : 2))
      .attr("class", "transition-all duration-3000");

    // Double circle for accept states
    node
      .filter((d: any) => d.isAccept)
      .append("circle")
      .attr("r", 16)
      .attr("fill", "none")
      .attr("stroke", "#10b981")
      .attr("stroke-width", 1);

    // Labels
    node
      .append("text")
      .text((d: any) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("fill", (d: any) =>
        d.id === activeStateId ? "#ffffff" : "#94a3b8",
      )
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

    // Start arrow
    node
      .filter((d: any) => d.isStart)
      .append("path")
      .attr("d", "M -40 0 L -25 0")
      .attr("stroke", "#475569")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    // Run simulation for a bit then stop for a static layout
    for (let i = 0; i < 300; ++i) simulation.tick();
    simulation.stop();

    // Calculate bounds to center the graph
    const xMin = (d3.min(nodes, (d: any) => d.x) as unknown as number) ?? 0;
    const xMax = (d3.max(nodes, (d: any) => d.x) as unknown as number) ?? width;
    const yMin = (d3.min(nodes, (d: any) => d.y) as unknown as number) ?? 0;
    const yMax =
      (d3.max(nodes, (d: any) => d.y) as unknown as number) ?? height;

    const graphWidth = xMax - xMin;
    const graphHeight = yMax - yMin;
    const centerX = (xMax + xMin) / 2;
    const centerY = (yMax + yMin) / 2;

    const scale = Math.min(
      0.9,
      width / (graphWidth + 100),
      height / (graphHeight + 100),
    );
    const tx = width / 2 - centerX * scale;
    const ty = height / 2 - centerY * scale;

    g.attr("transform", `translate(${tx},${ty}) scale(${scale})`);

    // Update positions once after simulation settlement
    link.attr("d", (d: any) => {
      const isSelfLoop = d.source.id === d.target.id;
      if (isSelfLoop) {
        const x = d.source.x,
          y = d.source.y;
        return `M ${x} ${y} C ${x - 40} ${y - 60}, ${x + 40} ${y - 60}, ${x} ${y}`;
      }

      // Check if there is a reverse link
      const hasReverse = links.some(
        (l) => l.source.id === d.target.id && l.target.id === d.source.id,
      );
      if (hasReverse) {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        // Curve to one side
        return `M ${d.source.x},${d.source.y} A ${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      }

      return `M ${d.source.x},${d.source.y} L ${d.target.x},${d.target.y}`;
    });

    linkLabel.each(function (d: any) {
      const el = d3.select(this);
      const isSelfLoop = d.source.id === d.target.id;
      const hasReverse = links.some(
        (l) => l.source.id === d.target.id && l.target.id === d.source.id,
      );

      let x, y;
      if (isSelfLoop) {
        x = d.source.x;
        y = d.source.y - 65;
      } else if (hasReverse) {
        // Find mid point of the arc
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);

        // Midpoint of the straight line
        const midX = (d.source.x + d.target.x) / 2;
        const midY = (d.source.y + d.target.y) / 2;

        // Offset perpendicular to the line
        const angle = Math.atan2(dy, dx);
        const offset = 30; // Push label out from the arc
        x = midX + Math.sin(angle) * offset;
        y = midY - Math.cos(angle) * offset;
      } else {
        x = (d.source.x + d.target.x) / 2;
        y = (d.source.y + d.target.y) / 2 - 5;
      }

      el.attr("x", x).attr("y", y);
      el.selectAll("tspan").attr("x", x);
    });

    node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
  }, [states, transitions, activeStateId, activeTransitionIdx, width, height]);

  return (
    <div className="w-full h-full bg-slate-950 rounded-3xl overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block"
      />
    </div>
  );
};

export default D3Graph;
