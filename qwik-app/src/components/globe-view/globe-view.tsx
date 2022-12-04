import * as THREE from "three";
import {
  component$,
  noSerialize,
  useClientEffect$,
  useSignal,
} from "@builder.io/qwik";

 import { Signal } from "@builder.io/qwik";
export enum BREAKPOINTS {
    MOBILE = "MOBILE",
    TABLET = "TABLET",
    LAPTOP = "LAPTOP",
    DESKTOP = "DESKTOP",
}
const { LAPTOP, MOBILE, TABLET, DESKTOP } = BREAKPOINTS;

export const sizes = {
    globe: {
        [DESKTOP]: { height: 800, width: 1025 },
        [LAPTOP]: { height: 800, width: 768 },
        [MOBILE]: { height: 600, width: 320 },
        [TABLET]: { height: 100, width: 481 },
    },
};

export type GlobeProps = {
    breakpoint: Signal<BREAKPOINTS>;
};

export const GlobeView = component$(({ breakpoint }: GlobeProps) => {
  const outputRef = useSignal<HTMLElement>();
  const containerRef = useSignal<HTMLElement>();
  const globeRef = useSignal<any>();

  const { height, width } = sizes.globe[breakpoint.value];

  useClientEffect$(
    async () => {
      const globePackage = await import("globe.gl");
      const Globe = globePackage.default;

      if (outputRef.value) {
        globeRef.value = noSerialize(
          Globe()
            .globeImageUrl(
              "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            )
            .bumpImageUrl(
              "//unpkg.com/three-globe/example/img/earth-topology.png"
            )
            .backgroundImageUrl(
              "//unpkg.com/three-globe/example/img/night-sky.png"
            )(outputRef.value)
        );

        if (globeRef.value) {
          // custom globe material
          const globeMaterial = globeRef.value.globeMaterial();
          // @ts-ignore
          globeMaterial.bumpScale = 10;
          new THREE.TextureLoader().load(
            "//unpkg.com/three-globe/example/img/earth-water.png",
            (texture) => {
              // @ts-ignore
              globeMaterial.specularMap = texture;
              // @ts-ignore
              globeMaterial.specular = new THREE.Color("grey");
              // @ts-ignore
              globeMaterial.shininess = 0;
            }
          );

          if (globeRef.value && containerRef.value) {
            console.log({
              containerREf: containerRef.value.clientHeight,
              w: containerRef.value.clientWidth,
            });
            globeRef.value.height(containerRef.value.clientHeight);
            globeRef.value.width(containerRef.value.clientWidth);
          }

          globeRef.value.pointOfView({
            lat: 34.7304,
            lng: -86.5861,
          });
        }

        setTimeout(() => {
          // wait for scene to be populated (asynchronously)

          if (globeRef.value) {
            const directionalLight = globeRef.value
              .scene()
              .children.find((obj3d: any) => obj3d.type === "DirectionalLight");
            directionalLight && directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect
          }
        }, 200);
      }
    },
    {
      eagerness: "idle", // 'load' | 'visible' | 'idle'
    }
  );
  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <div
        onResize$={() => {
          if (globeRef.value && containerRef.value) {
            globeRef.value.height(containerRef.value.clientHeight);
            globeRef.value.width(containerRef.value.clientWidth);
          }
        }}
        ref={outputRef}
        style={{ height: height + "px", minWidth: width + "px" }}
      />
    </div>
  );
});
