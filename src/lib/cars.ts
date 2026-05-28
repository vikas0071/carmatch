import { prisma } from "./prisma";
import { CarDisplay, Car } from "./types";

export function parseCarForDisplay(car: Car): CarDisplay {
  return {
    ...car,
    features: JSON.parse(car.features) as string[],
    pros: JSON.parse(car.pros) as string[],
    cons: JSON.parse(car.cons) as string[],
  };
}

export async function getAllCars(): Promise<CarDisplay[]> {
  const cars = await prisma.car.findMany();
  return cars.map(parseCarForDisplay);
}

export async function getCarById(id: number): Promise<CarDisplay | null> {
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) return null;
  return parseCarForDisplay(car);
}

export async function getCarsByIds(ids: number[]): Promise<CarDisplay[]> {
  const cars = await prisma.car.findMany({
    where: { id: { in: ids } },
  });
  return cars.map(parseCarForDisplay);
}

export function getCarsAsContextString(cars: CarDisplay[]): string {
  return JSON.stringify(
    cars.map((c) => ({
      id: c.id,
      make: c.make,
      model: c.model,
      variant: c.variant,
      year: c.year,
      price_lakh: c.priceLakh,
      fuel_type: c.fuelType,
      transmission: c.transmission,
      body_type: c.bodyType,
      mileage_kmpl: c.mileageKmpl,
      engine_cc: c.engineCc,
      seats: c.seats,
      safety_rating: c.safetyRating,
      features: c.features,
      pros: c.pros,
      cons: c.cons,
      summary: c.summary,
    })),
    null,
    2
  );
}
