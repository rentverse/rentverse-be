"use strict";

export default {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("provinces", [
      { name: "Bali", created_at: new Date(), updated_at: new Date() },
      {
        name: "Bangka Belitung",
        created_at: new Date(),
        updated_at: new Date(),
      },
      { name: "Banten", created_at: new Date(), updated_at: new Date() },
      { name: "Bengkulu", created_at: new Date(), updated_at: new Date() },
      {
        name: "Daerah Istimewa Yogyakarta",
        created_at: new Date(),
        updated_at: new Date(),
      },
      { name: "DKI Jakarta", created_at: new Date(), updated_at: new Date() },
      { name: "Gorontalo", created_at: new Date(), updated_at: new Date() },
      { name: "Jambi", created_at: new Date(), updated_at: new Date() },
      { name: "Jawa Barat", created_at: new Date(), updated_at: new Date() },
      { name: "Jawa Tengah", created_at: new Date(), updated_at: new Date() },
      { name: "Jawa Timur", created_at: new Date(), updated_at: new Date() },
      {
        name: "Kalimantan Barat",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Kalimantan Selatan",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Kalimantan Tengah",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Kalimantan Timur",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Kalimantan Utara",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Kepulauan Riau",
        created_at: new Date(),
        updated_at: new Date(),
      },
      { name: "Lampung", created_at: new Date(), updated_at: new Date() },
      { name: "Maluku", created_at: new Date(), updated_at: new Date() },
      { name: "Maluku Utara", created_at: new Date(), updated_at: new Date() },
      {
        name: "Nanggroe Aceh Darussalam",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Nusa Tenggara Barat",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Nusa Tenggara Timur",
        created_at: new Date(),
        updated_at: new Date(),
      },
      { name: "Papua", created_at: new Date(), updated_at: new Date() },
      { name: "Papua Barat", created_at: new Date(), updated_at: new Date() },
      {
        name: "Papua Barat Daya",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Papua Pegunungan",
        created_at: new Date(),
        updated_at: new Date(),
      },
      { name: "Papua Selatan", created_at: new Date(), updated_at: new Date() },
      { name: "Papua Tengah", created_at: new Date(), updated_at: new Date() },
      { name: "Riau", created_at: new Date(), updated_at: new Date() },
      {
        name: "Sulawesi Barat",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sulawesi Selatan",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sulawesi Tengah",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sulawesi Tenggara",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sulawesi Utara",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sumatera Barat",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sumatera Selatan",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sumatera Utara",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("provinces", null, {});
  },
};
