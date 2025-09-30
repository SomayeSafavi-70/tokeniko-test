"use client";

import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Alert,
  Spinner,
} from "react-bootstrap";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateUserMutation } from "../hooks/use-users";

type FormValues = {
  username: string;
  email: string;
  name?: string;
  mobile?: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const createUserMut = useCreateUserMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({ mode: "onTouched" });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await createUserMut.mutateAsync({
        username: values.username.trim(),
        password: values.password,
        email: values.email.trim(),
        name: values.name?.trim(),
        mobile: values.mobile?.trim(),
      });
      router.replace("/authentication/signin");
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "ثبت نام ناموفق بود. لطفاً اطلاعات را بررسی کنید.";
      setServerError(msg);
    }
  };

  const pwd = watch("password");

  return (
    <Row className="align-items-center justify-content-center g-0">
      <Col xxl={12} lg={12} md={12} xs={12}>
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4 text-center">
              <Link href="/">
                <Image
                  src="/images/brand/logo/logo-primary.svg"
                  className="mb-2"
                  alt=""
                />
              </Link>
              <p className="mb-4" dir="rtl">
                لطفا اطلاعات کاربری خود را تکمیل نمایید.
              </p>
            </div>

            <Form dir="rtl" onSubmit={handleSubmit(onSubmit)} noValidate>
              {serverError && (
                <Alert variant="danger" className="mb-3">
                  {serverError}
                </Alert>
              )}

              <Form.Group className="mb-3" controlId="username">
                <Form.Label>نام کاربری</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="نام کاربری"
                  isInvalid={!!errors.username}
                  {...register("username", {
                    required: "نام کاربری الزامی است",
                    minLength: { value: 3, message: "حداقل ۳ کاراکتر" },
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>ایمیل</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="لطفا ایمیل خود را وارد نمایید"
                  isInvalid={!!errors.email}
                  {...register("email", {
                    required: "ایمیل الزامی است",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "ایمیل معتبر نیست",
                    },
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="name">
                <Form.Label>نام و نام خانوادگی </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="مثال: صُمیه صفوی"
                  {...register("name")}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="mobile" >
                <Form.Label>موبایل </Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="0919*******"
                  {...register("mobile")}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>رمز عبور</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="**************"
                  isInvalid={!!errors.password}
                  {...register("password", {
                    required: "رمزعبور الزامی است",
                    minLength: { value: 6, message: "حداقل ۶ کاراکتر" },
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirm-password">
                <Form.Label>تکرار رمز عبور</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="**************"
                  isInvalid={!!errors.confirmPassword}
                  {...register("confirmPassword", {
                    required: "تکرار رمزعبور الزامی است",
                    validate: (v) => v === pwd || "با رمز عبور یکسان نیست",
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || createUserMut.isPending}
                >
                  {createUserMut.isPending ? (
                    <>
                      <Spinner size="sm" className="me-2" /> در حال ثبت…
                    </>
                  ) : (
                    "ثبت نام"
                  )}
                </Button>
              </div>

              <Link
                href="/authentication/signin"
                className="btn btn-outline-primary d-block w-100 fs-5 mt-3"
              >
                عضویت دارم، ورود
              </Link>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
