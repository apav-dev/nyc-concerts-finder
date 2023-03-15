import * as React from "react";

type LabeledDividerProps = {
  label: string;
};

const LabeledDivider = ({ label }: LabeledDividerProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full rounded-lg border-t border-gray-300" />
      </div>
      <div className="relative flex justify-start">
        <span
          className="rounded-lg bg-gray-300 py-1 pr-3 pl-1 font-bowlby text-base font-semibold leading-6 text-pink-600"
          style={{ fontSize: "24px", lineHeight: "32px" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default LabeledDivider;
