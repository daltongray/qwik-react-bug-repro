/** @jsxImportSource react */

import * as MUIIcons from "@mui/icons-material";
import * as React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import { qwikify$ } from "@builder.io/qwik-react";
import { useState } from "react";

export enum ROUTES {
    UPLOAD = "UPLOAD",
    EXPLORE = "EXPLORE",
}


export type MenuConfig = Record<
    ROUTES,
    { text: string; href: string; icon: keyof typeof MUIIcons; index: number }
    >;


export type MUIFooterProps = {
    menu: MenuConfig;

    startingPage: ROUTES;
    onChange: any;
};

export const MUIFooter = qwikify$<MUIFooterProps>(
  ({ menu, onChange, startingPage }) => {
    const [value, setValue] = useState(menu[startingPage]?.index || 0);

    const darkTheme = createTheme({
      palette: {
        mode: "dark",
      },
    });

    const menuMap = Object.values(menu).sort((a, b) =>
      a?.index > b?.index ? 1 : 0
    );

    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <Box>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              if (onChange) onChange(newValue);
            }}
          >
            {menuMap.map(({ icon, text }) => {
              const Icon = MUIIcons[icon];

              return <BottomNavigationAction key={text} label={text} icon={<Icon />} />;
            })}
          </BottomNavigation>
        </Box>
      </ThemeProvider>
    );
  }
);
