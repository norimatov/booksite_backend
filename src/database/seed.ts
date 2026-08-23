import dataSource from '../config/typeorm.config';
import { Category } from '../modules/categories/category.entity';
import { Book, BookFormat } from '../modules/books/book.entity';

async function seed() {
  await dataSource.initialize();

  const categoryRepo = dataSource.getRepository(Category);
  const bookRepo = dataSource.getRepository(Book);

  const categoriesData = [
    { name: 'Badiiy adabiyot', icon: '📖', colorHex: '#1F9D6B' },
    { name: 'Ilmiy-ommabop', icon: '🔬', colorHex: '#2563EB' },
    { name: 'Motivatsiya', icon: '🔥', colorHex: '#D4A017' },
    { name: 'Tarix', icon: '🏛️', colorHex: '#9333EA' },
    { name: 'Biznes', icon: '💼', colorHex: '#DC2626' },
    { name: 'Bolalar uchun', icon: '🧸', colorHex: '#EC4899' },
  ];

  const categories: Category[] = [];
  for (const c of categoriesData) {
    let cat = await categoryRepo.findOne({ where: { name: c.name } });
    if (!cat) {
      cat = await categoryRepo.save(categoryRepo.create(c));
    }
    categories.push(cat);
  }

  const cover = (seedName: string) =>
    `https://picsum.photos/seed/${seedName}/400/600`;

  const booksData = [
    {
      title: 'Sariq devni minib',
      author: "Xudoyberdi To'xtaboyev",
      description: "O'zbek bolalar adabiyotining sara namunasi. Xayolot va haqiqat chegarasida kechadigan sarguzasht.",
      totalPages: 240,
      isPremiumOnly: false,
      format: BookFormat.TEXT,
      categories: [categories[0], categories[5]],
      coverUrl: cover('sariq-dev'),
      viewsCount: 15420,
      startedCount: 3210,
      averageRating: 4.7,
      reviewsCount: 812,
      price: 38000,
      deliveryAvailable: true,
      language: "O'zbek",
      publishedYear: 1966,
    },
    {
      title: 'Diplomat',
      author: 'Toxir Malik',
      description: "Zamonaviy detektiv-ijtimoiy roman. Adolat va insof haqidagi murakkab hikoya.",
      totalPages: 320,
      isPremiumOnly: true,
      format: BookFormat.BOTH,
      categories: [categories[0]],
      coverUrl: cover('diplomat'),
      viewsCount: 9870,
      startedCount: 2140,
      averageRating: 4.5,
      reviewsCount: 456,
      price: 52000,
      deliveryAvailable: true,
      language: "O'zbek",
      publishedYear: 2005,
    },
    {
      title: 'Odat kuchi',
      author: 'Charlz Duhigg',
      description: "Odatlarni o'zgartirish ilmi — nega ba'zi odatlar bizni boshqaradi va ularni qanday o'zgartirish mumkin.",
      totalPages: 280,
      isPremiumOnly: true,
      format: BookFormat.BOTH,
      categories: [categories[2], categories[4]],
      coverUrl: cover('odat-kuchi'),
      viewsCount: 22100,
      startedCount: 6890,
      averageRating: 4.8,
      reviewsCount: 1203,
      price: 47000,
      deliveryAvailable: true,
      language: 'Rus tilidan tarjima',
      publishedYear: 2012,
    },
    {
      title: "O'tkan kunlar",
      author: "Abdulla Qodiriy",
      description: "O'zbek adabiyotining birinchi romani. Otabek va Kumush sevgisi haqidagi mangu asar.",
      totalPages: 400,
      isPremiumOnly: false,
      format: BookFormat.TEXT,
      categories: [categories[0], categories[3]],
      coverUrl: cover('otkan-kunlar'),
      viewsCount: 41200,
      startedCount: 12400,
      averageRating: 4.9,
      reviewsCount: 3021,
      price: 42000,
      deliveryAvailable: true,
      language: "O'zbek",
      publishedYear: 1926,
    },
    {
      title: "Sapiens: Insoniyatning qisqacha tarixi",
      author: 'Yuval Noa Harari',
      description: "Insoniyat tarixiga chuqur va tanqidiy nazar. Kognitiv inqilobdan sun'iy intellekt davrigacha.",
      totalPages: 460,
      isPremiumOnly: true,
      format: BookFormat.BOTH,
      categories: [categories[1], categories[3]],
      coverUrl: cover('sapiens'),
      viewsCount: 33500,
      startedCount: 8900,
      averageRating: 4.6,
      reviewsCount: 1890,
      price: 61000,
      deliveryAvailable: true,
      language: 'Ingliz tilidan tarjima',
      publishedYear: 2011,
    },
    {
      title: 'Boy va kambag\'al otaning tarbiyasi',
      author: 'Robert Kiyosaki',
      description: "Moliyaviy savodxonlik haqida dunyoning eng ko'p sotilgan kitoblaridan biri.",
      totalPages: 220,
      isPremiumOnly: false,
      format: BookFormat.TEXT,
      categories: [categories[4], categories[2]],
      coverUrl: cover('boy-kambagal'),
      viewsCount: 27800,
      startedCount: 7650,
      averageRating: 4.4,
      reviewsCount: 1345,
      price: 39000,
      deliveryAvailable: true,
      language: 'Ingliz tilidan tarjima',
      publishedYear: 1997,
    },
    {
      title: "Alkimyogar",
      author: 'Paulo Koelo',
      description: "O'z taqdirini izlagan yosh cho'pon Santyago haqidagi ramziy hikoya.",
      totalPages: 190,
      isPremiumOnly: false,
      format: BookFormat.BOTH,
      categories: [categories[0], categories[2]],
      coverUrl: cover('alkimyogar'),
      viewsCount: 36700,
      startedCount: 11200,
      averageRating: 4.7,
      reviewsCount: 2456,
      price: 35000,
      deliveryAvailable: true,
      language: 'Portugal tilidan tarjima',
      publishedYear: 1988,
    },
    {
      title: 'Kimyo asoslari',
      author: 'Prof. Salim Nazarov',
      description: "Maktab va universitet talabalari uchun kimyo faniga zamonaviy kirish.",
      totalPages: 340,
      isPremiumOnly: true,
      format: BookFormat.TEXT,
      categories: [categories[1]],
      coverUrl: cover('kimyo-asoslari'),
      viewsCount: 5400,
      startedCount: 980,
      averageRating: 4.2,
      reviewsCount: 210,
      price: 55000,
      deliveryAvailable: true,
      language: "O'zbek",
      publishedYear: 2019,
    },
    {
      title: 'Yetti gumbaz',
      author: "Mirkarim Osim",
      description: "Tarixiy roman — Samarqand va Buxoro atrofidagi voqealar tasviri.",
      totalPages: 260,
      isPremiumOnly: false,
      format: BookFormat.TEXT,
      categories: [categories[3], categories[0]],
      coverUrl: cover('yetti-gumbaz'),
      viewsCount: 12300,
      startedCount: 3400,
      averageRating: 4.5,
      reviewsCount: 670,
      price: 40000,
      deliveryAvailable: true,
      language: "O'zbek",
      publishedYear: 1970,
    },
    {
      title: "Atomik odatlar",
      author: 'Jeyms Klir',
      description: "Kichik o'zgarishlar orqali katta natijalarga erishish strategiyasi.",
      totalPages: 300,
      isPremiumOnly: true,
      format: BookFormat.BOTH,
      categories: [categories[2], categories[4]],
      coverUrl: cover('atomik-odatlar'),
      viewsCount: 19800,
      startedCount: 5230,
      averageRating: 4.8,
      reviewsCount: 980,
      price: 49000,
      deliveryAvailable: true,
      language: 'Ingliz tilidan tarjima',
      publishedYear: 2018,
    },
  ];

  for (const b of booksData) {
    const exists = await bookRepo.findOne({ where: { title: b.title } });
    if (!exists) {
      await bookRepo.save(bookRepo.create(b as any));
    } else {
      await bookRepo.update(exists.id, b as any);
    }
  }

  console.log(`Seed muvaffaqiyatli yakunlandi: ${booksData.length} ta kitob`);
  await dataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
