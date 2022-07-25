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
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import type { NextPage } from "next";
import { useState } from "react";

type FormData = {
  email: string;
  passwordHash: string;
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

const Home: NextPage = () => {
  const { classes } = useStyles();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      email: "",
      passwordHash: "",
    },
  });

  const handleSubmit = async () => {
    const formData = form.values;
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log(result);
  };
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Welcome back to Mantine!
        </Title>
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
          <Button fullWidth mt="xl" size="md" type="submit">
            Login
          </Button>
        </form>

        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a">
            href="#"
            weight={700}
            onClick={(event) => event.preventDefault()}
          >
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
};

export default Home;
