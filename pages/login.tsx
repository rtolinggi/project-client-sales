import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Notification,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import Axios from "../libs/axios";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconX } from "@tabler/icons";
import { useState } from "react";

type LoginProps = {
  email: string;
  passwordHash: string;
};

type ErrorMessage = {
  response: {
    data: {
      message: string;
    };
  };
};

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  passwordHash: z
    .string()
    .min(6, { message: "Password should have at least 6 letters" }),
});

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: "100vh",
    maxWidth: 400,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const Login: NextPage = () => {
  const { classes } = useStyles();
  const [errMessage, setErrMessage] = useState<string>("");
  const router = useRouter();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      email: "",
      passwordHash: "",
    },
  });

  const postLogin = async (data: LoginProps) => {
    const response = await Axios.post("login", data);
    return await response.data;
  };

  const mutation = useMutation(postLogin, {
    onError(error: ErrorMessage, variables, context) {
      const message = error.response.data.message;
      setErrMessage(message);
    },
    onSuccess(data, variables, context) {
      console.log(data);
      router.push("dashboard");
    },
  });

  const handleSubmit = async () => {
    console.log(form.values);
    mutation.mutate(form.values);
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={mutation.isError ? 25 : 50}
        >
          Login Admin
        </Title>
        {mutation.isError && (
          <Notification icon={<IconX size={14} />} color="red" mb={25}>
            {errMessage}
          </Notification>
        )}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email address"
            required
            placeholder="hello@gmail.com"
            size="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            required
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps("passwordHash")}
          />
          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button
            variant="gradient"
            fullWidth
            mt="xl"
            size="md"
            type="submit"
            loading={mutation.isLoading}
          >
            Login
          </Button>
        </form>

        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Link href="register">
            <Anchor weight={700}>Register</Anchor>
          </Link>
        </Text>
      </Paper>
    </div>
  );
};

export default Login;
