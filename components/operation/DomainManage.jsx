"use client";

import { useEffect, useRef, useState } from "react";

import DomainForm from "@/components/DomainForm";
import DomainTable from "@/components/DomainTable";

export default function DomainManage() {
  const [domains, setDomains] = useState([]);
  const [editingDomain, setEditingDomain] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const drawerRef = useRef(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    const response = await fetch(
      "https://6797aa2bc2c861de0c6d964c.mockapi.io/domain"
    );
    const data = await response.json();
    setDomains(data);
  };

  const showToastMessage = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 3000);
  };

  const handleEdit = (domain) => {
    setEditingDomain(domain);
    if (drawerRef.current) {
      drawerRef.current.checked = true;
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(
      `https://6797aa2bc2c861de0c6d964c.mockapi.io/domain/${id}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      setDomains(domains.filter((d) => d.id !== id));
      showToastMessage("دامنه با موفقیت حذف شد.");
    }
  };

  const handleSave = async (domain) => {
    let response;
    if (domain.id) {
      // Update existing domain
      response = await fetch(
        `https://6797aa2bc2c861de0c6d964c.mockapi.io/domain/${domain.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(domain),
        }
      );
    } else {
      // Add new domain
      response = await fetch(
        "https://6797aa2bc2c861de0c6d964c.mockapi.io/domain",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(domain),
        }
      );
    }

    const updatedDomain = await response.json();

    if (domain.id) {
      // Update the domain in the list
      setDomains(
        domains.map((d) => (d.id === updatedDomain.id ? updatedDomain : d))
      );
      showToastMessage("دامنه با موفقیت ویرایش شد.");
    } else {
      // Add the new domain to the list
      setDomains([...domains, updatedDomain]);
      showToastMessage("دامنه جدید با موفقیت اضافه شد.");
    }

    if (drawerRef.current) {
      drawerRef.current.checked = false;
    }
  };

  return (
    <div>
      {/* ✅ Toast Notification */}
      {toast.visible && (
        <div className="toast toast-start z-30">
          <div className="alert alert-info">
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* ✅ Add Domain Button */}

      <div className="flex items-center justify-between  w-11/12 mx-auto  py-10">
        <p className="text-5xl font-bold text-slate-400">{`مدیریت دامنه ها`}</p>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingDomain(null);
            if (drawerRef.current) drawerRef.current.checked = true;
          }}
        >
          افزودن دامنه
        </button>
      </div>
      {/* ✅ Drawer for Add/Edit */}
      <div className="drawer">
        <input
          ref={drawerRef}
          id="my-drawer-4"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content min-w-3/12">
          <DomainTable
            domains={domains}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full  min-w-3/12 p-4">
            <li>
              <DomainForm onSave={handleSave} editingDomain={editingDomain} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
