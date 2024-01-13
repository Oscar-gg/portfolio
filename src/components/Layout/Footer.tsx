import { api } from "~/utils/api";

export interface Route {
  name: string;
  path: string;
  height?: number;
}

export const Footer = ({ routes }: { routes: Route[] }) => {
  const { data: lastUpdate, isLoading } = api.github.fetchRepoDate.useQuery();

  const handleLinkClick = (id: string) => {
    const idNoHash = id.substring(1);
    const targetElement = document.getElementById(idNoHash);

    if (targetElement) {
      const offset = 100;
      const targetPosition = targetElement.offsetTop - offset;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="start-0 top-0 flex w-full flex-col flex-wrap items-center justify-between gap-3 bg-primary p-6 align-middle text-white">
      <ul className="mt-4 flex flex-row flex-wrap rounded-lg p-4 font-medium rtl:space-x-reverse md:mt-0  md:space-x-8 md:border-0  md:p-0 ">
        {routes.map((route) => (
          <li key={route.path}>
            <a
              // If the link is an id, then add an onClick handler to scroll to the element, else use default behaviour
              {...(route.path.startsWith("#")
                ? {
                    onClick: (e) => {
                      e.preventDefault();
                      handleLinkClick(route.path);
                    },
                  }
                : { href: route.path })}
              className="block rounded px-3 py-2 text-white duration-500 ease-in-out hover:text-palette-blue "
              aria-current="page"
            >
              {route.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex w-full flex-row flex-wrap items-center justify-between gap-3 bg-primary p-6 align-middle text-white">
        <a href="#">
          <span className="self-center whitespace-nowrap text-2xl font-semibold text-white">
            OAA
          </span>
        </a>

        {(lastUpdate ?? isLoading) && (
          <p>
            Last Update: {isLoading ? "Loading..." : lastUpdate?.toLocaleString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})}
          </p>
        )}
      </div>
    </div>
  );
};
