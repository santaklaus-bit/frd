import { Production } from "./lib/db/models";

async function test() {
  const p = await Production.findOne({ where: { slug: "test-projet" } });
  if (p) {
    await p.update({ image: "/uploads/test-image.jpg" });
    console.log("Updated test-projet with image.");
  } else {
    console.log("test-projet not found.");
  }
  process.exit(0);
}

test();
