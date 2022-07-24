import {
  Button,
  Center,
  Container,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import type { NextPage } from "next";

const Login: NextPage = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <>
      <Container>
        <Center
          style={{
            width: "100%",
            height: "100vh",
          }}
        >
          <Title order={1}>Change Color Schema</Title>
          <Button onClick={() => toggleColorScheme()}>Change</Button>
        </Center>
      </Container>
    </>
  );
};

export default Login;
