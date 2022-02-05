import React from "react";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import { LayoutFormContent } from "../../styled/LayoutFormContent";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

const AuthPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary600};
`;

export default function Auth() {
  return (
    <div>
      <AuthPage>
        <LayoutFormContent width={"500px"}>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </LayoutFormContent>
      </AuthPage>
    </div>
  );
}
