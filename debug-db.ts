import { Production, Initiative } from "./lib/db/models";

async function check() {
  const projects = await Production.findAll();
  console.log("PROJECTS:", JSON.stringify(projects, null, 2));

  const initiatives = await Initiative.findAll();
  console.log("INITIATIVES:", JSON.stringify(initiatives, null, 2));

  process.exit(0);
}

check();
