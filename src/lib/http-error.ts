import axios from "axios";

export function getAxiosErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const serverMsg =
      (err.response?.data as any)?.error ||
      (err.response?.data as any)?.message ||
      err.message;

    switch (status) {
      case 400:
        return (
          serverMsg || "درخواست نامعتبر است. لطفاً ورودی‌ها را بررسی کنید."
        );
      case 401:
        return serverMsg || "نام کاربری یا رمز عبور اشتباه است.";
      case 403:
        return serverMsg || "دسترسی غیرمجاز.";
      case 404:
        return serverMsg || "موردی یافت نشد.";
      case 409:
        return serverMsg || "این کاربر از قبل وجود دارد.";
      case 422:
        return serverMsg || "اطلاعات ارسالی معتبر نیست.";
      case 500:
      case 502:
      case 503:
      case 504:
        return serverMsg || "خطای داخلی سرور. لطفاً بعداً تلاش کنید.";
      default:
        if (!err.response) {
          return "عدم اتصال به سرور یا مشکل شبکه.";
        }
        return serverMsg || "خطای نامشخص رخ داد.";
    }
  }
  return "خطای نامشخص رخ داد.";
}
