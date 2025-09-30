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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../hooks/use-users";

type FormValues = {
  username: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onTouched" });

  const loginMut = useLoginMutation();

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await loginMut.mutateAsync({
        identifier: values.username.trim(),
        password: values.password,
      });
      router.replace("/dashboard");
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "ورود ناموفق بود. لطفاً نام کاربری و رمز عبور را بررسی کنید.";
      setServerError(msg);
    }
  };

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
              <p className="mb-4">ورود / ثبت نام</p>
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
                  placeholder="موبایل / ایمیل / نام‌کاربری"
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

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>رمزعبور</Form.Label>
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

              <div className="d-grid">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loginMut.isPending}
                >
                  {loginMut.isPending ? (
                    <>
                      <Spinner size="sm" className="me-2" /> در حال ورود…
                    </>
                  ) : (
                    "ورود"
                  )}
                </Button>
              </div>

              <Link
                href="/authentication/signup"
                className="btn btn-outline-primary d-block w-100 fs-5 mt-3"
              >
                ثبت نام
              </Link>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
