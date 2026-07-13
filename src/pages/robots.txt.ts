import { type GetServerSideProps } from "next";
import { env } from "~/env";

// Generated dynamically (instead of a static /public/robots.txt) so the Sitemap
// directive always points at the correct domain for the deployment.
const RobotsTxt = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${env.NEXT_PUBLIC_PROJECT_URL}/sitemap.xml`,
    "",
  ].join("\n");

  res.setHeader("Content-Type", "text/plain");
  res.write(body);
  res.end();

  return { props: {} };
};

export default RobotsTxt;
