import figlet from "figlet";

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const body = figlet.textSync("Graph Explorer", "Banner3-D");
        return new Response(body);
    },


});

const label = figlet.textSync("GraphExp", "3D-ASCII");

console.log(label);
console.log(`Listening on http://localhost:${server.port} ...`);
