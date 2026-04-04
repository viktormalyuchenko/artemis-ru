import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Твой основной домен
  const baseUrl = "https://artemis.viktoor.ru";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always", // Постоянно меняется (цифры телеметрии)
      priority: 1.0, // Самая важная страница
    },
    {
      url: `${baseUrl}/mission`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/timeline`,
      lastModified: new Date(),
      changeFrequency: "daily", // По ходу миссии этапы будут меняться на "Пройдено"
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
