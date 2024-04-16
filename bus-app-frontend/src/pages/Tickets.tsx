import { useAuthStore } from "@/stores/authStore";

export default function () {
  const email = useAuthStore((state) => state.email);

  return (
    <>
      <div>{email}</div>
    </>
  );
}
