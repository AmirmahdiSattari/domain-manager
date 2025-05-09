import React, { useMemo, useState } from "react";

export default function DomainTable({ domains, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredDomains = useMemo(() => {
    let result = [...domains];

    // Search filter
    if (searchTerm.trim()) {
      result = result.filter((d) =>
        d.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((d) => d.status === statusFilter.toLowerCase());
    }

    // Sort logic
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "domain") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (sortField === "createdDate") {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [domains, searchTerm, sortField, sortOrder, statusFilter]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="overflow-x-auto w-11/12 mx-auto rounded-2xl">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        {/* Search Box */}
        <input
          type="text"
          placeholder="جستجو بر اساس دامنه..."
          className="input input-bordered w-full sm:max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Status Filter */}
        <div className="filter flex gap-2 flex-wrap items-center">
          {[
            { label: "همه", value: "All" },
            { label: "تایید شده", value: "verified" },
            { label: "در انتظار", value: "pending" },
            { label: "رد شده", value: "rejected" },
          ].map(({ label, value }) => (
            <label key={value}>
              <input
                type="radio"
                name="statusFilter"
                className="hidden"
                value={value}
                checked={statusFilter === value}
                onChange={() => setStatusFilter(value)}
              />
              <span
                className={`btn ${
                  statusFilter === value
                    ? "btn  btn-soft btn-accent"
                    : "btn-ghost"
                }`}
              >
                {label}
              </span>
            </label>
          ))}

          {/* Clear Filter Button */}
          {statusFilter !== "All" && (
            <button
              className="btn btn-outline btn-error btn-sm"
              onClick={() => setStatusFilter("All")}
            >
              ❌ پاک کردن فیلتر
            </button>
          )}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2 mb-4 text-sm text-gray-500">
        <span>مرتب‌سازی بر اساس:</span>
        <button className="btn btn-xs" onClick={() => handleSort("domain")}>
          دامنه {sortField === "domain" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          className="btn btn-xs"
          onClick={() => handleSort("createdDate")}
        >
          تاریخ{" "}
          {sortField === "createdDate" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
      </div>

      {/* Table */}
      <table className="table table-zebra w-full text-right text-lg">
        <thead className="bg-base-200">
          <tr>
            <th>نام دامنه</th>
            <th>وضعیت</th>
            <th>فعال</th>
            <th>تاریخ</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {filteredDomains.map((d) => (
            <tr key={d.id}>
              <td>{d.domain}</td>
              <td>
                <span className={`badge ${getBadgeColor(d.status)}`}>
                  {d.status === "pending"
                    ? "در انتظار"
                    : d.status === "verified"
                    ? "تایید شده"
                    : d.status === "unverified"
                    ? "تایید نشده"
                    : d.status === "rejected"
                    ? "رد شده"
                    : null}
                </span>
              </td>
              <td>{d.isActive ? "بله" : "خیر"}</td>
              <td>
                {new Date(d.createdDate * 1000).toLocaleDateString("fa-IR")}
              </td>
              <td className="w-2/12">
                <button className="btn btn-info ml-2" onClick={() => onEdit(d)}>
                  ویرایش
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => onDelete(d.id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {filteredDomains.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-xl">
          هیچ دامنه‌ای با این مشخصات پیدا نشد.
        </div>
      )}
    </div>
  );
}

function getBadgeColor(status) {
  switch (status) {
    case "verified":
      return "badge-success";
    case "pending":
      return "badge-warning";
    case "rejected":
      return "badge-error";
    default:
      return "badge-ghost";
  }
}
