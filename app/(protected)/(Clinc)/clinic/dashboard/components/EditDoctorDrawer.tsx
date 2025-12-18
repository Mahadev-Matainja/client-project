"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "All",
];

type Row = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
};

const emptyRow = (): Row => ({
  id: Date.now(),
  day: "Sunday",
  startTime: "",
  endTime: "",
});

export default function VisitingHoursDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [saved, setSaved] = useState<Row[]>([]);

  const updateRow = (id: number, key: keyof Row, value: string) => {
    setRows((r) =>
      r.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const addRow = () => setRows((r) => [...r, emptyRow()]);

  const removeRow = (id: number) =>
    rows.length > 1 && setRows((r) => r.filter((x) => x.id !== id));

  const isSaveDisabled = rows.some((r) => !r.startTime || !r.endTime);

  const formatTime = (time: string) => {
    if (!time) return "";

    const [h, m] = time.split(":").map(Number);
    const hour12 = h % 12 || 12;
    const ampm = h >= 12 ? "PM" : "AM";

    return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const saveRows = () => {
    const valid = rows.filter((r) => r.day && r.startTime && r.endTime);

    // if (!valid.length) return alert("Add at least one time slot");

    const expanded = valid.flatMap((r) =>
      r.day === "All"
        ? DAYS.slice(0, 7).map((d) => ({
            ...r,
            id: Date.now() + Math.random(),
            day: d,
          }))
        : [{ ...r, id: Date.now() + Math.random() }]
    );

    setSaved((prev) =>
      [...prev, ...expanded].filter(
        (v, i, arr) =>
          i ===
          arr.findIndex(
            (x) =>
              x.day === v.day &&
              x.startTime === v.startTime &&
              x.endTime === v.endTime
          )
      )
    );

    setRows([emptyRow()]);
  };

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />
      )}

      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[70vh] bg-white z-50
        transition-transform duration-300 overflow-y-auto
        ${open ? "translate-y-0 top-2 " : "-translate-y-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">
            Edit schedule of Dr. Basab Mondal
          </h2>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {rows.map((row, i) => (
            <div key={row.id} className="grid grid-cols-4 gap-4 mb-4 ">
              <select
                value={row.day}
                onChange={(e) => updateRow(row.id, "day", e.target.value)}
                className=" border rounded px-3 py-2"
              >
                {DAYS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <input
                type="time"
                value={row.startTime}
                onChange={(e) => updateRow(row.id, "startTime", e.target.value)}
                className="border rounded px-3 py-2"
              />

              <input
                type="time"
                value={row.endTime}
                onChange={(e) => updateRow(row.id, "endTime", e.target.value)}
                className="border rounded px-3 py-2"
              />

              <div className="flex items-center justify-start gap-1">
                {rows.length > 1 && (
                  <button
                    onClick={() => removeRow(row.id)}
                    className="w-5 h-5 flex items-center justify-center
                 rounded-full border text-red-600 pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {i === rows.length - 1 && (
                  <button
                    onClick={addRow}
                    className="w-5 h-5 flex items-center justify-center
                 rounded-full bg-blue-600 text-white
                 hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={saveRows}
            disabled={isSaveDisabled}
            className={`mt-4 px-6 py-2 rounded font-medium text-white
    ${
      isSaveDisabled
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-red-600 hover:bg-red-700 cursor-pointer"
    }`}
          >
            Add to Schedule
          </button>
        </div>

        {/* Table */}
        <div className="p-6">
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border text-center font-medium">Day</th>
                <th className="p-3 border text-center font-medium">
                  Visiting Hours
                </th>
                <th className="p-3 border text-center font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {saved.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium text-center">
                    {r.day}
                  </td>
                  <td className="p-3 border text-center">
                    {formatTime(r.startTime)} – {formatTime(r.endTime)}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() =>
                        setSaved((s) => s.filter((x) => x.id !== r.id))
                      }
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
