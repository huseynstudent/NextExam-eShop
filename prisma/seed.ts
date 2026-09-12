import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Phones", imageUrl: "/assets/phone.png", sortOrder: 0 },
  { name: "PlayStations", imageUrl: "/assets/playstation.png", sortOrder: 1 },
  { name: "Digital Watches", imageUrl: "/assets/watch.png", sortOrder: 2 },
  { name: "Joysticks", imageUrl: "/assets/joystick.png", sortOrder: 3 },
  { name: "EarPods", imageUrl: "/assets/airpod.png", sortOrder: 4 },
  { name: "Laptops", imageUrl: "/assets/laptop.png", sortOrder: 5 },
];

const products = [
  {
    name: "iPad (9th Gen)",
    price: 870,
    imageUrl: "/assets/tablet.png",
    section: "best-selling",
    sortOrder: 0,
  },
  {
    name: "Drone With Camera",
    price: 600,
    imageUrl: "/assets/drone.png",
    section: "best-selling",
    sortOrder: 1,
  },
  {
    name: "Apple Watch (2nd Gen)",
    price: 400,
    imageUrl: "/assets/watch2.png",
    section: "best-selling",
    sortOrder: 2,
  },
  {
    name: "Ultra HD TV",
    price: 2000,
    imageUrl: "/assets/monitor.png",
    section: "best-selling",
    sortOrder: 3,
  },
  {
    name: "Bluetooth Speaker",
    price: 75,
    imageUrl: "/assets/speaker.png",
    section: "best-selling",
    sortOrder: 4,
  },
];

async function main() {
  // Idempotent — safe to re-run. Clears existing catalog rows first so you
  // don't end up with duplicates every time you run `npm run db:seed`.
  console.log("Clearing existing catalog...");
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.create({ data: c });
  }

  console.log("Seeding products...");
  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
