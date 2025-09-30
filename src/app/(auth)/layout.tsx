import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="row w-100 justify-content-center g-0">
            <div className="col-12 col-md-8 col-lg-6 col-xxl-4 py-4">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
