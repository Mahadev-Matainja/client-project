"use client";

import { toast } from "@/hooks/use-toast";
import {
  DoctorDSheduleDelete,
  sheduleFetch,
  SheduleSave,
} from "@/services/ClinicService";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  id: number; // UI only
  scheduleId?: number; // backend id
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
  doctorId,
}: {
  open: boolean;
  onClose: () => void;
  doctorId: number | null;
}) {
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [saved, setSaved] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctorName, setDoctorName] = useState({ fname: "", lname: "" });

  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    if (!doctorId) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const res = await sheduleFetch(doctorId);

        if (res.success && res.data?.doctors) {
          const { fname, lname } = res.data.doctors;
          setDoctorName({ fname, lname });
        }

        if (res.success && res.data?.doctor_timetables?.length) {
          const apiRows: Row[] = res.data.doctor_timetables.map((t: any) => ({
            id: Date.now() + Math.random(),
            scheduleId: t.id,
            day: t.day,
            startTime: t.start_time,
            endTime: t.end_time,
          }));
          setSaved(apiRows);
        } else {
          setSaved([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [doctorId]);

  /* ---------------- FORM ---------------- */
  const updateRow = (id: number, key: keyof Row, value: string) => {
    setRows((r) =>
      r.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const addRow = () => setRows((r) => [...r, emptyRow()]);
  const removeRow = (id: number) =>
    rows.length > 1 && setRows((r) => r.filter((x) => x.id !== id));

  const isSaveDisabled = rows.some((r) => !r.startTime || !r.endTime);

  /* ---------------- SAVE ---------------- */
  const saveRows = async () => {
    if (!doctorId) return;

    const validRows = rows.filter((r) => r.startTime && r.endTime);

    if (!validRows.length) {
      toast({
        title: "No time slots ❌",
        description: "Please add at least one visiting hour.",
      });
      return;
    }

    // Expand "All" into all days
    const payload = validRows.flatMap((r) =>
      r.day === "All"
        ? DAYS.slice(0, 7).map((day) => ({
            day,
            startTime: r.startTime,
            endTime: r.endTime,
          }))
        : [
            {
              day: r.day,
              startTime: r.startTime,
              endTime: r.endTime,
            },
          ]
    );

    console.log("Saving schedule 👉", payload);

    try {
      const res = await SheduleSave(doctorId, payload);

      toast({
        title: "Saved Successfully 🎉",
        description: res?.message || "Schedule updated successfully.",
      });

      // reset form
      setRows([emptyRow()]);
      setSelected([]);
      setSelectAll(false);

      // refresh saved schedules
      const refreshed = await sheduleFetch(doctorId);

      const updated = refreshed.data.doctor_timetables.map((t: any) => ({
        id: Date.now() + Math.random(),
        scheduleId: t.id,
        day: t.day,
        startTime: t.start_time,
        endTime: t.end_time,
      }));

      setSaved(updated);
    } catch (err: any) {
      toast({
        title: "Save Failed ❌",
        description: err?.message || "Schedule conflict detected",
      });
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteRow = async (scheduleId?: number) => {
    if (!doctorId || !scheduleId) return;

    try {
      await DoctorDSheduleDelete(doctorId, [scheduleId]);
      setSaved((prev) => prev.filter((r) => r.scheduleId !== scheduleId));
      setSelected((prev) => prev.filter((id) => id !== scheduleId));

      toast({ title: "Deleted 🗑️" });
    } catch (err: any) {
      toast({
        title: "Delete Failed ❌",
        description: err?.message,
      });
    }
  };

  const handleBulkDelete = async () => {
    if (!doctorId || !selected.length) return;

    try {
      await DoctorDSheduleDelete(doctorId, selected);
      setSaved((prev) => prev.filter((r) => !selected.includes(r.scheduleId!)));
      setSelected([]);
      setSelectAll(false);

      toast({ title: "Deleted Successfully 🗑️" });
    } catch (err: any) {
      toast({ title: "Bulk delete failed ❌" });
    }
  };

  /* ---------------- SELECT ---------------- */
  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(saved.map((r) => r.scheduleId!).filter(Boolean));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOne = (id?: number) => {
    if (!id) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const hr = h % 12 || 12;
    return `${hr}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };

  /* ---------------- UI ---------------- */
  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />

      <div className="fixed top-2 left-1/2 -translate-x-1/2 w-[700px] h-[70vh] bg-white z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">
            Edit schedule of {doctorName.fname} {doctorName.lname}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {rows.map((row, i) => (
            <div key={row.id} className="grid grid-cols-4 gap-4 mb-4">
              <select
                value={row.day}
                onChange={(e) => updateRow(row.id, "day", e.target.value)}
                className="border rounded px-3 py-2"
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

              <div className="flex gap-2">
                {rows.length > 1 && (
                  <button onClick={() => removeRow(row.id)}>
                    <Trash2 size={16} />
                  </button>
                )}
                {i === rows.length - 1 && (
                  <button onClick={addRow}>
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={saveRows}
            disabled={isSaveDisabled}
            className="bg-red-600 text-white px-6 py-2 rounded mt-4 disabled:bg-gray-300 cursor-pointer"
          >
            Add to Schedule
          </button>
        </div>

        {/* Table */}
        <div className="p-6">
          {selected.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="mb-3 bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Delete All ({selected.length})
            </button>
          )}

          <table className="w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 border">Day</th>
                <th className="p-3 border">Visiting Hours</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {saved.map((r) => (
                <tr key={r.id}>
                  <td className="p-3 border text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(r.scheduleId!)}
                      onChange={() => handleSelectOne(r.scheduleId)}
                    />
                  </td>
                  <td className="p-3 border text-center">{r.day}</td>
                  <td className="p-3 border text-center">
                    {formatTime(r.startTime)} – {formatTime(r.endTime)}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleDeleteRow(r.scheduleId)}
                      className="bg-red-600 text-white p-2 rounded cursor-pointer"
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
