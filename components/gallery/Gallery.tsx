"use client";

import { useState } from "react";
import Gallery from "./GalleryCard";

const allImages = [
  "/gallery/1.jpg",
  "/gallery/2.jpg",
  "/gallery/3.jpg",
  "/gallery/4.jpg",
  "/gallery/5.jpg",
  "/gallery/6.jpg",
  "/gallery/4.jpg",
  "/gallery/2.jpg",
  "/gallery/5.jpg",
];

export default function GalleryPage() {
  const [page, setPage] = useState(1);

  const imagesPerPage = 9;
  const totalPages = Math.ceil(allImages.length / imagesPerPage);
  const displayedImages = allImages.slice(
    (page - 1) * imagesPerPage,
    page * imagesPerPage
  );

  return (
    <Gallery
      images={displayedImages}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}
