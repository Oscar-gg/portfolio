import { useEffect } from "react";
import { api } from "~/utils/api";

// Fires once per browser session per post, so refreshing the page doesn't inflate the count.
export const ViewCounter = ({ slug }: { slug: string }) => {
  const incrementView = api.blog.incrementView.useMutation();

  useEffect(() => {
    const key = `viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    incrementView.mutate({ slug });
  }, [slug]);

  return null;
};
