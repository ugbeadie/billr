import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

interface ForgotPasswordEmailProps {
  username?: string;
  resetUrl?: string;
  userEmail?: string;
}

const ForgotPasswordEmail = (props: ForgotPasswordEmailProps) => {
  const { username, resetUrl, userEmail } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Text className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                Reset Your Password
              </Text>
              <Text className="text-[16px] text-gray-600 m-0">
                We received a request to reset your password
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                Hi there, {username ? username : "user"}!
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                Someone requested a password reset for your account associated
                with <strong>{userEmail}</strong>. If this was you, click the
                button below to reset your password.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px]">
                If you didn't request this, you can safely ignore this email.
                Your password will remain unchanged.
              </Text>
            </Section>

            {/* Reset Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={resetUrl}
                className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border hover:bg-blue-700"
              >
                Reset Password
              </Button>
            </Section>

            {/* Security Notice */}
            <Section className="bg-gray-50 p-[24px] rounded-[8px] mb-[32px]">
              <Text className="text-[14px] text-gray-600 m-0 mb-[8px]">
                <strong>Security Notice:</strong>
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 mb-[8px]">
                • This link will expire in 24 hours for your security
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 mb-[8px]">
                • Only use this link if you requested a password reset
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                • Never share this email with others
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[24px]" />

            {/* Alternative Link */}
            <Section className="mb-[24px]">
              <Text className="text-[14px] text-gray-600 mb-[8px]">
                Having trouble with the button? Copy and paste this link into
                your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all">
                {resetUrl}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                This email was sent to {userEmail}
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                © 2026 Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                123 Business Street, Port Harcourt, Nigeria
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPasswordEmail;
