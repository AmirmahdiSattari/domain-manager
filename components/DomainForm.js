"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function DomainForm({ onSave, editingDomain }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: null,
      domain: "",
      status: "pending",
      isActive: true,
    },
  });

  useEffect(() => {
    if (editingDomain) {
      reset({
        id: editingDomain.id ?? null,
        domain: editingDomain.domain ?? "",
        status: editingDomain.status ?? "pending",
        isActive:
          editingDomain.isActive === true || editingDomain.isActive === "true",
      });
    } else {
      reset({
        id: null,
        domain: "",
        status: "pending",
        isActive: true,
      });
    }
  }, [editingDomain, reset]);

  const onSubmit = (data) => {
    onSave(data);
    const drawerCheckbox = document.getElementById("my-drawer-4");
    if (drawerCheckbox) drawerCheckbox.checked = false;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start justify-center py-12 space-y-6"
    >
      <div className="form-control w-full">
        <label htmlFor="domain" className="label">
          <span className="label-text">نام دامنه</span>
        </label>
        <input
          type="text"
          id="domain"
          placeholder="مثلاً: example.com"
          className={`input input-bordered w-full ${
            errors.domain && "input-error"
          }`}
          {...register("domain", {
            required: "نام دامنه الزامی است.",
            pattern: {
              value: /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/,
              message: "فرمت دامنه معتبر نیست.",
            },
          })}
        />
        {errors.domain && (
          <p className="text-error text-sm mt-1">{errors.domain.message}</p>
        )}
      </div>

      <div className="form-control w-full">
        <label htmlFor="status" className="label">
          <span className="label-text">وضعیت دامنه</span>
        </label>
        <select
          id="status"
          className="select select-bordered w-full"
          {...register("status", { required: "وضعیت دامنه الزامی است." })}
        >
          <option value="pending">منتظر تایید</option>
          <option value="verified">تایید شده</option>
          <option value="rejected">رد شده</option>
        </select>
        {errors.status && (
          <p className="text-error text-sm mt-1">{errors.status.message}</p>
        )}
      </div>

      <div className="form-control w-full">
        <label htmlFor="isActive" className="label cursor-pointer">
          <span className="label-text">آیا فعال است؟</span>
          <input
            type="checkbox"
            id="isActive"
            className="toggle toggle-primary"
            {...register("isActive")}
          />
        </label>
      </div>

      <div className="w-full pt-2">
        <button type="submit" className="btn btn-primary w-full">
          {editingDomain ? "ویرایش دامنه" : "افزودن دامنه"}
        </button>
      </div>
    </form>
  );
}
