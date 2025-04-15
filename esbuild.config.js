import esbuild from "esbuild";
import { glob } from "glob";
import copyfiles from "copyfiles";

const startTime = Date.now();

// Server build
let ctx = await esbuild.context({
  entryPoints: await glob(["src/server/**/*.ts", "src/server/**/*.js"]),
  outdir: "dist/server",
  outbase: "src/server",
  minify: true,
  platform: "node",
});

await ctx.rebuild();
await ctx.dispose();

// Client build
ctx = await esbuild.context({
  entryPoints: await glob([
    "src/client/**/*.ts",
    "src/client/**/*.js",
    "src/client/**/*.css",
  ]),
  outdir: "dist/client",
  outbase: "src/client",
  minify: true,
});

await ctx.rebuild();
await ctx.dispose();

// Copy static files
copyfiles(
  ["./src/**/*", "dist"],
  { up: 1, exclude: ["**/*.ts", "**/*.css", "**/*.js"] },
  (err) => {
    if (err) {
      console.error("Error copying static files:", err);
    }
  }
);

const endTime = Date.now();
const duration = endTime - startTime;
console.log(
  `Build completed in ${duration} ms.`
);
