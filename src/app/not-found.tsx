import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-6 text-[clamp(3rem,10vw,10rem)]">Nothing here yet</h1>
      <Link href="/" className="link-line mt-10 text-lg">
        Back to home
      </Link>
    </section>
  );
}
