import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Preloader from "@components/Preloader";
import TextInput from "@components/TextInput";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Form } from "@components/ui/form";

import { useAuthContext } from "@contexts/AuthContext";

import LogoMain from "@images/logo-main.svg";

export default function LogInPage() {
  const { t } = useTranslation(["auth", "validation"]);
  const { isLoading, onLogIn } = useAuthContext();

  const formSchema = yup.object().shape({
    email: yup.string().email(t("auth:invalidEmail")).required(t("validation:required")),
    password: yup.string().min(3, t("auth:invalidPassword")).required(t("validation:required")),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="flex flex-col min-h-[100vh] p-3">
      <Card className="w-full max-w-sm m-auto">
        <Form {...form}>
          <div className="flex flex-col gap-6">
            <CardHeader>
              <div className="flex flex-col items-center gap-2 text-center">
                <LogoMain width={128} height={32} />
                <h1 className="font-bold mb-0! mt-1! text-2xl!">{t("auth:signIn")}</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  {t("auth:enterEmailAndPassword")}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <TextInput name="email" type="email" label={t("auth:emailLabel")} placeholder={t("auth:emailPlaceholder")} />
                <TextInput name="password" type="password" label={t("auth:passwordLabel")} />
                <Button className="w-full" onClick={form.handleSubmit(onLogIn)}>
                  {t("auth:loginButton")}
                </Button>
              </div>
            </CardContent>
          </div>
        </Form>
      </Card>
    </div>
  );
}
