import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from "@react-email/components";

export default function PasswordResetEmail({
  username,
  resetLink,
}) {
  return (
    <Html>
      <Body
        style={{
          backgroundColor: "#f4f7fb",
          fontFamily: "Arial, sans-serif",
          padding: "40px 20px",
        }}
      >
        <Container
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Heading
            style={{
              color: "#ea580c",
              textAlign: "center",
            }}
          >
            FOOTER FURNITURE
          </Heading>

          <Heading
            as="h2"
            style={{
              color: "#111827",
            }}
          >
            Hello {username},
          </Heading>

          <Text
            style={{
              color: "#6b7280",
              fontSize: "16px",
              lineHeight: "26px",
            }}
          >
            We received a request to reset your password.
            Click the button below to create a new password.
          </Text>

          <div style={{ textAlign: "center", margin: "40px 0" }}>
            {resetLink}
          </div>

          <Text
            style={{
              color: "#6b7280",
            }}
          >
            This link will expire in 1 hour for security
            reasons.
          </Text>

          <Text
            style={{
              color: "#6b7280",
            }}
          >
            If you did not request this password reset,
            you can safely ignore this email.
          </Text>

          <Text
            style={{
              fontSize: "13px",
              color: "#9ca3af",
            }}
          >
            If the button doesn't work, copy and paste
            this link into your browser:
          </Text>

          <Text
            style={{
              fontSize: "13px",
              color: "#ea580c",
              wordBreak: "break-all",
            }}
          >
            {resetLink}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}