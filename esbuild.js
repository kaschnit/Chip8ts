require("esbuild")
    .build({
        entryPoints: ["src/core/chip8.ts"],
        bundle: true,
        outfile: "build/out.js",
    })
    .catch(() => process.exit(1));
