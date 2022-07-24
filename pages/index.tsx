import { Button, Center, Container } from "@mantine/core";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Container>
      <Center
        style={{
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <Button>TESTING</Button>
      </Center>
    </Container>
  );
};

export default Home;
