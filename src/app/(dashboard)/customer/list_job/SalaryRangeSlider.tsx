"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

const MIN = 20000;
const MAX = 300000;
const STEP = 5000;

function fmt(n: number) {
  return `$${(n / 1000).toFixed(0)}k`;
}

export function SalaryRangeSlider() {
  const [range, setRange] = useState([50000, 50000]);
  const label = range[0] === range[1] ? fmt(range[0]) : `${fmt(range[0])} – ${fmt(range[1])}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-700">{label}</span>
        <span className="text-xs text-zinc-400">/ year</span>
      </div>

      <Slider
        min={MIN}
        max={MAX}
        step={STEP}
        value={range}
        onValueChange={setRange}
      />

      <div className="flex justify-between text-[11px] text-zinc-400">
        <span>{fmt(MIN)}</span>
        <span>{fmt(MAX)}+</span>
      </div>

      <input type="hidden" name="salary_range" value={label} />
    </div>
  );
}
