import { component$, Slot } from '@builder.io/qwik';
import Header from '../components/header/header';
import {MenuConfig, MUIFooter, ROUTES} from "~/integrations/react/layout";
import {useLocation, useNavigate} from "@builder.io/qwik-city";

export const menu = {
    [ROUTES.EXPLORE]: {
        href: "/upload",
        icon: "TravelExplore",
        index: 1,
        text: "Explore",
    },
    [ROUTES.UPLOAD]: {
        href: "/upload",
        icon: "Drafts",
        index: 0,
        text: "Upload",
    },
}  as MenuConfig

export default component$(() => {

    const { pathname } = useLocation();

    const navigate = useNavigate();

    return (
    <>
      <main>
          <MUIFooter
              menu={menu}
              startingPage={pathname as ROUTES}
              // @ts-ignore
              onChange$={(page: number) => {
                  console.log({ page });
                  navigate.path = Object.values(menu).filter(({index})=>index === page)[0].href;
              }}
          />
        <Header />
        <section>
          <Slot />
        </section>

      </main>
      <footer>

        <a href="https://www.builder.io/" target="_blank">
          Made with ♡ by Builder.io
        </a>
      </footer>
    </>
  );
});
