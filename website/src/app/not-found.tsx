import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="font-mono-tech text-sm text-muted">404</p>
      <h1 className="font-display mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
        This page isn&apos;t in the answer either.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get
        you back to somewhere useful.
      </p>
      <LinkButton href="/" className="mt-8">
        Back to home
      </LinkButton>
    </Container>
  );
}
