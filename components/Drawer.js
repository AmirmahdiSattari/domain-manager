"use client"

export default function Drawer({ children, open, onClose }) {
    console.log("salam")
    return (
      <div className={`drawer drawer-end drawer-open ${open ? 'drawer-open' : ''}`}>
        <div className="drawer-side z-50">
          <label className="drawer-overlay" onClick={onClose}></label>
          <div className="p-4 w-80 min-h-full bg-base-100 text-base-content">
            {children}
          </div>
        </div>
      </div>
    )
  }
  