import React from "react";
import styled from "styled-components";

const Container = styled.div`
  font-size: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  text-transform: uppercase;
  color: lightgrey;
  text-align: center;
`;

const PageNotFound = () => (
  <section>
    <Container>404: Page Not Found</Container>
  </section>
);

export default PageNotFound;
